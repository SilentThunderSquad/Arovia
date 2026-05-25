/**
 * @fileoverview User feature JSDoc type definitions (frontend).
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id
 * @property {string} name
 * @property {string} username
 * @property {string} email
 * @property {string} role
 * @property {string} [phone]
 * @property {string} [dob]
 * @property {string} [gender]
 * @property {string} [profilePicture]
 * @property {boolean} bloodDonor
 * @property {boolean} isActive
 * @property {Object} address
 * @property {Array<*>} prescriptions
 */

/**
 * @typedef {Object} Prescription
 * @property {string} id
 * @property {string} filename
 * @property {string} originalName
 * @property {string} path
 * @property {string} uploadedAt
 */

export {};
