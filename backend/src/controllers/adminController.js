const User = require("../models/User");

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Verify the requesting user is an admin
    const requestingUser = await User.findById(req.user.userId);
    
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const users = await User.find().select("-password").sort({ updatedAt: -1 });

    res.json({
      users,
      total: users.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get analytics (admin only)
exports.getAnalytics = async (req, res) => {
  try {
    // Verify the requesting user is an admin
    const requestingUser = await User.findById(req.user.userId);
    
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const totalUsers = await User.countDocuments();
    
    // Get users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert array to object
    const roleStats = {};
    usersByRole.forEach((item) => {
      roleStats[item._id] = item.count;
    });

    // Get last logged in user (most recently updated)
    const lastLoggedInUser = await User.findOne()
      .select("-password")
      .sort({ updatedAt: -1 });

    res.json({
      totalUsers,
      usersByRole: roleStats,
      lastLoggedInUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
