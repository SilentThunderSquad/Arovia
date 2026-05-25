/**
 * @fileoverview Shared common JSDoc type definitions.
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} message
 * @property {*} [data]
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {boolean} success
 * @property {Array<*>} items
 * @property {number} total
 * @property {number} page
 * @property {number} pageSize
 */

/**
 * @typedef {Object} SelectOption
 * @property {string|number} value
 * @property {string} label
 */

export {};
