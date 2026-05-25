'use strict';

const { z } = require('zod');

/**
 * User validation schemas using Zod.
 */

const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional(),
  dob: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']).optional(),
  bloodDonor: z.union([z.boolean(), z.string()]).optional(),
  address: z.union([z.string(), z.object({}).passthrough()]).optional(),
}).partial();

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

const UpdateAddressSchema = z.object({
  address: z.object({
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    country: z.string().optional(),
  }),
});

module.exports = { UpdateProfileSchema, ChangePasswordSchema, UpdateAddressSchema };
