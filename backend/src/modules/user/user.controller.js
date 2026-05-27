'use strict';

const userService = require('./user.service');
const authService = require('../auth/auth.service');
const publicService = require('../public/public.service');
const storageService = require('../../infrastructure/storage/storage.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { success, notFound, badRequest } = require('../../shared/utils/response');

/** GET /api/user/profile */
const getUserProfile = asyncHandler(async (req, res) => {
  let profile = await userService.getProfile(req.user.userId);
  
  // If the user does not have a profile yet (e.g. legacy account or missed trigger)
  if (!profile) {
    profile = await userService.createProfile({
      id: req.user.userId,
      email: req.user.email,
      name: req.user.email.split('@')[0],
      username: req.user.email.split('@')[0],
      role: req.user.role || 'user'
    });
  }

  const prescriptions = await userService.getPrescriptions(req.user.userId);
  return success(res, mapProfileToFrontend(profile, prescriptions, req.user.email));
});

/** PUT /api/user/profile */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, dob, gender, bloodDonor, address, username, visibility, profilePictureUrl } = req.body;
  const updates = {};
  if (name)   updates.name = name;
  if (phone)  updates.phone = phone;
  if (dob)    updates.dob = dob;
  if (gender) updates.gender = gender;
  if (typeof bloodDonor !== 'undefined') updates.blood_donor = bloodDonor === 'true' || bloodDonor === true;
  if (address) updates.address = typeof address === 'string' ? JSON.parse(address) : address;
  if (profilePictureUrl) updates.profile_picture = profilePictureUrl;

  if (username) {
    const cleanUsername = username.toLowerCase().trim();
    if (!publicService.isValidUsername(cleanUsername)) {
      return badRequest(res, 'Invalid or reserved username format');
    }
    const availability = await publicService.checkUsernameAvailability(cleanUsername);
    if (!availability.available) {
      const currentProfile = await userService.getProfile(req.user.userId);
      if (currentProfile?.username !== cleanUsername) {
        return badRequest(res, availability.reason);
      }
    }
    updates.username = cleanUsername;
  }

  if (visibility) {
    if (!['public', 'private', 'unlisted'].includes(visibility)) {
      return badRequest(res, 'Invalid visibility setting');
    }
    updates.visibility = visibility;
  }

  if (req.files?.profilePicture?.[0]) {
    const file = req.files.profilePicture[0];
    const { publicUrl } = await storageService.uploadAvatar(req.user.userId, file.buffer, file.mimetype, file.originalname);
    updates.profile_picture = publicUrl;
  }

  const updatedProfile = await userService.updateProfile(req.user.userId, updates);
  const prescriptions = await userService.getPrescriptions(req.user.userId);
  return success(res, { user: mapProfileToFrontend(updatedProfile, prescriptions, req.user.email) }, 'Profile updated');
});

/** PUT /api/user/address */
const updateAddress = asyncHandler(async (req, res) => {
  let { address } = req.body;
  
  if (!address) {
    return badRequest(res, 'Address object is required');
  }
  
  // Parse if it comes as string (from form data)
  if (typeof address === 'string') {
    try {
      address = JSON.parse(address);
    } catch (e) {
      console.error('[ADDRESS] Failed to parse address string:', e.message);
      return badRequest(res, 'Invalid address format');
    }
  }
  
  // Validate required fields
  if (!address.country) {
    return badRequest(res, 'Country is required');
  }
  
  if (!address.pincode) {
    return badRequest(res, 'Pincode is required');
  }
  
  if (!/^\d{6}$/.test(address.pincode)) {
    return badRequest(res, 'Pincode must be exactly 6 digits');
  }
  
  if (!address.addressLine1) {
    return badRequest(res, 'Address Line 1 is required');
  }
  
  console.log('[ADDRESS] Updating address for user:', req.user.userId, 'with:', address);
  
  try {
    const updatedProfile = await userService.updateProfile(req.user.userId, { address });
    console.log('[ADDRESS] Update successful, profile returned:', !!updatedProfile);
    
    const prescriptions = await userService.getPrescriptions(req.user.userId);
    return success(res, { user: mapProfileToFrontend(updatedProfile, prescriptions, req.user.email) }, 'Address updated');
  } catch (error) {
    console.error('[ADDRESS] Error during update:', error.message, error.stack);
    throw error;
  }
});

/** POST /api/user/change-password */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return badRequest(res, 'Current and new passwords are required');
  if (newPassword.length < 6) return badRequest(res, 'New password must be at least 6 characters');
  await authService.loginUser(req.user.email, currentPassword);
  await authService.updatePassword(req.user.userId, newPassword);
  return success(res, {}, 'Password updated successfully');
});

/** POST /api/user/prescription */
const uploadPrescription = asyncHandler(async (req, res) => {
  if (!req.files?.prescription?.[0]) return badRequest(res, 'No prescription file provided');
  const file = req.files.prescription[0];
  const uploadResult = await storageService.uploadPrescription(req.user.userId, file.buffer, file.mimetype, file.originalname);
  const prescription = await userService.addPrescription(req.user.userId, {
    filename: uploadResult.filename,
    originalName: uploadResult.originalName,
    storagePath: uploadResult.storagePath,
    publicUrl: uploadResult.publicUrl,
  });
  return success(res, { prescription }, 'Prescription uploaded successfully');
});

/** DELETE /api/user/prescription/:id */
const deletePrescription = asyncHandler(async (req, res) => {
  const deletedRecord = await userService.deletePrescription(req.user.userId, req.params.id);
  if (deletedRecord?.storage_path) await storageService.deleteFile('prescriptions', deletedRecord.storage_path);
  const prescriptions = await userService.getPrescriptions(req.user.userId);
  return success(res, { prescriptions }, 'Prescription deleted');
});

/** DELETE /api/user/delete-account */
const deleteAccount = asyncHandler(async (req, res) => {
  await authService.deleteAuthUser(req.user.userId);
  return success(res, {}, 'Account deleted successfully');
});

function mapProfileToFrontend(profile, prescriptions = [], email = null) {
  return {
    _id: profile.id, id: profile.id, name: profile.name, username: profile.username,
    email: email || profile.email || null, role: profile.role, phone: profile.phone,
    dob: profile.dob, gender: profile.gender, profilePicture: profile.profile_picture,
    bloodDonor: profile.blood_donor, isActive: profile.is_active, address: profile.address || {},
    visibility: profile.visibility || 'public',
    prescriptions: prescriptions.map((p) => ({
      _id: p.id, id: p.id, filename: p.filename, originalName: p.original_name,
      path: p.public_url, uploadedAt: p.uploaded_at,
    })),
    createdAt: profile.created_at, updatedAt: profile.updated_at,
  };
}

module.exports = { getUserProfile, updateProfile, updateAddress, changePassword, uploadPrescription, deletePrescription, deleteAccount };
