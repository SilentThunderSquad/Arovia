/**
 * @fileoverview Admin feature JSDoc type definitions (frontend).
 */

/**
 * @typedef {Object} AdminUser
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {boolean} isActive
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Doctor
 * @property {string} id
 * @property {string} Name
 * @property {string} Specialization
 * @property {number} [Rating]
 * @property {string} [Hospital]
 */

/**
 * @typedef {Object} AdminAnalytics
 * @property {number} totalUsers
 * @property {Object} usersByRole
 * @property {Array<*>} registrationTrend
 */

export {};
