# Installation

## Prerequisites

- Node.js 22 LTS (minimum 20.11)
- PostgreSQL 14 or newer (local server or a hosted provider such as Neon)
- npm 10+

No Docker setup is required.

## 1. Install dependencies

```bash
npm install
```

Use `npm ci` for a clean install from the lockfile. Remember that `npm ci` with
`NODE_ENV=production` omits dev dependencies, which breaks the TypeScript build;
add `--include=dev` when needed.

## 2. Configure the environment

```bash
cp .env.example .env
```

Fill in at least:

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `SESSION_SECRET` | yes | Random string of 32+ characters |
| `APP_ORIGIN` | yes | Public frontend origin, e.g. `http://localhost:3000` |
| `API_URL` | recommended | Where Next.js proxies `/api/*` (default `http://localhost:3002`) |
| `DATABASE_SSL` | no | `false` for local Postgres; enabled automatically in production |
| `PORT` | no | API port (default `3002`) |
| `SMTP_URL` | no | SMTP connection string for outgoing email |
| `RESEND_API_KEY` | no | Resend API key (alternative to SMTP) |
| `EMAIL_FROM` | with SMTP | Sender address, e.g. `CreatorPilot <no-reply@example.com>` |

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

PowerShell:

```powershell
Copy-Item .env.example .env
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Paste the generated value into `SESSION_SECRET` in `.env`. Never commit `.env`.

## 3. Apply database migrations

```bash
npm run db:migrate
```

The runner applies `database/*.sql` in filename order and records them in
`schema_migrations`. See [DATABASE.md](DATABASE.md) for details and safety flags.

## 4. Start the application

Development, with two terminals:

```bash
npm run start:api   # Express API on http://localhost:3002
npm run dev         # Next.js on http://localhost:3000
```

Production-style, single supervisor:

```bash
npm run build
npm run start:all
```

`start:all` runs the API on `API_PORT` (default `3002`) and Next.js on `PORT`
(default `3000`), and stops the whole service if either process exits.

> `API_URL` is read during `npm run build` because the `/api/*` rewrite is baked
> into the Next.js build. Rebuild after changing it.

## 5. Email (optional but recommended)

Password reset needs an email provider in production.

**SMTP**

```env
SMTP_URL=smtp://user:password@mail.example.com:587
EMAIL_FROM="CreatorPilot <no-reply@example.com>"
```

Use `smtps://...:465` for implicit TLS. `EMAIL_FROM` is required with SMTP.

**Resend**

```env
RESEND_API_KEY=re_...
EMAIL_FROM="CreatorPilot <no-reply@yourdomain.com>"
```

If `EMAIL_FROM` is omitted, Resend falls back to `onboarding@resend.dev`, which
only delivers to the Resend account owner. Configure a verified domain for real
users.

When both are set, SMTP wins. Without a provider:

- development: the reset link is written to the API log;
- production: an error is logged and no token is exposed.

## Troubleshooting

- **`Missing required environment variables`** — `.env` is missing or incomplete.
- **`Database schema is not migrated`** — run `npm run db:migrate`.
- **API returns 502 from the frontend** — the API is not running on `API_URL`, or
  the value changed after the Next.js build.
- **`email provider not configured`** — set `SMTP_URL` or `RESEND_API_KEY`.
- **Port already in use** — change `PORT` / `API_PORT` and update `API_URL`.
- **SSL errors with a local database** — set `DATABASE_SSL=false`.
