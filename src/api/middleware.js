'use strict';

const crypto = require('crypto');
const session = require('express-session');
const PgStore = require('connect-pg-simple')(session);

const { unauthorized, forbidden } = require('./http');

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const CSRF_EXEMPT = new Set([
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
]);

function buildSessionMiddleware(config, pool) {
  return session({
    name: 'creatorpilot.sid',
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.isProduction,
      maxAge: config.sessionDays * 24 * 60 * 60 * 1000,
    },
    store: new PgStore({
      pool,
      tableName: 'user_sessions',
      createTableIfMissing: false,
      pruneSessionInterval: 900,
      errorLog: (error) => console.error('[session] store error:', error.message),
    }),
  });
}

function originGuard(config) {
  const allowed = new Set(config.allowedOrigins);

  return (req, res, next) => {
    if (SAFE_METHODS.has(req.method)) return next();

    const origin = req.get('origin');
    if (origin) {
      return allowed.has(origin) ? next() : next(forbidden('Origin is not allowed.'));
    }

    const referer = req.get('referer');
    if (referer) {
      try {
        const refererOrigin = new URL(referer).origin;
        return allowed.has(refererOrigin) ? next() : next(forbidden('Origin is not allowed.'));
      } catch {
        return next(forbidden('Origin is not allowed.'));
      }
    }

    if (config.isProduction) {
      return next(forbidden('Missing Origin header.'));
    }

    return next();
  };
}

function issueCsrfToken(req) {
  if (!req.session) return null;
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  return req.session.csrfToken;
}

function csrfGuard() {
  return (req, res, next) => {
    if (SAFE_METHODS.has(req.method)) return next();
    if (CSRF_EXEMPT.has(req.path)) return next();

    const expected = req.session && req.session.csrfToken;
    const provided = req.get('x-csrf-token');

    if (!expected || !provided || expected.length !== provided.length) {
      return next(forbidden('CSRF token is missing.'));
    }

    const matches = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
    return matches ? next() : next(forbidden('CSRF token is invalid.'));
  };
}

function attachUser(pool) {
  return async (req, res, next) => {
    if (!req.session || !req.session.userId) return next();

    try {
      const { rows } = await pool.query(
        `SELECT id, full_name, email, status, preferred_language, email_verified_at,
                created_at, last_login_at
           FROM users
          WHERE id = $1`,
        [req.session.userId]
      );

      if (rows.length === 0) {
        req.session.destroy(() => {});
        return next(unauthorized('Session is no longer valid.'));
      }

      const user = rows[0];
      if (user.status === 'suspended') {
        req.session.destroy(() => {});
        return next(forbidden('This account is suspended.'));
      }

      req.user = user;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

function requireAuth(req, res, next) {
  if (!req.user) return next(unauthorized());
  return next();
}

async function loadMembership(pool, userId, workspaceId) {
  const { rows } = await pool.query(
    `SELECT wm.role_id, r.code AS role_code, wm.status
       FROM workspace_members wm
       JOIN roles r ON r.id = wm.role_id
      WHERE wm.workspace_id = $1 AND wm.user_id = $2 AND wm.status = 'active'`,
    [workspaceId, userId]
  );
  return rows[0] || null;
}

function requireWorkspacePermission(pool, permission, rankCheck) {
  return async (req, res, next) => {
    try {
      const workspaceId = req.params.workspaceId;
      const membership = await loadMembership(pool, req.user.id, workspaceId);

      if (!membership) return next(forbidden('You are not a member of this workspace.'));
      if (!rankCheck(membership.role_code, permission)) {
        return next(forbidden('Your role does not allow this action.'));
      }

      req.membership = membership;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

async function audit(pool, req, action, options = {}) {
  try {
    await pool.query(
      `INSERT INTO audit_log (user_id, workspace_id, action, entity, entity_id, ip, user_agent, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        options.userId !== undefined ? options.userId : req.user ? req.user.id : null,
        options.workspaceId || null,
        action,
        options.entity || null,
        options.entityId || null,
        req.ip || null,
        (req.get('user-agent') || '').slice(0, 400) || null,
        JSON.stringify(options.metadata || {}),
      ]
    );
  } catch (error) {
    console.error('[audit] failed to record event:', error.message);
  }
}

module.exports = {
  buildSessionMiddleware,
  originGuard,
  issueCsrfToken,
  csrfGuard,
  attachUser,
  requireAuth,
  loadMembership,
  requireWorkspacePermission,
  audit,
};
