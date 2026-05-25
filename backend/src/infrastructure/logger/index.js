'use strict';

/**
 * Centralized logger — structured console output with timestamps and levels.
 * Drop-in replacement for console.log that adds context.
 */
const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = levels[process.env.LOG_LEVEL] ?? levels.info;

const timestamp = () => new Date().toISOString();

const logger = {
  error: (msg, meta = {}) => {
    if (currentLevel >= levels.error)
      console.error(JSON.stringify({ level: 'ERROR', timestamp: timestamp(), msg, ...meta }));
  },
  warn: (msg, meta = {}) => {
    if (currentLevel >= levels.warn)
      console.warn(JSON.stringify({ level: 'WARN', timestamp: timestamp(), msg, ...meta }));
  },
  info: (msg, meta = {}) => {
    if (currentLevel >= levels.info)
      console.log(JSON.stringify({ level: 'INFO', timestamp: timestamp(), msg, ...meta }));
  },
  debug: (msg, meta = {}) => {
    if (currentLevel >= levels.debug)
      console.log(JSON.stringify({ level: 'DEBUG', timestamp: timestamp(), msg, ...meta }));
  },
};

module.exports = logger;
