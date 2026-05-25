/**
 * @fileoverview Auth module JSDoc type definitions.
 * Provides IDE autocomplete without requiring TypeScript.
 */

/**
 * @typedef {Object} RegisterPayload
 * @property {string} name - User's full name
 * @property {string} email - User's email address
 * @property {string} password - User's password (min 8 chars)
 */

/**
 * @typedef {Object} LoginPayload
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} AuthUser
 * @property {string} id - Supabase user UUID
 * @property {string} email
 * @property {string} role - 'user' | 'admin'
 * @property {string} [name]
 * @property {string} [profilePicture]
 */

/**
 * @typedef {Object} AuthSession
 * @property {string} access_token - Supabase JWT
 * @property {AuthUser} user
 * @property {string} role
 */

module.exports = {}; // types only — no runtime exports
