const Lead = require('../models/Lead');
const Course = require('../models/Course');
const User = require('../models/User');

exports.getAnalyticsSummary = async (req, res) => {
  try {
    let leadFilter = {};
    if (req.user && req.user.role === 'counsellor') {
      leadFilter.assignedCounsellor = req.user._id;
    }

    const totalLeads = await Lead.countDocuments(leadFilter);
    const enrolledLeads = await Lead.countDocuments({ ...leadFilter, status: 'Enrolled' });
    const activeLeads = await Lead.countDocuments({ ...leadFilter, status: { $nin: ['Enrolled', 'Lost'] } });
    const lostLeads = await Lead.countDocuments({ ...leadFilter, status: 'Lost' });
    const slaBreachedLeads = await Lead.countDocuments({ ...leadFilter, slaBreached: true });

    const conversionRate = totalLeads > 0 ? ((enrolledLeads / totalLeads) * 100).toFixed(1) : 0;

    // Conversion Funnel Data
    const funnelStages = [
      'New',
      'Contacted',
      'Counseling Scheduled',
      'Campus Visit',
      'Application Submitted',
      'Enrolled'
    ];

    const funnelCounts = await Promise.all(
      funnelStages.map(async (stage) => {
        const count = await Lead.countDocuments({ ...leadFilter, status: stage });
        return { stage, count };
      })
    );

    // Source Distribution & Conversion ROI
    const sources = ['Website', 'Walk-in', 'Phone Call', 'WhatsApp', 'Educational Fair', 'Campaign', 'Referral'];
    const sourceBreakdown = await Promise.all(
      sources.map(async (src) => {
        const count = await Lead.countDocuments({ ...leadFilter, source: src });
        const enrolled = await Lead.countDocuments({ ...leadFilter, source: src, status: 'Enrolled' });
        const rate = count > 0 ? ((enrolled / count) * 100).toFixed(1) : 0;
        return { source: src, total: count, enrolled, conversionRate: Number(rate) };
      })
    );

    // Ageing Breakdown
    const ageingCategories = ['Fresh', 'Active', 'Stale', 'Aged'];
    const ageingBreakdown = await Promise.all(
      ageingCategories.map(async (cat) => {
        const count = await Lead.countDocuments({ ...leadFilter, ageingCategory: cat });
        return { category: cat, count };
      })
    );

    // Course Demand Stats - dynamically calculated from actual enrolled leads
    const courses = await Course.find({ active: { $ne: false } });
    const courseDemand = await Promise.all(
      courses.map(async (c) => {
        const courseMatch = { $or: [{ preferredCourse: c._id }, { preferredCourseName: c.name }] };
        const leadsCount = await Lead.countDocuments({ ...leadFilter, ...courseMatch });
        const enrolledCount = await Lead.countDocuments({ ...leadFilter, ...courseMatch, status: 'Enrolled' });
        return {
          courseId: c._id,
          code: c.code,
          name: c.name,
          totalSeats: c.totalSeats || 60,
          seatsFilled: enrolledCount, // Direct realtime calculation from enrolled leads
          leadsCount,
          enrolledCount,
        };
      })
    );

    res.json({
      success: true,
      data: {
        kpi: {
          totalLeads,
          activeLeads,
          enrolledLeads,
          lostLeads,
          slaBreachedLeads,
          conversionRate: Number(conversionRate),
        },
        funnel: funnelCounts,
        sourceBreakdown,
        ageingBreakdown,
        courseDemand,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
