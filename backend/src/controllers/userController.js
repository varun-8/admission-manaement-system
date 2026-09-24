const User = require('../models/User');
const Lead = require('../models/Lead');
const bcrypt = require('bcryptjs');

/**
 * @desc Get all staff users and counselors
 * @route GET /api/users
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ role: 1, name: 1 }).lean();

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch users' });
  }
};

/**
 * @desc Create a new counselor or staff user
 * @route POST /api/users
 */
const createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'counsellor', phone, specialization, active = true } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Counselor name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.includes('@')
      ? email.trim().toLowerCase()
      : `${email.trim().toLowerCase()}@institution.edu`;

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ success: false, message: `A user with email "${normalizedEmail}" already exists` });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: password.trim(),
      role: ['superadmin', 'manager', 'counsellor'].includes(role) ? role : 'counsellor',
      phone: phone ? phone.trim() : '',
      specialization: specialization ? specialization.trim() : 'General',
      active: Boolean(active),
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: `User "${newUser.name}" registered successfully`,
      data: userObj,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create user' });
  }
};

/**
 * @desc Update existing counselor or user
 * @route PUT /api/users/:id
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, phone, specialization, active } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User record not found' });
    }

    const oldName = user.name;
    const newName = name ? name.trim() : oldName;

    if (name) user.name = newName;
    if (email) {
      const normalizedEmail = email.includes('@')
        ? email.trim().toLowerCase()
        : `${email.trim().toLowerCase()}@institution.edu`;

      if (normalizedEmail !== user.email) {
        const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: id } });
        if (existing) {
          return res.status(400).json({ success: false, message: `Email "${normalizedEmail}" is already in use` });
        }
        user.email = normalizedEmail;
      }
    }
    if (role && ['superadmin', 'manager', 'counsellor'].includes(role)) {
      user.role = role;
    }
    if (phone !== undefined) user.phone = phone ? phone.trim() : '';
    if (specialization !== undefined) user.specialization = specialization ? specialization.trim() : 'General';
    if (active !== undefined) user.active = Boolean(active);

    if (password && password.trim().length >= 6) {
      user.password = password.trim();
    }

    await user.save();

    // If counselor name changed, update assigned counselor name in leads
    if (newName !== oldName) {
      try {
        await Lead.updateMany(
          { assignedCounsellor: user._id },
          { $set: { assignedCounsellorName: newName } }
        );
      } catch (cascadeErr) {
        console.warn('Lead assignedCounsellorName update warning:', cascadeErr.message);
      }
    }

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      success: true,
      message: `User "${user.name}" updated successfully`,
      data: userObj,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update user' });
  }
};

/**
 * @desc Delete user and reassign active leads
 * @route DELETE /api/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User record not found' });
    }

    if (user.role === 'superadmin' || user.email === 'superadmin@gmail.com') {
      return res.status(400).json({ success: false, message: 'Cannot delete super admin account' });
    }

    // Locate manager or superadmin for lead reassignment
    let manager = await User.findOne({ role: 'manager' }).lean();
    if (!manager) {
      manager = await User.findOne({ role: 'superadmin' }).lean();
    }

    const reassignedToId = manager ? manager._id : null;
    const reassignedToName = manager ? manager.name : 'Unassigned Pool';

    // Reassign active leads
    const leadUpdateResult = await Lead.updateMany(
      { assignedCounsellor: id },
      { $set: { assignedCounsellor: reassignedToId, assignedCounsellorName: reassignedToName } }
    );

    await User.findByIdAndDelete(id);

    const reassignedCount = leadUpdateResult.modifiedCount || leadUpdateResult.nModified || 0;

    res.json({
      success: true,
      message: `User "${user.name}" removed successfully. ${reassignedCount} lead(s) reassigned to ${reassignedToName}.`,
      reassignedCount,
      reassignedTo: reassignedToName,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete user' });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
