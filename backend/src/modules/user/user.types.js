/**
 * @fileoverview User module JSDoc type definitions.
 */

/**
 * @typedef {Object} Address
 * @property {string} [addressLine1]
 * @property {string} [addressLine2]
 * @property {string} [city]
 * @property {string} [state]
 * @property {string} [pincode]
 * @property {string} [country]
 */

/**
 * @typedef {Object} Prescription
 * @property {string} id
 * @property {string} filename
 * @property {string} originalName
 * @property {string} path - Public/signed URL
 * @property {string} uploadedAt
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id
 * @property {string} name
 * @property {string} username
 * @property {string} email
 * @property {string} role - 'user' | 'admin'
 * @property {string} [phone]
 * @property {string} [dob]
 * @property {string} [gender]
 * @property {string} [profilePicture]
 * @property {boolean} bloodDonor
 * @property {boolean} isActive
 * @property {Address} address
 * @property {Prescription[]} prescriptions
 * @property {string} createdAt
 * @property {string} updatedAt
 */

module.exports = {};
