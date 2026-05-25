/**
 * Centralized role-based routing logic
 * 
 * Eliminates duplicated ternaries across the codebase.
 * Single source of truth for role-based navigation paths.
 */

/**
 * Get dashboard path based on user role
 * @param {string} role - User role ('admin', 'user', etc.)
 * @returns {string} Dashboard route path
 */
export const getDashboardPath = (role) =>
  role === 'admin' ? '/dashboard/admin' : '/dashboard/user';

/**
 * Get user profile path based on role and username
 * @param {string} role - User role ('admin', 'doctor', 'user')
 * @param {string} username - User's username/slug
 * @returns {string} Profile route path
 */
export const getProfilePath = (role, username) => {
  if (!username) return '/';
  return (role === 'admin' || role === 'doctor')
    ? `/doctor/${username}`
    : `/u/${username}`;
};

/**
 * Get settings path based on user role
 * @param {string} role - User role
 * @returns {string} Settings route path
 */
export const getSettingsPath = (role) =>
  role === 'admin' ? '/dashboard/admin/settings' : '/dashboard/user/settings';
