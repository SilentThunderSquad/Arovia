'use strict';

/**
 * Zod-based request validation middleware factory.
 *
 * Usage in routes:
 *   const { validate } = require('../../shared/validators/validate');
 *   const { RegisterSchema } = require('./auth.validator');
 *   router.post('/register', validate(RegisterSchema), registerUser);
 *
 * On validation failure: returns 400 with structured Zod error messages.
 * On success: req.body is replaced with the sanitized/coerced Zod output.
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }
  req.body = result.data; // sanitized + typed payload
  next();
};

module.exports = { validate };
