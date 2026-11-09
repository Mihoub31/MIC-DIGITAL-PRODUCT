'use strict';

require('dotenv').config();

const { loadConfig } = require('./src/api/config');
const { createPool } = require('./src/api/db');
const { buildApp } = require('./src/api/app');

let config;
try {
  config = loadConfig();
} catch (error) {
  console.error(`[startup] ${error.message}`);
  process.exit(1);
}

const pool = createPool(config);
const app = buildApp({ pool, config });

async function assertSchemaReady() {
  const { rows } = await pool.query(
    `SELECT to_regclass('public.schema_migrations') AS migrations,
            to_regclass('public.user_sessions') AS sessions`
  );

  if (!rows[0].migrations || !rows[0].sessions) {
    console.error('[startup] Database schema is not migrated. Run: npm run db:migrate');
    process.exit(1);
  }
}

const server = app.listen(config.port, async () => {
  console.log(`[api] listening on http://localhost:${config.port} (${config.env})`);
  console.log(`[api] allowed origins: ${config.allowedOrigins.join(', ')}`);
  if (!config.emailConfigured) {
    console.log('[api] email provider not configured - password reset emails will not be sent');
  }
  try {
    await assertSchemaReady();
    console.log('[api] database schema verified');
  } catch (error) {
    console.error('[api] database check failed:', error.message);
  }
});

let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[api] ${signal} received, shutting down`);

  const forceExit = setTimeout(() => {
    console.error('[api] forced shutdown after timeout');
    process.exit(1);
  }, 10000);
  forceExit.unref();

  server.close(async () => {
    try {
      await pool.end();
      console.log('[api] shutdown complete');
      process.exit(0);
    } catch (error) {
      console.error('[api] error during shutdown:', error.message);
      process.exit(1);
    }
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  console.error('[api] unhandled rejection:', reason);
});
