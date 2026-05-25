/**
 * @fileoverview Auth module JSDoc type definitions (frontend).
 */

/**
 * @typedef {Object} AuthUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} role - 'user' | 'admin'
 * @property {string} [profilePicture]
 */

/**
 * @typedef {Object} LoginResponse
 * @property {string} token
 * @property {string} role
 * @property {AuthUser} user
 */

export {};
