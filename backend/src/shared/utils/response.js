'use strict';

/**
 * Standardized API response helpers.
 * All responses follow: { success, message, ...data }
 */

const success = (res, data = {}, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, ...data });

const created = (res, data = {}, message = 'Created') =>
  res.status(201).json({ success: true, message, ...data });

const badRequest = (res, message = 'Bad Request') =>
  res.status(400).json({ success: false, message });

const unauthorized = (res, message = 'Unauthorized') =>
  res.status(401).json({ success: false, message });

const forbidden = (res, message = 'Forbidden') =>
  res.status(403).json({ success: false, message });

const notFound = (res, message = 'Not Found') =>
  res.status(404).json({ success: false, message });

const serverError = (res, message = 'Internal Server Error') =>
  res.status(500).json({ success: false, message });

module.exports = { success, created, badRequest, unauthorized, forbidden, notFound, serverError };
