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
 * AdminService — user management, analytics, and doctor operations.
 */
class AdminService {
  // ─── Users ────────────────────────────────────────────────────────────────

  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    throwIf(error);
    return data || [];
  }

  async deleteUser(userId) {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    throwIf(error);
  }

  async toggleUserStatus(userId) {
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('is_active')
      .eq('id', userId)
      .single();
    throwIf(fetchError);

    const { data, error } = await supabase
      .from('profiles')
      .update({ is_active: !profile.is_active })
      .eq('id', userId)
      .select()
      .single();
    throwIf(error);
    return data;
  }

  // ─── Analytics ────────────────────────────────────────────────────────────

  async getAnalytics() {
    const { count: totalUsers, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    throwIf(countError);

    const { data: allRoles, error: roleError } = await supabase
      .from('profiles')
      .select('role');
    throwIf(roleError);

    const usersByRole = {};
    allRoles?.forEach(({ role }) => { usersByRole[role] = (usersByRole[role] || 0) + 1; });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentUsers, error: trendError } = await supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString());
    throwIf(trendError);

    const trendMap = {};
    recentUsers?.forEach(({ created_at }) => {
      const dateStr = new Date(created_at).toISOString().split('T')[0];
      trendMap[dateStr] = (trendMap[dateStr] || 0) + 1;
    });

    const registrationTrend = Object.entries(trendMap)
      .map(([_id, count]) => ({ _id, count }))
      .sort((a, b) => a._id.localeCompare(b._id));

    const { data: lastLoggedInUser, error: lastError } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
    throwIf(lastError);

    return { totalUsers, usersByRole, registrationTrend, lastLoggedInUser };
  }

  // ─── Doctors ──────────────────────────────────────────────────────────────

  async getAllDoctors() {
    const { data, error } = await supabase.from('doctors').select('*').order('name');
    throwIf(error);
    return data || [];
  }

  async getDoctorByName(nameParam) {
    const cleanedName = nameParam.replace(/\s+/g, '').replace(/^Dr\.?/i, '');
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .ilike('name', `%${cleanedName}%`)
      .limit(1)
      .maybeSingle();
    throwIf(error);
    return data;
  }

  async deleteDoctor(doctorId) {
    const { error } = await supabase.from('doctors').delete().eq('id', doctorId);
    throwIf(error);
  }
}

module.exports = new AdminService();
