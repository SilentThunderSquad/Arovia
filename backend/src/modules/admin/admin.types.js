/**
 * @fileoverview Admin module JSDoc type definitions.
 */

/**
 * @typedef {Object} Doctor
 * @property {string} id
 * @property {string} Name
 * @property {string} Specialization
 * @property {string} [Sub_specialization]
 * @property {string} [Treats]
 * @property {string} [Experience]
 * @property {number} [Rating]
 * @property {string} [Qualification]
 * @property {string} [Hospital]
 * @property {string} [City]
 * @property {string} [State]
 * @property {string} [Schedule_days]
 * @property {string} [Consultation_time]
 * @property {string} [Consultation_fee]
 * @property {string} [Contact]
 * @property {string} [Languages]
 */

/**
 * @typedef {Object} Analytics
 * @property {number} totalUsers
 * @property {Object} usersByRole
 * @property {Array<{_id: string, count: number}>} registrationTrend
 * @property {Object} lastLoggedInUser
 */

module.exports = {};
