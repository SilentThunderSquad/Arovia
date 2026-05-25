'use strict';

const supabase = require('../../infrastructure/supabase/client');

/**
 * AdminRepository — abstracts all Supabase DB calls for admin operations.
 */
class AdminRepository {
  async getAllProfiles() {
    return supabase.from('profiles').select('*').order('created_at', { ascending: false });
  }

  async getProfileById(userId) {
    return supabase.from('profiles').select('is_active').eq('id', userId).single();
  }

  async updateProfile(userId, updates) {
    return supabase.from('profiles').update(updates).eq('id', userId).select().single();
  }

  async deleteAuthUser(userId) {
    return supabase.auth.admin.deleteUser(userId);
  }

  async getTotalUserCount() {
    return supabase.from('profiles').select('*', { count: 'exact', head: true });
  }

  async getAllRoles() {
    return supabase.from('profiles').select('role');
  }

  async getRecentProfiles(since) {
    return supabase.from('profiles').select('created_at').gte('created_at', since);
  }

  async getMostRecentProfile() {
    return supabase.from('profiles').select('*').order('updated_at', { ascending: false }).limit(1).single();
  }

  async getAllDoctors() {
    return supabase.from('doctors').select('*').order('name');
  }

  async findDoctorByName(pattern) {
    return supabase.from('doctors').select('*').ilike('name', `%${pattern}%`).limit(1).maybeSingle();
  }

  async deleteDoctor(doctorId) {
    return supabase.from('doctors').delete().eq('id', doctorId);
  }
}

module.exports = new AdminRepository();
