const FollowUp = require('../models/FollowUp');
const Lead = require('../models/Lead');

exports.createFollowUp = async (req, res) => {
  try {
    const { leadId, type, outcome, notes, scheduledFollowUpDate } = req.body;

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const followUp = new FollowUp({
      lead: leadId,
      counsellor: req.user._id,
      counsellorName: req.user.name,
      type,
      outcome,
      notes,
      scheduledFollowUpDate,
    });

    await followUp.save();

    // Update Lead state
    lead.lastContactedAt = new Date();
    lead.followUpCount += 1;
    if (scheduledFollowUpDate) {
      lead.nextFollowUpDate = scheduledFollowUpDate;
    }

    // Auto status escalation based on interaction outcome
    if (outcome === 'Scheduled Campus Visit') {
      lead.status = 'Campus Visit';
    } else if (outcome === 'Fee Paid') {
      lead.status = 'Enrolled';
    } else if (lead.status === 'New') {
      lead.status = 'Contacted';
    }

    await lead.save();

    res.status(201).json({ success: true, data: followUp });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getLeadFollowUps = async (req, res) => {
  try {
    const followUps = await FollowUp.find({ lead: req.params.leadId }).sort({ createdAt: -1 });
    res.json({ success: true, count: followUps.length, data: followUps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
