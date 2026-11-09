'use strict';

const REQUIRED = ['DATABASE_URL', 'SESSION_SECRET'];

function parseList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
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
    emailConfigured: Boolean(env.SMTP_URL || env.RESEND_API_KEY),
    appName: env.APP_NAME || 'CreatorPilot',
  };
}

module.exports = { loadConfig };
