'use strict';

class HttpError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const badRequest = (message, details) => new HttpError(400, 'invalid_request', message, details);
const unauthorized = (message = 'Authentication required.') =>
  new HttpError(401, 'unauthorized', message);
const forbidden = (message = 'You do not have access to this resource.') =>
  new HttpError(403, 'forbidden', message);
const notFound = (message = 'Resource not found.') => new HttpError(404, 'not_found', message);
const conflict = (message) => new HttpError(409, 'conflict', message);
const tooMany = (message = 'Too many attempts. Try again later.') =>
  new HttpError(429, 'rate_limited', message);

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

const PG_UNIQUE_VIOLATION = '23505';
const PG_CHECK_VIOLATION = '23514';

function errorHandler(logger) {
  return (error, req, res, next) => {
    if (res.headersSent) return next(error);

    if (error instanceof HttpError) {
      return res.status(error.status).json({
        error: { code: error.code, message: error.message, details: error.details },
      });
    }

    if (error && error.code === PG_UNIQUE_VIOLATION) {
      return res.status(409).json({
        error: { code: 'conflict', message: 'This record already exists.' },
      });
    }

    if (error && error.code === PG_CHECK_VIOLATION) {
      return res.status(400).json({
        error: { code: 'invalid_request', message: 'A field contains an invalid value.' },
      });
    }

    if (error && (error.type === 'entity.parse.failed' || error.type === 'entity.too.large')) {
      return res.status(400).json({
        error: { code: 'invalid_request', message: 'Malformed request body.' },
      });
    }

    logger.error('[api] unhandled error:', error && error.stack ? error.stack : error);
    return res.status(500).json({
      error: { code: 'internal_error', message: 'Something went wrong. Please try again.' },
    });
  };
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: { code: 'not_found', message: 'Endpoint not found.' } });
}

module.exports = {
  HttpError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  tooMany,
  asyncHandler,
  errorHandler,
  notFoundHandler,
};
