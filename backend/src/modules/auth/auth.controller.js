'use strict';

const authService = require('./auth.service');
const supabase = require('../../infrastructure/supabase/client');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { success, created, badRequest } = require('../../shared/utils/response');

/**
 * POST /api/auth/register
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return badRequest(res, 'Name, email, and password are required');
  if (password.length < 8) return badRequest(res, 'Password must be at least 8 characters');

  const user = await authService.registerUser({ name, email, password, role: 'user' });
  return created(res, {
    user: { id: user.id, name: user.user_metadata?.name, email: user.email, role: user.app_metadata?.role || 'user' },
  }, 'Account created successfully. You can now log in.');
});

/**
 * POST /api/auth/login
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return badRequest(res, 'Email and password are required');

  const { session, user } = await authService.loginUser(email, password);
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name, profile_picture')
    .eq('id', user.id)
    .maybeSingle();

  const role = profile?.role || user.app_metadata?.role || 'user';
  return success(res, {
    token: session.access_token,
    role,
    user: { id: user.id, name: profile?.name || user.user_metadata?.name, email: user.email, role, profilePicture: profile?.profile_picture || null },
  }, 'Logged in successfully');
});

module.exports = { registerUser, loginUser };
