'use strict';

/**
 * Enterprise Structured Logger
 * Outputs JSON logs in production for Datadog / Vercel Logs / Logflare parsing,
 * and elegant colored terminal output in local development environments.
 */
const log = (level, category, message, meta = {}) => {
  const logData = {
    timestamp: new Date().toISOString(),
    level,
    category,
    message,
    ...meta,
  };

  if (process.env.NODE_ENV === 'production') {
    // Structured JSON logging for cloud observability services
    console.log(JSON.stringify(logData));
  } else {
    // Human-readable local logging
    const colors = {
      INFO: '\x1b[32m',    // Green
      WARN: '\x1b[33m',    // Yellow
      ERROR: '\x1b[31m',   // Red
      SECURITY: '\x1b[41m\x1b[37m', // Red BG, White Text
      RESET: '\x1b[0m'
    };

    const color = colors[category] || colors[level] || colors.RESET;
    console.log(
      `[${logData.timestamp}] ${color}${category || level}${colors.RESET}: ${message}`,
      Object.keys(meta).length ? '\n' + JSON.stringify(meta, null, 2) : ''
    );
  }
};

const logger = {
  info: (category, message, meta) => log('INFO', category, message, meta),
  warn: (category, message, meta) => log('WARN', category, message, meta),
  error: (category, message, meta) => log('ERROR', category, message, meta),
  security: (message, meta) => log('WARN', 'SECURITY', message, meta),
};

module.exports = logger;
