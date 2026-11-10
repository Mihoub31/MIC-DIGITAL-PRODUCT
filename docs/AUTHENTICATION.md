# Authentication and security

## Passwords

- Stored as bcrypt hashes (`bcryptjs`, cost 12 by default, configurable with
  `BCRYPT_ROUNDS`).
- Registration requires 10–200 characters with at least one letter and one digit.
- Login compares against a dummy hash when the email is unknown, so response
  timing does not reveal whether an account exists.

## Registration and login

`POST /api/auth/register` creates the user and a personal workspace, with the
user as `owner`. The account status starts as `pending`; email verification
fields exist but verification is not currently enforced. Suspended accounts are
blocked.

`POST /api/auth/login`:

- rate limited to 10 attempts per IP per 15 minutes;
- locks the account for 15 minutes after 5 consecutive failures (HTTP 423);
- regenerates the session on success and returns a CSRF token;
- resets the failure counter and records `last_login_at`.

`POST /api/auth/logout` destroys the session and clears the cookie.

## Sessions

- Cookie name: `creatorpilot.sid`.
- `httpOnly`, `sameSite=lax`, `secure` in production, rolling expiry
  (`SESSION_DAYS`, default 7 days).
- Sessions are stored in PostgreSQL (`user_sessions`) through
  `connect-pg-simple`.
- The session is invalidated if the user is deleted or suspended.

## CSRF protection

Mutating requests must send a double-submit token:

1. `GET /api/auth/csrf` returns `{ csrfToken }` and starts a session.
2. Send the value in the `X-CSRF-Token` header on `POST`, `PATCH` and `DELETE`.

Exempt endpoints: login, register, forgot-password, reset-password. All other
mutations are rejected without a valid token.

## Origin guard

In production, mutating requests must include an `Origin` (or `Referer`) header
matching `APP_ORIGIN` or an entry in `EXTRA_ORIGINS`. Missing origins are
rejected in production. Set `TRUST_PROXY=true` behind a reverse proxy so client
IPs and protocols are read correctly.

## Roles and permissions

Ranks: `owner` 5, `admin` 4, `manager` 3, `member` 2, `client` 1.

| Permission | Minimum role |
| --- | --- |
| `workspace.read` | member |
| `workspace.update` | manager |
| `member.invite` | manager |
| `member.remove` | admin |
| `member.role` | admin |
| `workspace.delete` | owner |
| `billing.manage` | owner |

Additional rules enforced by the API:

- a member can only be given a role strictly below the actor's own rank;
- the workspace owner cannot be removed or demoted;
- only existing accounts can be invited (no email invitation is sent);
- clients cannot modify workspace settings.

## Password reset

1. `POST /api/auth/forgot-password` always answers `202` with the same message,
   whether or not the account exists.
2. A 32-byte token is generated; only its SHA-256 hash is stored, with a 60-minute
   expiry. Previous unused tokens for that user are invalidated.
3. The reset URL is `${APP_ORIGIN}/reset-password/?token=...`.
4. The email is sent through SMTP or Resend and written in the user's preferred
   language (French, English, Spanish, Arabic or Chinese).
5. `POST /api/auth/reset-password` accepts the token once, updates the password,
   clears lockout state and marks the token used.

Delivery failures do not change the API response and never expose the token in
the response body. In development without an email provider, the reset link is
logged; in production, only a configuration error is logged.

See [INSTALLATION.md](INSTALLATION.md#5-email-optional-but-recommended) for
provider configuration.

## Rate limits

| Endpoint | Limit |
| --- | --- |
| Login | 10 / 15 min per IP |
| Register | 5 / hour per IP |
| Forgot / reset password | 5 / hour per IP |

Limits are stored in memory and reset when the API restarts. With multiple
instances, use a shared store or an edge rate limiter.

## Security checklist

- Use a unique `SESSION_SECRET` (32+ characters) per environment.
- Serve the app over HTTPS and set `APP_ORIGIN` to that exact origin.
- Keep `.env` out of version control.
- Configure SMTP/Resend with a verified sender domain.
- Review the `audit_log` table for failed logins and role changes.
- Do not weaken CSRF, origin or rate-limit checks to work around client bugs.
