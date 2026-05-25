'use strict';

const supabase = require('../../infrastructure/supabase/client');

/**
 * AuthRepository — abstracts all Supabase Auth admin calls.
 * Services call repositories; controllers call services.
 * Swapping Supabase only requires updating repositories.
 */
class AuthRepository {
  async createUser({ email, password, name, role }) {
    return supabase.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { name },
      app_metadata: { role },
    });
  }

  async signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password });
  }

  async updateUserPassword(userId, password) {
    return supabase.auth.admin.updateUserById(userId, { password });
  }

  async deleteUser(userId) {
    return supabase.auth.admin.deleteUser(userId);
  }

  async getProfileByUserId(userId) {
    return supabase.from('profiles').select('role, name, profile_picture').eq('id', userId).single();
  }
}

module.exports = new AuthRepository();
