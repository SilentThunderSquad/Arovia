'use strict';

const supabase = require('../../infrastructure/supabase/client');

/**
 * UserRepository — abstracts all Supabase DB calls for profiles and prescriptions.
 */
class UserRepository {
  async findById(userId) {
    return supabase.from('profiles').select('*').eq('id', userId).single();
  }

  async update(userId, updates) {
    return supabase.from('profiles').update(updates).eq('id', userId).select().single();
  }

  async deleteById(userId) {
    return supabase.from('profiles').delete().eq('id', userId);
  }

  async getPrescriptions(userId) {
    return supabase.from('prescriptions').select('*').eq('user_id', userId).order('uploaded_at', { ascending: false });
  }

  async insertPrescription({ user_id, filename, original_name, storage_path, public_url }) {
    return supabase.from('prescriptions').insert({ user_id, filename, original_name, storage_path, public_url }).select().single();
  }

  async deletePrescription(prescriptionId, userId) {
    return supabase.from('prescriptions').delete().eq('id', prescriptionId).eq('user_id', userId).select().single();
  }
}

module.exports = new UserRepository();
