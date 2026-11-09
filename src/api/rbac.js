'use strict';

const RANK = {
  owner: 5,
  admin: 4,
  manager: 3,
  member: 2,
  client: 1,
};

function roleAtLeast(role, minimum) {
  return Boolean(RANK[role]) && RANK[role] >= RANK[minimum];
}

const PERMISSIONS = {
  'workspace.read': 1,
  'workspace.update': 3,
  'workspace.delete': 5,
  'member.invite': 3,
  'member.remove': 4,
  'member.role': 4,
  'billing.manage': 5,
};

function can(role, permission) {
  const minimum = PERMISSIONS[permission];
  return Boolean(RANK[role]) && Boolean(minimum) && RANK[role] >= minimum;
}

module.exports = { RANK, PERMISSIONS, roleAtLeast, can };
