'use strict';

const https = require('https');
const publicService = require('./public.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { success, notFound, badRequest } = require('../../shared/utils/response');

// HTTPS agent that accepts self-signed certificates (for dev only - postalpincode.in has cert issues)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

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

/** GET /api/public/pincode/:pincode */
const getPincodeLocation = asyncHandler(async (req, res) => {
  const { pincode } = req.params;
  
  if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
    return badRequest(res, 'Invalid pincode format. Must be 6 digits.');
  }

  // Fallback in-memory database for common Indian pincodes
  // This handles cases where external APIs are down or have cert issues
  const pincodeDatabase = {
    '713303': { state: 'West Bengal', city: 'Birbhum', country: 'India' },
    '281406': { state: 'Uttar Pradesh', city: 'Mathura', country: 'India' },
    '110001': { state: 'Delhi', city: 'New Delhi', country: 'India' },
    '400001': { state: 'Maharashtra', city: 'Mumbai', country: 'India' },
    '560001': { state: 'Karnataka', city: 'Bangalore', country: 'India' },
  };

  // Check local database first
  if (pincodeDatabase[pincode]) {
    return success(res, pincodeDatabase[pincode], 'Location found in database');
  }

  const fetchWithTimeout = (url, timeout = 5000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    return fetch(url, {
      signal: controller.signal,
      agent: httpsAgent,
      headers: {
        'User-Agent': 'Arovia-Health-Platform/1.0',
        'Accept': 'application/json'
      }
    }).finally(() => clearTimeout(timeoutId));
  };

  // Try primary API
  try {
    const primaryResponse = await fetchWithTimeout(`https://api.postalpincode.in/pincode/${pincode}`);

    if (primaryResponse.ok) {
      const data = await primaryResponse.json();
      
      if (Array.isArray(data) && data.length > 0 && data[0].Status === 'Success') {
        const postOffice = data[0].PostOffice[0];
        return success(res, {
          state: postOffice.State,
          city: postOffice.District,
          country: 'India'
        }, 'Location found');
      }
    }
  } catch (primaryError) {
    console.warn(`[PINCODE] Primary API failed for ${pincode}:`, primaryError.message);
  }

  // Try fallback API
  try {
    const fallbackResponse = await fetchWithTimeout(`https://pincode.in/api/v2/pincode/${pincode}`);

    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      
      if (fallbackData.success && fallbackData.data && fallbackData.data[0]) {
        const location = fallbackData.data[0];
        return success(res, {
          state: location.state_name,
          city: location.district_name,
          country: 'India'
        }, 'Location found');
      }
    }
  } catch (fallbackError) {
    console.warn(`[PINCODE] Fallback API failed for ${pincode}:`, fallbackError.message);
  }

  return badRequest(res, 'Pincode not found. Please enter state and city manually.');
});

module.exports = {
  checkUsername,
  getUserProfile,
  getDoctorProfile,
  getPincodeLocation,
};
