'use strict';

/**
 * Base AppError for centralized system errors
 */
class AppError extends Error {
  constructor(message, statusCode, code = 'INTERNAL_ERROR', isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request
 */
class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

/**
 * 401 Unauthorized or 403 Forbidden
 */
class AuthorizationError extends AppError {
  constructor(message, isForbidden = false) {
    super(message, isForbidden ? 403 : 401, isForbidden ? 'FORBIDDEN' : 'UNAUTHORIZED');
  }
}

/**
 * 429 Too Many Requests
 */
class RateLimitError extends AppError {
  constructor(message = 'Too many requests. Please try again later.', retryAfter = 60) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.retryAfter = retryAfter;
  }
}

/**
 * 404 Not Found (specifically for public profiles or private/deactivated statuses)
 */
class PublicProfileError extends AppError {
  constructor(message = 'Profile not found, is private, or has been suspended') {
    super(message, 404, 'PROFILE_NOT_FOUND');
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthorizationError,
  RateLimitError,
  PublicProfileError,
};
