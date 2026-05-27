'use strict';

const logger = require('../shared/utils/logger');
const { AppError } = require('../shared/utils/errors');

/**
 * Global Express Error Middleware
 * Masks internal errors, maps structured errors, and outputs observability logs.
 */
const errorMiddleware = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const isProd = process.env.NODE_ENV === 'production';
  let statusCode = err.statusCode || err.status || 500;
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected error occurred';
  let details = err.details || null;

  // Handoff to logging architecture
  const errorMeta = {
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    userId: req.user?.userId || null,
    stack: !isProd ? err.stack : undefined,
  };

  if (err instanceof AppError) {
    if (statusCode === 403) {
      logger.security(`RBAC Violation: Forbidden Access - ${message}`, errorMeta);
    } else if (statusCode === 401) {
      logger.warn('AUTH_WARNING', `Session Unauthenticated: ${message}`, errorMeta);
    } else if (statusCode === 429) {
      logger.security(`Rate Limit Breached: ${message}`, errorMeta);
    } else {
      logger.warn('APP_ERROR', `${err.name}: ${message}`, errorMeta);
    }
  } else {
    // Uncaught internal runtime / database exception
    logger.error('CRITICAL_UNHANDLED_ERROR', err.message, errorMeta);
    
    // In production, mask the server internals to prevent diagnostic leaks
    if (isProd) {
      statusCode = 500;
      code = 'INTERNAL_SERVER_ERROR';
      message = 'An unexpected error occurred. Please contact support.';
      details = null;
    }
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
      ...(!isProd && { stack: err.stack }),
    },
  });
};

module.exports = errorMiddleware;
