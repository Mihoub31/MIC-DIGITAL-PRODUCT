'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const { errorHandler, notFoundHandler } = require('./http');
const {
  buildSessionMiddleware,
  originGuard,
  csrfGuard,
  attachUser,
} = require('./middleware');
const buildAuthRoutes = require('./routes/auth');
const buildUserRoutes = require('./routes/users');
const buildWorkspaceRoutes = require('./routes/workspaces');

function buildApp({ pool, config, logger = console }) {
  const app = express();

  if (config.trustProxy) app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin(origin, callback) {
        // Rejected origins get no CORS headers; originGuard answers 403 with a JSON body.
        if (!origin || config.allowedOrigins.includes(origin)) return callback(null, true);
        return callback(null, false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
      maxAge: 600,
    })
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(buildSessionMiddleware(config, pool));
  app.use(attachUser(pool));
  app.use(originGuard(config));
  app.use(csrfGuard());

  app.get('/health', async (req, res) => {
    try {
      await pool.query('SELECT 1');
      res.json({ ok: true, db: true, service: 'MIC Backend', uptime: Math.round(process.uptime()) });
    } catch (error) {
      logger.error('[health] database check failed:', error.message);
      res.status(503).json({ ok: false, db: false, service: 'MIC Backend' });
    }
  });

  app.get('/api/status', (req, res) => {
    res.json({ app: 'MIC Digital Product', status: 'online' });
  });

  app.use('/api/auth', buildAuthRoutes({ pool, config }));
  app.use('/api/users', buildUserRoutes({ pool, config }));
  app.use('/api/workspaces', buildWorkspaceRoutes({ pool, config }));

  app.use(notFoundHandler);
  app.use(errorHandler(logger));

  return app;
}

module.exports = { buildApp };
