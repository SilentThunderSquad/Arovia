'use strict';

const publicService = require('./public.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { success, notFound, badRequest } = require('../../shared/utils/response');

/** GET /api/public/username-check/:username */
const checkUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username) return badRequest(res, 'Username parameter is required');
  
  const result = await publicService.checkUsernameAvailability(username);
  return success(res, result);
});

/** GET /api/public/user/:username */
const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username) return badRequest(res, 'Username is required');

  const profile = await publicService.getUserProfile(username);
  if (!profile) return notFound(res, 'Public profile not found');

  return success(res, profile);
});

/** GET /api/public/doctor/:username */
const getDoctorProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username) return badRequest(res, 'Username is required');

  const profile = await publicService.getDoctorProfile(username);
  if (!profile) return notFound(res, 'Doctor profile not found');

  return success(res, profile);
});

module.exports = {
  checkUsername,
  getUserProfile,
  getDoctorProfile,
};
