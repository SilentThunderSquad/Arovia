'use strict';

/**
 * Wraps async route handlers to automatically catch errors
 * and forward them to Express error middleware.
 *
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
