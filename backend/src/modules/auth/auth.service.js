'use strict';

const supabase = require('../../infrastructure/supabase/client');

/**
 * AuthService — handles Supabase Auth operations on the backend.
 * All methods throw on error so asyncHandler catches them.
 */
class AuthService {
  async registerUser({ name, email, password, role = 'user' }) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
      app_metadata: { role },
    });
    if (error) {
      const err = new Error(error.message);
      err.status = error.status || 400;
      throw err;
    }
    return data.user;
  }

  async loginUser(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const err = new Error('Invalid email or password');
      err.status = 400;
      throw err;
    }
    return data; // { session, user }
  }

  async updatePassword(userId, newPassword) {
    const { error } = await supabase.auth.admin.updateUserById(userId, { password: newPassword });
    if (error) {
      const err = new Error(error.message);
      err.status = 400;
      throw err;
    }
  }

  async deleteAuthUser(userId) {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
      const err = new Error(error.message);
      err.status = 400;
      throw err;
    }
  }
}

module.exports = new AuthService();
