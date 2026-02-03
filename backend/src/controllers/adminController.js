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
    const requestingUser = await User.findById(req.user.userId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const totalUsers = await User.countDocuments();

    // Users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);
    const roleStats = {};
    usersByRole.forEach((item) => { roleStats[item._id] = item.count; });

    // Registration Trend (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const registrationTrend = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const lastLoggedInUser = await User.findOne().select("-password").sort({ updatedAt: -1 });

    res.json({
      totalUsers,
      usersByRole: roleStats,
      registrationTrend,
      lastLoggedInUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: `User ${user.isActive ? 'activated' : 'suspended'}`, user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
