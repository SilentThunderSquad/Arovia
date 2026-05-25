import { api } from '@shared/services/api';

/**
 * adminService — all admin dashboard API calls.
 * Feature-specific service living within features/admin.
 */
const adminService = {
  async getAnalytics() {
    return api.get('/api/admin/analytics');
  },

  async getAllUsers() {
    return api.get('/api/admin/users');
  },

  async deleteUser(userId) {
    return api.delete(`/api/admin/users/${userId}`);
  },

  async toggleUserStatus(userId) {
    return api.patch(`/api/admin/users/${userId}/status`);
  },

  async getAllDoctors() {
    return api.get('/api/admin/doctors');
  },

  async getDoctorByName(name) {
    return api.get(`/api/admin/doctors/${encodeURIComponent(name)}`);
  },

  async deleteDoctor(doctorId) {
    return api.delete(`/api/admin/doctors/${doctorId}`);
  },
};

export default adminService;
