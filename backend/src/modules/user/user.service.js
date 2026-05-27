'use strict';

const supabase = require('../../infrastructure/supabase/client');

const throwIf = (error) => {
  if (error) {
    const err = new Error(error.message || 'Database error');
    err.status = 400;
    throw err;
  }
};

/**
 * UserService — all user profile & prescription operations.
 */
class UserService {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle(); // Changed from single() to avoid 400 on missing

    if (error) throwIf(error);
    return data;
  }

  async createProfile(profileData) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();
    if (error) throwIf(error);
    return data;
  }

  async updateProfile(userId, updates) {
    console.log('[SERVICE] updateProfile called for user:', userId, 'with updates:', Object.keys(updates));
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('[SERVICE] Supabase update error:');
      console.error('  Code:', error.code);
      console.error('  Message:', error.message);
      console.error('  Details:', error.details);
      console.error('  Hint:', error.hint);
      throwIf(error);
    }
    
    console.log('[SERVICE] Update successful, returned data:', !!data);
    return data;
  }

  async deleteProfile(userId) {
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    throwIf(error);
  }

  async getPrescriptions(userId) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });
    throwIf(error);
    return data || [];
  }

  async addPrescription(userId, { filename, originalName, storagePath, publicUrl }) {
    const { data, error } = await supabase
      .from('prescriptions')
      .insert({ user_id: userId, filename, original_name: originalName, storage_path: storagePath, public_url: publicUrl })
      .select()
      .single();
    throwIf(error);
    return data;
  }

  async deletePrescription(userId, prescriptionId) {
    const { data, error } = await supabase
      .from('prescriptions')
      .delete()
      .eq('id', prescriptionId)
      .eq('user_id', userId)
      .select()
      .single();
    throwIf(error);
    return data;
  }
}

module.exports = new UserService();
