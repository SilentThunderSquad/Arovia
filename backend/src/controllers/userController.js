const User = require("../models/User");
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
}).single("prescription");

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
  try {
    const { name, phone, dob, bloodDonor, profilePicture } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (dob) updates.dob = dob;
    if (typeof bloodDonor !== 'undefined') updates.bloodDonor = bloodDonor;
    if (profilePicture) updates.profilePicture = profilePicture;

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
};

// Update Address
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
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: "Account deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
