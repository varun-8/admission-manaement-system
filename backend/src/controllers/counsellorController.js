const User = require('../models/User');
const Lead = require('../models/Lead');
const Target = require('../models/Target');

exports.getCounsellors = async (req, res) => {
  try {
    const counsellors = await User.find({ role: { $in: ['counsellor', 'admin', 'manager', 'superadmin'] }, active: { $ne: false } }).select('-password');
    res.json({ success: true, count: counsellors.length, data: counsellors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCounsellorPerformance = async (req, res) => {
  try {
    const counsellors = await User.find({ role: { $in: ['counsellor', 'admin', 'manager', 'superadmin'] }, active: { $ne: false } }).select('-password');
    
    const performanceData = await Promise.all(
      counsellors.map(async (counsellor) => {
        const totalAssigned = await Lead.countDocuments({ assignedCounsellor: counsellor._id });
        const enrolledCount = await Lead.countDocuments({ assignedCounsellor: counsellor._id, status: 'Enrolled' });
        const activeLeads = await Lead.countDocuments({ 
          assignedCounsellor: counsellor._id, 
          status: { $nin: ['Enrolled', 'Lost'] } 
        });
        const conversionRate = totalAssigned > 0 ? ((enrolledCount / totalAssigned) * 100).toFixed(1) : 0;

        return {
          _id: counsellor._id,
          name: counsellor.name,
          email: counsellor.email,
          phone: counsellor.phone,
          specialization: counsellor.specialization || 'General',
          totalAssigned,
          activeLeads,
          enrolledCount,
          conversionRate: Number(conversionRate),
        };
      })
    );

    res.json({ success: true, data: performanceData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCounsellor = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Counsellor user not found' });
    }
    res.json({ success: true, message: 'Counsellor account deactivated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

