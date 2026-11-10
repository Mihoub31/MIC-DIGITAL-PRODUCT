'use strict';

const crypto = require('crypto');
const express = require('express');

const { asyncHandler, conflict } = require('../http');
const { requireAuth, requireWorkspacePermission, audit } = require('../middleware');
const { can, RANK } = require('../rbac');
const { validateWorkspaceName, validateEmail, hasErrors } = require('../validate');
const { withTransaction } = require('../db');

const ASSIGNABLE_ROLES = ['admin', 'manager', 'member', 'client'];

function slugify(value) {
  const base = String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return `${base || 'workspace'}-${crypto.randomBytes(3).toString('hex')}`;
}

module.exports = function buildWorkspaceRoutes({ pool }) {
  const router = express.Router();

  router.use(requireAuth);

  const requirePerm = (permission) =>
    requireWorkspacePermission(pool, permission, (role, perm) => can(role, perm));

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const { rows } = await pool.query(
        `SELECT w.id, w.name, w.slug, w.created_at, r.code AS role
           FROM workspaces w
           JOIN workspace_members wm ON wm.workspace_id = w.id
           JOIN roles r ON r.id = wm.role_id
          WHERE wm.user_id = $1 AND wm.status = 'active'
          ORDER BY w.created_at`,
        [req.user.id]
      );
      return res.json({ workspaces: rows });
    })
  );

  router.post(
    '/',
    asyncHandler(async (req, res) => {
      const errors = {};
      const name = validateWorkspaceName(req.body && req.body.name, errors, 'name');
      if (hasErrors(errors)) return res.status(400).json({ error: { code: 'validation_failed', message: 'Workspace name is required.', details: errors } });

      const workspace = await withTransaction(pool, async (client) => {
        const created = await client.query(
          'INSERT INTO workspaces (name, slug, owner_user_id) VALUES ($1, $2, $3) RETURNING id, name, slug, created_at',
          [name, slugify(name), req.user.id]
        );
        await client.query(
          `INSERT INTO workspace_members (workspace_id, user_id, role_id, status, joined_at)
           SELECT $1, $2, id, 'active', NOW() FROM roles WHERE code = 'owner'`,
          [created.rows[0].id, req.user.id]
        );
        return created.rows[0];
      });

      await audit(pool, req, 'workspace.created', { workspaceId: workspace.id, entity: 'workspace', entityId: workspace.id });
      return res.status(201).json({ workspace: { ...workspace, role: 'owner' } });
    })
  );

  router.get(
    '/:workspaceId',
    requirePerm('workspace.read'),
    asyncHandler(async (req, res) => {
      const workspace = await pool.query(
        'SELECT id, name, slug, owner_user_id, created_at, updated_at FROM workspaces WHERE id = $1',
        [req.params.workspaceId]
      );
      if (workspace.rowCount === 0) return res.status(404).json({ error: { code: 'not_found', message: 'Workspace not found.' } });

      const members = await pool.query(
        `SELECT u.id, u.full_name, u.email, r.code AS role, wm.status, wm.joined_at
           FROM workspace_members wm
           JOIN users u ON u.id = wm.user_id
           JOIN roles r ON r.id = wm.role_id
          WHERE wm.workspace_id = $1
          ORDER BY r.id DESC, u.full_name`,
        [req.params.workspaceId]
      );

      return res.json({
        workspace: workspace.rows[0],
        role: req.membership.role_code,
        members: members.rows,
      });
    })
  );

  router.patch(
    '/:workspaceId',
    requirePerm('workspace.update'),
    asyncHandler(async (req, res) => {
      const errors = {};
      const name = validateWorkspaceName(req.body && req.body.name, errors, 'name');
      if (hasErrors(errors)) return res.status(400).json({ error: { code: 'validation_failed', message: 'Workspace name is required.', details: errors } });

      const { rows } = await pool.query(
        'UPDATE workspaces SET name = $2 WHERE id = $1 RETURNING id, name, slug, updated_at',
        [req.params.workspaceId, name]
      );

      await audit(pool, req, 'workspace.updated', { workspaceId: req.params.workspaceId, entity: 'workspace', entityId: req.params.workspaceId });
      return res.json({ workspace: rows[0] });
    })
  );

  router.delete(
    '/:workspaceId',
    requirePerm('workspace.delete'),
    asyncHandler(async (req, res) => {
      await pool.query('DELETE FROM workspaces WHERE id = $1', [req.params.workspaceId]);
      await audit(pool, req, 'workspace.deleted', { workspaceId: null, entity: 'workspace', entityId: req.params.workspaceId });
      return res.status(204).end();
    })
  );

  router.post(
    '/:workspaceId/members',
    requirePerm('member.invite'),
    asyncHandler(async (req, res) => {
      const errors = {};
      const email = validateEmail(req.body && req.body.email, errors);
      const role = String((req.body && req.body.role) || 'member').toLowerCase();

      if (!ASSIGNABLE_ROLES.includes(role)) {
        return res.status(400).json({ error: { code: 'invalid_role', message: 'This role cannot be assigned.', details: { role: 'invalid' } } });
      }
      if (RANK[role] >= RANK[req.membership.role_code]) {
        return res.status(403).json({ error: { code: 'forbidden', message: 'You cannot assign a role equal to or above your own.' } });
      }
      if (hasErrors(errors)) return res.status(400).json({ error: { code: 'validation_failed', message: 'A valid email is required.', details: errors } });

      const user = await pool.query('SELECT id FROM users WHERE LOWER(email) = $1', [email]);
      if (user.rowCount === 0) {
        return res.status(404).json({ error: { code: 'user_not_found', message: 'No account exists for this email yet.' } });
      }

      try {
        await pool.query(
          `INSERT INTO workspace_members (workspace_id, user_id, role_id, status, invited_by, joined_at)
           SELECT $1, $2, id, 'active', $3, NOW() FROM roles WHERE code = $4`,
          [req.params.workspaceId, user.rows[0].id, req.user.id, role]
        );
      } catch (error) {
        if (error.code === '23505') throw conflict('This user is already a member of the workspace.');
        throw error;
      }

      await audit(pool, req, 'member.added', {
        workspaceId: req.params.workspaceId,
        entity: 'user',
        entityId: user.rows[0].id,
        metadata: { role },
      });

      return res.status(201).json({ member: { userId: user.rows[0].id, role } });
    })
  );

  router.patch(
    '/:workspaceId/members/:userId',
    requirePerm('member.role'),
    asyncHandler(async (req, res) => {
      const role = String((req.body && req.body.role) || '').toLowerCase();
      if (!ASSIGNABLE_ROLES.includes(role)) {
        return res.status(400).json({ error: { code: 'invalid_role', message: 'This role cannot be assigned.' } });
      }
      if (RANK[role] >= RANK[req.membership.role_code]) {
        return res.status(403).json({ error: { code: 'forbidden', message: 'You cannot assign a role equal to or above your own.' } });
      }

      const updated = await pool.query(
        `UPDATE workspace_members wm
            SET role_id = r.id
           FROM roles r
          WHERE wm.workspace_id = $1 AND wm.user_id = $2 AND r.code = $3
          RETURNING wm.user_id`,
        [req.params.workspaceId, req.params.userId, role]
      );

      if (updated.rowCount === 0) return res.status(404).json({ error: { code: 'not_found', message: 'Member not found.' } });

      await audit(pool, req, 'member.role_changed', {
        workspaceId: req.params.workspaceId,
        entity: 'user',
        entityId: req.params.userId,
        metadata: { role },
      });

      return res.json({ member: { userId: req.params.userId, role } });
    })
  );

  router.delete(
    '/:workspaceId/members/:userId',
    requirePerm('member.remove'),
    asyncHandler(async (req, res) => {
      const target = await pool.query(
        `SELECT r.code AS role
           FROM workspace_members wm JOIN roles r ON r.id = wm.role_id
          WHERE wm.workspace_id = $1 AND wm.user_id = $2`,
        [req.params.workspaceId, req.params.userId]
      );

      if (target.rowCount === 0) return res.status(404).json({ error: { code: 'not_found', message: 'Member not found.' } });
      if (target.rows[0].role === 'owner') {
        return res.status(409).json({ error: { code: 'owner_protected', message: 'The workspace owner cannot be removed.' } });
      }

      await pool.query('DELETE FROM workspace_members WHERE workspace_id = $1 AND user_id = $2', [
        req.params.workspaceId,
        req.params.userId,
      ]);

      await audit(pool, req, 'member.removed', {
        workspaceId: req.params.workspaceId,
        entity: 'user',
        entityId: req.params.userId,
      });

      return res.status(204).end();
    })
  );

  return router;
};
