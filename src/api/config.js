'use strict';

const REQUIRED = ['DATABASE_URL', 'SESSION_SECRET'];

function parseList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSmtpUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error('SMTP_URL must be a valid URL (smtp:// or smtps://).');
  }
  if (parsed.protocol !== 'smtp:' && parsed.protocol !== 'smtps:') {
    throw new Error('SMTP_URL must use the smtp:// or smtps:// scheme.');
  }
  if (!parsed.hostname) {
    throw new Error('SMTP_URL must include a hostname.');
  }
  return raw;
}

function parseEmailFrom(value, appName, usingResend) {
  const raw = String(value || '').trim();
  if (!raw) {
    return usingResend ? `${appName} <onboarding@resend.dev>` : '';
  }
  const bracketed = raw.match(/<([^<>]+)>$/);
  const address = (bracketed ? bracketed[1] : raw).trim();
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(address)) {
    throw new Error('EMAIL_FROM must be a valid email address, e.g. "CreatorPilot <no-reply@example.com>".');
  }
  return raw;
}

function loadConfig(env = process.env) {
  const missing = REQUIRED.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  const sessionSecret = env.SESSION_SECRET;
  if (sessionSecret.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters long.');
  }

  const isProduction = env.NODE_ENV === 'production';
  const appOrigin = env.APP_ORIGIN || 'http://localhost:3000';
  const appName = env.APP_NAME || 'CreatorPilot';
  const smtpUrl = parseSmtpUrl(env.SMTP_URL);
  const resendApiKey = String(env.RESEND_API_KEY || '').trim();
  const emailFrom = parseEmailFrom(env.EMAIL_FROM, appName, Boolean(resendApiKey));

  if (smtpUrl && !emailFrom) {
    throw new Error('EMAIL_FROM is required when SMTP_URL is configured.');
  }

  const emailProvider = smtpUrl ? 'smtp' : resendApiKey ? 'resend' : null;

  return {
    env: env.NODE_ENV || 'development',
    isProduction,
    port: Number(env.PORT) || 3002,
    databaseUrl: env.DATABASE_URL,
    sessionSecret,
    appOrigin,
    allowedOrigins: [appOrigin, ...parseList(env.EXTRA_ORIGINS)],
    databaseSsl: env.DATABASE_SSL === 'false' ? false : isProduction || env.DATABASE_SSL === 'true',
    trustProxy: env.TRUST_PROXY === 'true' ? 1 : false,
    bcryptRounds: Number(env.BCRYPT_ROUNDS) || 12,
    sessionDays: Number(env.SESSION_DAYS) || 7,
    emailProvider,
    emailConfigured: Boolean(emailProvider),
    emailFrom,
    smtpUrl,
    resendApiKey: emailProvider === 'resend' ? resendApiKey : '',
    appName,
  };
}

module.exports = { loadConfig };
