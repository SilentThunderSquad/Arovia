'use strict';

const { z } = require('zod');

/**
 * Auth validation schemas using Zod.
 * These are used by the validate() middleware factory.
 */

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

module.exports = { RegisterSchema, LoginSchema };
