const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Message = require("../models/Message");
const Report = require("../models/Report");
const Doctor = require("../models/Doctor");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/prescriptions/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg, .jpeg and .pdf format allowed!"));
    }
  },
}).fields([
  { name: 'prescription', maxCount: 1 },
  { name: 'profilePicture', maxCount: 1 }
]);

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Upload prescription
exports.uploadPrescription = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Add prescription to user's prescriptions array
      const newPrescription = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: `http://localhost:5000/uploads/prescriptions/${req.file.filename}`, // Return full URL path for simplicity in local dev
        uploadedAt: new Date(),
      };
      // Note: path assumes local serving. For production, this should be relative or cloud URL.

      user.prescriptions.push(newPrescription);

      await user.save();

      // Return updated user or just the user object
      res.json({
        message: "Prescription uploaded successfully",
        user: user, // Return full user to update frontend state
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
};

// Update Profile
exports.updateProfile = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      // req.body contains text fields, req.files contains files
      const { name, phone, dob, gender, bloodDonor, address } = req.body;
      const updates = {};

      if (name) updates.name = name;
      if (phone) updates.phone = phone;
      if (dob) updates.dob = dob;
      if (gender) updates.gender = gender;
      if (typeof bloodDonor !== 'undefined') updates.bloodDonor = bloodDonor === 'true' || bloodDonor === true;

      // Handle Address (might come as JSON string or individual fields depending on frontend)
      if (address) {
        updates.address = typeof address === 'string' ? JSON.parse(address) : address;
      }

      // Handle Profile Picture
      if (req.files && req.files['profilePicture']) {
        const file = req.files['profilePicture'][0];
        // For production, use cloud storage or proper static path
        updates.profilePicture = `http://localhost:5000/uploads/prescriptions/${file.filename}`;
      }

      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { $set: updates },
        { new: true, runValidators: true }
      ).select("-password");

      res.json({ message: "Profile updated", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
};

// Update Address (Deprecated in favor of generic updateProfile, but kept for compatibility)
exports.updateAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { address } },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ message: "Address updated", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

    user.password = newPassword; // Pre-save hook will hash it
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Prescription
exports.deletePrescription = async (req, res) => {
  try {
    const prescriptionId = req.params.id;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { prescriptions: { _id: prescriptionId } } },
      { new: true }
    ).select("-password");

    // Ideally delete file from FS too, but skipping for now
    res.json({ message: "Prescription deleted", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete profile picture if it exists and is local
    if (user.profilePicture && user.profilePicture.includes('/uploads/')) {
      const filename = user.profilePicture.split('/').pop();
      const fs = require('fs');
      const filePath = path.join(__dirname, '../..', 'uploads/prescriptions', filename); // Reusing prescriptions folder for now as per config
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: "Account deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Dates
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // 1. Stat Counts
    const todayAppointmentsCount = await Appointment.countDocuments({
      userId,
      date: { $gte: startOfToday, $lte: endOfToday },
      status: { $ne: 'Cancelled' },
    });
    const totalPatients = await User.countDocuments({ role: 'user', isActive: true });
    const pendingReports = await Report.countDocuments({ userId, status: 'Pending' });
    const unreadMessages = await Message.countDocuments({ toUserId: userId, isRead: false });
    const totalMessages = await Message.countDocuments({ toUserId: userId });

    // 2. Lists for Sections
    const todayAppointmentsList = await Appointment.find({
      userId,
      date: { $gte: startOfToday, $lte: endOfToday },
      status: { $ne: 'Cancelled' }
    }).sort({ date: 1 });

    const upcomingSchedule = await Appointment.find({
      userId,
      date: { $gt: endOfToday }, // beyond today
      status: 'Upcoming'
    }).sort({ date: 1 }).limit(4);

    const doctorSuggestionsList = await Doctor.find()
      .sort({ Rating: -1 })
      .limit(4);

    // Formatted Doctor Suggestions
    const doctorSuggestions = doctorSuggestionsList.map(doc => {
        return {
            name: doc.Name || 'Unknown Doctor',
            detail: `${doc.Specialization || 'Specialist'} • ${doc.Experience || 'N/A Experience'}`,
            subDetail: `${doc.Hospital || 'Various Hospitals'} • ${doc.City || 'Any City'}`,
            rating: doc.Rating || 0,
            fee: doc.Consultation_fee || 'Varies'
        };
    });

    const nextAppointment = await Appointment.findOne({
      userId,
      date: { $gt: new Date() },
      status: 'Upcoming',
    }).sort({ date: 1 });

    res.json({
      todayAppointments: todayAppointmentsCount,
      todayAppointmentsList,
      upcomingSchedule,
      doctorSuggestions,
      nextAppointmentLabel: nextAppointment
        ? `Next: ${nextAppointment.time || 'Today'} - ${nextAppointment.doctorName}`
        : 'No appointments today',
      totalPatients,
      pendingReports,
      unreadMessages,
      totalMessages,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
