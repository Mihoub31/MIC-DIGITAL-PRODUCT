# CreatorPilot (MIC Digital Product)

CreatorPilot is a multilingual SaaS application: a marketing site, email/password
authentication, a customer dashboard, and workspace management with role-based
access control. The Next.js frontend and the Express API are deployed together as
a single Node service backed by PostgreSQL.

## Stack

- Next.js 15.5 (App Router, React 19, TypeScript)
- Express 4 API with PostgreSQL (`pg`)
- Session cookies stored in PostgreSQL (`connect-pg-simple`)
- bcrypt password hashing, CSRF protection, login rate limiting and lockout
- Transactional email through SMTP or Resend
- Five interface languages: French, English, Spanish, Arabic (RTL) and Chinese

## Features

- Marketing pages (home, features, about, pricing, contact) fully translated.
- Registration, login, logout and password reset.
- Dashboard with profile, security, language and workspace tabs.
- Workspaces with owner/admin/manager/member/client roles and server-side
  permission checks.
- Password reset emails sent through SMTP (`SMTP_URL`) or Resend
  (`RESEND_API_KEY`), localized in the recipient's language.

## Quick start

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL and SESSION_SECRET
npm run db:migrate
npm run start:api         # API on http://localhost:3002
npm run dev               # frontend on http://localhost:3000
```

See [docs/INSTALLATION.md](docs/INSTALLATION.md) for the full setup, including
Windows/PowerShell commands and email configuration.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build (bakes `API_URL` into the `/api` rewrite) |
| `npm start` | Serve the production build |
| `npm run start:api` | Start the Express API |
| `npm run start:all` | Run the API and the production frontend in one process tree |
| `npm run db:migrate` | Apply pending SQL migrations |
| `npm run db:migrate:production` | Apply migrations with the production guard flag |
| `npm test` | Run the Node test suite (email service and configuration) |
| `npm run typecheck` | TypeScript type check |

## Project structure

```text
app/                 Next.js pages, dashboard, i18n client module and styles
src/api/             Express app, routes, middleware, RBAC, validation, email
database/            Ordered SQL migrations
scripts/             Migration runner and single-service supervisor
tests/               Node test suite
docs/                Installation, database, authentication and deployment guides
```

## Documentation

- [Installation](docs/INSTALLATION.md)
- [Database](docs/DATABASE.md)
- [Authentication and security](docs/AUTHENTICATION.md)
- [Deployment](docs/DEPLOYMENT.md)

## Security

- Never commit `.env` or real credentials.
- Use a unique `SESSION_SECRET` of at least 32 characters.
- Set `APP_ORIGIN` to the public HTTPS origin; it is used for CORS, the origin
  guard and password reset links.
- Without an email provider, password reset links are only logged in
  development. In production, no token is written to the logs.
