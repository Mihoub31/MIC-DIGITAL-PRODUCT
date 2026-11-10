# Database

CreatorPilot uses PostgreSQL 14+ (tested with PostgreSQL 16/18 on Neon and
PostgreSQL-compatible PGlite for local tests). All schema changes live in
`database/` as ordered SQL migrations.

## Migrations

| File | Purpose |
| --- | --- |
| `001_core.sql` | Users, roles, workspaces, workspace members, indexes |
| `002_auth.sql` | Session table used by `connect-pg-simple` |
| `003_account_security.sql` | Login lockout columns, language preference, email verification and password reset tokens, audit log, `updated_at` triggers |

The runner (`scripts/migrate.js`):

- applies pending files in filename order;
- records each file in `schema_migrations` with a SHA-256 checksum;
- warns when an already-applied file was modified (checksum drift);
- wraps files without their own `BEGIN;` in a transaction;
- takes a PostgreSQL advisory lock so two deploys cannot migrate at once;
- refuses to run with `NODE_ENV=production` unless `--allow-production` is passed.

### Commands

```bash
npm run db:migrate                    # apply pending migrations
npm run db:migrate:backup             # apply to BACKUP_DATABASE_URL
npm run db:migrate:production         # explicit production run (approval required)
node scripts/migrate.js --dry-run     # list pending migrations only
```

`BACKUP_DATABASE_URL` is a separate database you control, for rehearsing
migrations before touching production.

Always back up before a production migration:

```bash
pg_dump "$DATABASE_URL" --format=custom --file=backup-before-migration.dump
```

Restore with `pg_restore --clean --if-exists --dbname="$DATABASE_URL" backup.dump`.
Never drop or reset an existing production database.

## Schema overview

**users** — account identity, bcrypt hash, status (`pending`, `active`,
`suspended`), language (`fr`, `en`, `es`, `ar`, `zh`), verification timestamp,
failed login counter, lockout timestamp, last login. Email uniqueness is enforced
case-insensitively by a unique index on `LOWER(email)`.

**roles** — fixed reference table: `owner`, `admin`, `manager`, `member`,
`client`.

**workspaces** — tenant container with a unique slug and an owner.

**workspace_members** — link between users and workspaces with a role and status
(`invited`, `active`, `suspended`). Unique per workspace/user pair.

**user_sessions** — server-side session store, keyed by session id, with expiry.

**email_verification_tokens / password_reset_tokens** — hashed, expiring,
single-use tokens. Password reset tokens store the requester IP and are deleted
with the user.

**audit_log** — security-relevant events (`auth.login`, `auth.login_failed`,
`auth.password_reset_requested`, `workspace.created`, role changes, etc.). User
and workspace references become `NULL` when those records are deleted.

**schema_migrations** — applied migration names, checksums and timestamps.

Indexes cover workspace membership, workspace ownership, user status, session
expiry, token lookups and audit queries. Triggers maintain `updated_at` on users
and workspaces.

## Adding a migration

1. Create the next numbered file, for example `database/004_your_change.sql`.
2. Make it idempotent where practical (`IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`).
3. Never edit an already-applied migration; add a new one.
4. Test on a copy or the backup database, then apply to production after approval.

## Neon

- Use the **direct** connection string (not the pooled one) when running
  migrations, because the runner uses an advisory lock and simple queries.
- The runtime can use the pooled connection string for many short-lived
  connections. Both require TLS (`sslmode=require`).
- `DATABASE_SSL` is enabled automatically when `NODE_ENV=production`; set it to
  `false` only for local databases.
- Neon compute can sleep when idle; the first request after a pause may be slower.
