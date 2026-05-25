'use strict';

const adminService = require('./admin.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { success, notFound } = require('../../shared/utils/response');

/** GET /api/admin/users */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers();
  return success(res, { users: users.map(mapUserToFrontend), total: users.length });
});

/** GET /api/admin/analytics */
const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await adminService.getAnalytics();
  return success(res, analytics);
});

/** DELETE /api/admin/users/:id */
const deleteUser = asyncHandler(async (req, res) => {
  await adminService.deleteUser(req.params.id);
  return success(res, {}, 'User deleted');
});

/** PATCH /api/admin/users/:id/status */
const toggleUserStatus = asyncHandler(async (req, res) => {
  const updatedUser = await adminService.toggleUserStatus(req.params.id);
  const action = updatedUser.is_active ? 'activated' : 'suspended';
  return success(res, { user: mapUserToFrontend(updatedUser) }, `User ${action}`);
});

/** GET /api/admin/doctors */
const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await adminService.getAllDoctors();
  return success(res, { doctors: doctors.map(mapDoctorToFrontend) });
});

/** GET /api/admin/doctors/:name */
const getDoctorByName = asyncHandler(async (req, res) => {
  const doctor = await adminService.getDoctorByName(req.params.name);
  if (!doctor) return notFound(res, 'Doctor not found');
  return success(res, mapDoctorToFrontend(doctor));
});

/** DELETE /api/admin/doctors/:id */
const deleteDoctor = asyncHandler(async (req, res) => {
  await adminService.deleteDoctor(req.params.id);
  return success(res, {}, 'Doctor deleted successfully');
});

function mapUserToFrontend(profile) {
  return {
    _id: profile.id, id: profile.id, name: profile.name, username: profile.username,
    role: profile.role, phone: profile.phone, dob: profile.dob, gender: profile.gender,
    profilePicture: profile.profile_picture, bloodDonor: profile.blood_donor,
    isActive: profile.is_active, address: profile.address || {},
    createdAt: profile.created_at, updatedAt: profile.updated_at,
  };
}

function mapDoctorToFrontend(doctor) {
  return {
    _id: doctor.id, id: doctor.id, Name: doctor.name,
    Specialization: doctor.specialization, Sub_specialization: doctor.sub_specialization,
    Treats: doctor.treats, Experience: doctor.experience, Rating: doctor.rating,
    Qualification: doctor.qualification, Hospital: doctor.hospital, City: doctor.city,
    State: doctor.state, Schedule_days: doctor.schedule_days,
    Consultation_time: doctor.consultation_time, Consultation_fee: doctor.consultation_fee,
    Contact: doctor.contact, Languages: doctor.languages,
  };
}

module.exports = { getAllUsers, getAnalytics, deleteUser, toggleUserStatus, getAllDoctors, getDoctorByName, deleteDoctor };
