'use strict';

const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

const { asyncHandler } = require('../http');
const {
  validateRegistration,
  validateLogin,
  hasErrors,
  normalizeEmail,
} = require('../validate');
const { issueCsrfToken, requireAuth, audit } = require('../middleware');
const { withTransaction } = require('../db');
const { createEmailService } = require('../email');

const RESET_TOKEN_TTL_MINUTES = 60;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

const DUMMY_HASH = bcrypt.hashSync('creatorpilot-timing-equalizer', 12);

function publicUser(user) {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    status: user.status,
    language: user.preferred_language,
    emailVerified: Boolean(user.email_verified_at),
    createdAt: user.created_at,
    lastLoginAt: user.last_login_at,
  };
}

function slugify(value) {
  const base = String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return base || 'workspace';
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function buildAuthRoutes({ pool, config }) {
  const router = express.Router();
  const mailer = createEmailService(config);

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json({
      error: { code: 'rate_limited', message: 'Too many login attempts. Try again in 15 minutes.' },
    }),
  });

  const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json({
      error: { code: 'rate_limited', message: 'Too many accounts created from this network. Try again later.' },
    }),
  });

  const recoveryLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json({
      error: { code: 'rate_limited', message: 'Too many recovery requests. Try again later.' },
    }),
  });

  // Deliberately not discriminated: unknown emails and wrong passwords look identical.
  router.get('/csrf', (req, res) => {
    const token = issueCsrfToken(req);
    if (!token) {
      return res.status(400).json({
        error: { code: 'session_unavailable', message: 'Could not start a session.' },
      });
    }
    return res.json({ csrfToken: token });
  });

  router.post(
    '/register',
    registerLimiter,
    asyncHandler(async (req, res) => {
      const { errors, values } = validateRegistration(req.body);
      if (hasErrors(errors)) return res.status(400).json({ error: { code: 'validation_failed', message: 'Please check the highlighted fields.', details: errors } });

      const existing = await pool.query('SELECT 1 FROM users WHERE LOWER(email) = $1', [values.email]);
      if (existing.rowCount > 0) {
        return res.status(409).json({
          error: { code: 'email_taken', message: 'An account already exists for this email.', details: { email: 'already_registered' } },
        });
      }

      const passwordHash = await bcrypt.hash(values.password, config.bcryptRounds);

      const created = await withTransaction(pool, async (client) => {
        const userResult = await client.query(
          `INSERT INTO users (full_name, email, password_hash, status, preferred_language)
           VALUES ($1, $2, $3, 'pending', $4)
           RETURNING id, full_name, email, status, preferred_language, email_verified_at, created_at, last_login_at`,
          [values.fullName, values.email, passwordHash, values.language]
        );
        const user = userResult.rows[0];

        const slug = `${slugify(values.fullName)}-${crypto.randomBytes(4).toString('hex')}`;
        const workspaceResult = await client.query(
          `INSERT INTO workspaces (name, slug, owner_user_id) VALUES ($1, $2, $3) RETURNING id, name, slug`,
          [values.fullName, slug, user.id]
        );

        await client.query(
          `INSERT INTO workspace_members (workspace_id, user_id, role_id, status, joined_at)
           SELECT $1, $2, id, 'active', NOW() FROM roles WHERE code = 'owner'`,
          [workspaceResult.rows[0].id, user.id]
        );

        return { user, workspace: workspaceResult.rows[0] };
      });

      await audit(pool, req, 'auth.register', {
        userId: created.user.id,
        workspaceId: created.workspace.id,
        entity: 'user',
        entityId: created.user.id,
      });

      await audit(pool, req, 'workspace.created', {
        userId: created.user.id,
        workspaceId: created.workspace.id,
        entity: 'workspace',
        entityId: created.workspace.id,
      });

      return res.status(201).json({ user: publicUser(created.user), workspace: created.workspace });
    })
  );

  router.post(
    '/login',
    loginLimiter,
    asyncHandler(async (req, res) => {
      const { errors, values } = validateLogin(req.body);
      if (hasErrors(errors)) {
        return res.status(400).json({ error: { code: 'validation_failed', message: 'Please check the highlighted fields.', details: errors } });
      }

      const { rows } = await pool.query(
        `SELECT id, full_name, email, password_hash, status, preferred_language, email_verified_at,
                created_at, last_login_at, failed_login_attempts, locked_until
           FROM users
          WHERE LOWER(email) = $1`,
        [values.email]
      );

      const user = rows[0];
      if (!user) {
        await bcrypt.compare(values.password, DUMMY_HASH);
        return res.status(401).json({ error: { code: 'invalid_credentials', message: 'Email or password is incorrect.' } });
      }

      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        return res.status(423).json({
          error: { code: 'account_locked', message: `Too many failed attempts. Try again after ${new Date(user.locked_until).toISOString()}.` },
        });
      }

      if (user.status === 'suspended') {
        return res.status(403).json({ error: { code: 'account_suspended', message: 'This account is suspended.' } });
      }

      const valid = await bcrypt.compare(values.password, user.password_hash);
      if (!valid) {
        const attempts = user.failed_login_attempts + 1;
        const lockUntil = attempts >= MAX_FAILED_ATTEMPTS
          ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000)
          : null;

        await pool.query(
          'UPDATE users SET failed_login_attempts = $2, locked_until = $3 WHERE id = $1',
          [user.id, attempts, lockUntil]
        );

        await audit(pool, req, 'auth.login_failed', { userId: user.id, metadata: { attempts } });

        if (lockUntil) {
          return res.status(423).json({
            error: { code: 'account_locked', message: `Too many failed attempts. Try again after ${lockUntil.toISOString()}.` },
          });
        }
        return res.status(401).json({ error: { code: 'invalid_credentials', message: 'Email or password is incorrect.' } });
      }

      const fresh = await pool.query(
        `UPDATE users
            SET failed_login_attempts = 0, locked_until = NULL, last_login_at = NOW()
          WHERE id = $1
          RETURNING id, full_name, email, status, preferred_language, email_verified_at, created_at, last_login_at`,
        [user.id]
      );

      await new Promise((resolve, reject) =>
        req.session.regenerate((error) => (error ? reject(error) : resolve()))
      );
      req.session.userId = user.id;
      issueCsrfToken(req);

      await audit(pool, req, 'auth.login', { userId: user.id });

      return res.json({ user: publicUser(fresh.rows[0]), csrfToken: req.session.csrfToken });
    })
  );

  router.post(
    '/logout',
    requireAuth,
    asyncHandler(async (req, res) => {
      const userId = req.user.id;
      await new Promise((resolve) => req.session.destroy(() => resolve()));
      res.clearCookie('creatorpilot.sid', { path: '/' });
      await audit(pool, req, 'auth.logout', { userId });
      return res.status(204).end();
    })
  );

  router.get(
    '/me',
    requireAuth,
    asyncHandler(async (req, res) => {
      const memberships = await pool.query(
        `SELECT w.id, w.name, w.slug, r.code AS role, wm.status
           FROM workspace_members wm
           JOIN workspaces w ON w.id = wm.workspace_id
           JOIN roles r ON r.id = wm.role_id
          WHERE wm.user_id = $1 AND wm.status = 'active'
          ORDER BY w.created_at`,
        [req.user.id]
      );

      return res.json({ user: publicUser(req.user), workspaces: memberships.rows });
    })
  );

  router.post(
    '/forgot-password',
    recoveryLimiter,
    asyncHandler(async (req, res) => {
      const email = normalizeEmail(req.body && req.body.email);
      const response = {
        message: 'If an account exists for this email, a reset link has been sent.',
      };

      if (!email) return res.status(202).json(response);

      const { rows } = await pool.query(
        'SELECT id, full_name, preferred_language FROM users WHERE LOWER(email) = $1 AND status <> $2',
        [email, 'suspended']
      );

      if (rows.length === 0) return res.status(202).json(response);

      const token = crypto.randomBytes(32).toString('base64url');
      const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

      await withTransaction(pool, async (client) => {
        await client.query(
          'UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL',
          [rows[0].id]
        );
        await client.query(
          'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at, requested_ip) VALUES ($1, $2, $3, $4)',
          [rows[0].id, hashToken(token), expiresAt, req.ip || null]
        );
      });

      await audit(pool, req, 'auth.password_reset_requested', { userId: rows[0].id });

      const resetUrl = `${config.appOrigin}/reset-password/?token=${encodeURIComponent(token)}`;

      if (mailer.configured) {
        try {
          await mailer.sendResetEmail({
            to: email,
            name: rows[0].full_name,
            resetUrl,
            language: rows[0].preferred_language,
          });
        } catch (error) {
          console.error(`[email] Failed to send password reset email via ${mailer.provider}:`, error.message);
        }
      } else if (!config.isProduction) {
        console.warn(
          `[email] Not configured (SMTP_URL / RESEND_API_KEY missing). No email was sent. ` +
            `Local reset link: ${resetUrl}`
        );
      } else {
        console.error('[email] Not configured (SMTP_URL / RESEND_API_KEY missing). No password reset email was sent.');
      }

      return res.status(202).json(response);
    })
  );

  router.post(
    '/reset-password',
    recoveryLimiter,
    asyncHandler(async (req, res) => {
      const token = String((req.body && req.body.token) || '');
      const password = String((req.body && req.body.password) || '');

      if (!token) return res.status(400).json({ error: { code: 'invalid_token', message: 'This reset link is invalid.' } });
      if (password.length < 10 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        return res.status(400).json({
          error: {
            code: 'validation_failed',
            message: 'Password must be at least 10 characters and contain a letter and a number.',
            details: { password: 'weak_password' },
          },
        });
      }

      const passwordHash = await bcrypt.hash(password, config.bcryptRounds);

      const result = await withTransaction(pool, async (client) => {
        const { rows } = await client.query(
          `SELECT id, user_id FROM password_reset_tokens
            WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()
            FOR UPDATE`,
          [hashToken(token)]
        );

        if (rows.length === 0) return null;

        await client.query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1', [rows[0].id]);
        await client.query(
          `UPDATE users
              SET password_hash = $2, failed_login_attempts = 0, locked_until = NULL
            WHERE id = $1`,
          [rows[0].user_id, passwordHash]
        );

        return rows[0].user_id;
      });

      if (!result) {
        return res.status(400).json({
          error: { code: 'invalid_token', message: 'This reset link is invalid or has expired.' },
        });
      }

      await audit(pool, req, 'auth.password_reset', { userId: result });
      return res.json({ message: 'Password updated. You can now sign in.' });
    })
  );

  return router;
};

module.exports = buildAuthRoutes;
module.exports.publicUser = publicUser;
