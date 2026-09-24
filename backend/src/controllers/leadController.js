const Lead = require('../models/Lead');
const User = require('../models/User');
const Course = require('../models/Course');
const FollowUp = require('../models/FollowUp');

// Auto round-robin helper for unassigned leads
const assignLeadRoundRobin = async (courseId) => {
  try {
    let counsellorQuery = { role: 'counsellor', active: true };
    
    // Check if course has department specialization
    if (courseId) {
      const course = await Course.findById(courseId);
      if (course && course.department) {
        const specCounsellor = await User.findOne({ 
          role: 'counsellor', 
          active: true, 
          specialization: course.department 
        }).sort({ activeLeadCount: 1 });
        
        if (specCounsellor) {
          specCounsellor.activeLeadCount += 1;
          await specCounsellor.save();
          return { counsellor: specCounsellor, type: 'Specialization Routing' };
        }
      }
    }

    // Fallback to general round robin (least active lead count)
    const nextCounsellor = await User.findOne(counsellorQuery).sort({ activeLeadCount: 1 });
    if (nextCounsellor) {
      nextCounsellor.activeLeadCount += 1;
      await nextCounsellor.save();
      return { counsellor: nextCounsellor, type: 'Auto Round-Robin' };
    }
    
    return { counsellor: null, type: 'Unassigned' };
  } catch (err) {
    console.error('Auto assignment error:', err);
    return { counsellor: null, type: 'Unassigned' };
  }
};

// Generate unique lead number e.g. ADM-2026-1001
const generateLeadNumber = async () => {
  const count = await Lead.countDocuments();
  const year = new Date().getFullYear();
  return `ADM-${year}-${(count + 1001).toString()}`;
};

exports.getLeads = async (req, res) => {
  try {
    const { status, source, ageingCategory, counsellor, course, search } = req.query;
    let query = {};

    // Counsellors can only see assigned leads unless Manager or Admin
    if (req.user && req.user.role === 'counsellor') {
      query.assignedCounsellor = req.user._id;
    } else if (counsellor) {
      query.assignedCounsellor = counsellor;
    }

    if (status) query.status = status;
    if (source) query.source = source;
    if (ageingCategory) query.ageingCategory = ageingCategory;
    if (course) query.preferredCourse = course;

    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { leadNumber: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(query)
      .populate('preferredCourse', 'name code annualFee')
      .populate('assignedCounsellor', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('preferredCourse')
      .populate('assignedCounsellor')
      .populate('enrolledCourse');

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const followUps = await FollowUp.find({ lead: lead._id }).sort({ createdAt: -1 });

    res.json({ success: true, data: { lead, followUps } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createLead = async (req, res) => {
  try {
    const leadNumber = await generateLeadNumber();
    const leadData = { ...req.body, leadNumber };

    // Auto assign if no counsellor assigned
    if (!leadData.assignedCounsellor) {
      const assignment = await assignLeadRoundRobin(leadData.preferredCourse);
      if (assignment.counsellor) {
        leadData.assignedCounsellor = assignment.counsellor._id;
        leadData.assignedCounsellorName = assignment.counsellor.name;
        leadData.assignmentType = assignment.type;
        leadData.assignedAt = new Date();
      }
    } else {
      const counsellorObj = await User.findById(leadData.assignedCounsellor);
      if (counsellorObj) {
        leadData.assignedCounsellorName = counsellorObj.name;
        leadData.assignmentType = 'Manual Manager Reallocation';
        leadData.assignedAt = new Date();
        counsellorObj.activeLeadCount += 1;
        await counsellorObj.save();
      }
    }

    const lead = new Lead(leadData);
    await lead.save();

    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const existingLead = await Lead.findById(req.params.id);
    if (!existingLead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Check enrollment status trigger
    if (req.body.status === 'Enrolled' && existingLead.status !== 'Enrolled') {
      const courseId = req.body.enrolledCourse || existingLead.preferredCourse;
      if (courseId) {
        const course = await Course.findById(courseId);
        if (course) {
          course.seatsFilled += 1;
          await course.save();
        }
      }
    }

    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('preferredCourse')
      .populate('assignedCounsellor');

    res.json({ success: true, data: updatedLead });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.assignLead = async (req, res) => {
  try {
    const { leadId, counsellorId } = req.body;
    const lead = await Lead.findById(leadId);
    const counsellor = await User.findById(counsellorId);

    if (!lead || !counsellor) {
      return res.status(404).json({ success: false, message: 'Lead or Counsellor not found' });
    }

    // Adjust counts
    if (lead.assignedCounsellor) {
      await User.findByIdAndUpdate(lead.assignedCounsellor, { $inc: { activeLeadCount: -1 } });
    }
    counsellor.activeLeadCount += 1;
    await counsellor.save();

    lead.assignedCounsellor = counsellor._id;
    lead.assignedCounsellorName = counsellor.name;
    lead.assignmentType = 'Manual Manager Reallocation';
    lead.assignedAt = new Date();
    await lead.save();

    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    if (lead.assignedCounsellor) {
      await User.findByIdAndUpdate(lead.assignedCounsellor, { $inc: { activeLeadCount: -1 } });
    }
    await FollowUp.deleteMany({ lead: req.params.id });

    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
