'use strict';

const supabase = require('../../infrastructure/supabase/client');

const RESERVED_USERNAMES = new Set([
  'admin', 'support', 'api', 'root', 'dashboard', 'login', 'signup',
  'arovia', 'help', 'status', 'callback', 'user', 'doctor', 'privacy',
  'terms', 'settings', 'profile', 'auth', 'database', 'system', 'null'
]);

class PublicService {
  /**
   * Validate if a username is in slug format and not reserved.
   */
  isValidUsername(username) {
    if (!username || typeof username !== 'string') return false;
    const normalized = username.toLowerCase().trim();
    if (normalized.length < 3 || normalized.length > 30) return false;
    
    // Slug format: alphanumeric, hyphens, and underscores only
    const slugRegex = /^[a-z0-9-_]+$/;
    if (!slugRegex.test(normalized)) return false;

    // Check reserved list
    if (RESERVED_USERNAMES.has(normalized)) return false;

    return true;
  }

  /**
   * Check if a username is fully available (not in profiles, not in history, not reserved).
   */
  async checkUsernameAvailability(username) {
    const normalized = username.toLowerCase().trim();

    if (!this.isValidUsername(normalized)) {
      return { available: false, reason: 'Username is invalid or reserved' };
    }

    // 1. Check profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', normalized)
      .maybeSingle();

    if (profileError) throw profileError;
    if (profileData) {
      return { available: false, reason: 'Username is already taken' };
    }

    // 2. Check username history table to prevent hijacking/impersonation
    const { data: historyData, error: historyError } = await supabase
      .from('username_history')
      .select('id')
      .eq('old_username', normalized)
      .maybeSingle();

    // If history table doesn't exist yet (migration not fully ran), skip gracefully.
    // Handles both PGRST205 (PostgREST table missing) and standard PG "relation does not exist" errors.
    if (historyError && historyError.code !== 'PGRST205' && !historyError.message.includes('username_history')) {
      throw historyError;
    }

    if (historyData) {
      return { available: false, reason: 'Username is reserved or previously used' };
    }

    return { available: true };
  }

  /**
   * Fetch standard user profile by username. Excludes all private/auth details.
   */
  async getUserProfile(username) {
    const normalized = username.toLowerCase().trim();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', normalized)
      .eq('role', 'user')
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    // Handle visibility constraints
    // If visibility column does not exist yet (safeguard for migrations), assume public
    const visibility = data.visibility || 'public';
    if (visibility === 'private') {
      return null; // Treated as 404 for unauthenticated queries
    }

    // Serialize clean public DTO (strictly hide secure internal IDs and parameters)
    return {
      name: data.name,
      username: data.username,
      gender: data.gender,
      profilePicture: data.profile_picture,
      bloodDonor: data.blood_donor,
      isActive: data.is_active,
      address: data.address?.city ? {
        city: data.address.city,
        state: data.address.state,
        country: data.address.country,
      } : null,
      createdAt: data.created_at,
    };
  }

  /**
   * Fetch doctor/admin profile by username. Excludes secure keys, emails, and phone.
   */
  async getDoctorProfile(username) {
    const normalized = username.toLowerCase().trim();

    // Query profile first to confirm role and active status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', normalized)
      .in('role', ['doctor', 'admin'])
      .maybeSingle();

    if (profileError) throw profileError;
    if (!profile) return null;

    const visibility = profile.visibility || 'public';
    if (visibility === 'private') return null;

    // Fetch related doctor details if doctor
    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .select('*')
      .ilike('name', `%${profile.name}%`)
      .maybeSingle();

    if (doctorError) throw doctorError;

    // Serialize clean public doctor DTO
    return {
      name: profile.name,
      username: profile.username,
      profilePicture: profile.profile_picture,
      gender: profile.gender,
      isActive: profile.is_active,
      specialization: doctor?.specialization || 'General Practice',
      subSpecialization: doctor?.sub_specialization || null,
      treats: doctor?.treats || null,
      experience: doctor?.experience || null,
      rating: doctor?.rating || null,
      qualification: doctor?.qualification || null,
      hospital: doctor?.hospital || null,
      city: doctor?.city || profile.address?.city || null,
      languages: doctor?.languages || null,
      scheduleDays: doctor?.schedule_days || null,
      consultationTime: doctor?.consultation_time || null,
      consultationFee: doctor?.consultation_fee || null,
    };
  }
}

module.exports = new PublicService();
