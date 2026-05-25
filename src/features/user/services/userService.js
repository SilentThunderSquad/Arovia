import { api } from '@shared/services/api';

/**
 * userService — all user profile & prescription API calls.
 * Feature-specific service living within features/user.
 */
const userService = {
  async getProfile() {
    return api.get('/api/user/profile');
  },

  async updateProfile(formData) {
    return api.upload('/api/user/profile', formData, 'PUT');
  },

  async updateAddress(address) {
    return api.put('/api/user/address', { address });
  },

  async changePassword(currentPassword, newPassword) {
    return api.post('/api/user/change-password', { currentPassword, newPassword });
  },

  async uploadPrescription(formData) {
    return api.upload('/api/user/prescription', formData, 'POST');
  },

  async deletePrescription(prescriptionId) {
    return api.delete(`/api/user/prescription/${prescriptionId}`);
  },

  async deleteAccount() {
    return api.delete('/api/user/delete-account');
  },
};

export default userService;
