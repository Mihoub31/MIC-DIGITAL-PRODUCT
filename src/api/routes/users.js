'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');

const { asyncHandler } = require('../http');
const { validateProfileUpdate, validatePasswordChange, hasErrors } = require('../validate');
const { requireAuth, audit } = require('../middleware');
const { publicUser } = require('./auth');

module.exports = function buildUserRoutes({ pool, config }) {
  const router = express.Router();

  router.use(requireAuth);

  router.get('/', (req, res) => res.json({ user: publicUser(req.user) }));

  router.patch(
    '/me',
    asyncHandler(async (req, res) => {
      const { errors, values } = validateProfileUpdate(req.body);
      if (hasErrors(errors)) {
        return res.status(400).json({
          error: { code: 'validation_failed', message: 'Please check the highlighted fields.', details: errors },
        });
      }

      const { rows } = await pool.query(
        `UPDATE users
            SET full_name = COALESCE($2, full_name),
                preferred_language = COALESCE($3, preferred_language)
          WHERE id = $1
          RETURNING id, full_name, email, status, preferred_language, email_verified_at, created_at, last_login_at`,
        [req.user.id, values.fullName || null, values.language || null]
      );

      await audit(pool, req, 'user.profile_updated', { entity: 'user', entityId: req.user.id });
      return res.json({ user: publicUser(rows[0]) });
    })
  );

  router.post(
    '/me/password',
    asyncHandler(async (req, res) => {
      const { errors, values } = validatePasswordChange(req.body);
      if (hasErrors(errors)) {
        return res.status(400).json({
          error: { code: 'validation_failed', message: 'Please check the highlighted fields.', details: errors },
        });
      }

      const { rows } = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
      const valid = await bcrypt.compare(values.currentPassword, rows[0].password_hash);

      if (!valid) {
        await audit(pool, req, 'user.password_change_failed', { entity: 'user', entityId: req.user.id });
        return res.status(400).json({
          error: { code: 'invalid_password', message: 'Current password is incorrect.', details: { currentPassword: 'invalid' } },
        });
      }

      const passwordHash = await bcrypt.hash(values.newPassword, config.bcryptRounds);
      await pool.query('UPDATE users SET password_hash = $2 WHERE id = $1', [req.user.id, passwordHash]);

      await audit(pool, req, 'user.password_changed', { entity: 'user', entityId: req.user.id });
      return res.json({ message: 'Password updated.' });
    })
  );

  return router;
};
