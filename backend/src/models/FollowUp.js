const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true,
  },
  counsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  counsellorName: {
    type: String,
  },
  type: {
    type: String,
    enum: ['Phone Call', 'Campus Counseling', 'WhatsApp Message', 'Email', 'Document Submission'],
    default: 'Phone Call',
  },
  outcome: {
    type: String,
    enum: ['Connected - Interested', 'Connected - Thinking', 'Connected - Not Interested', 'Busy / No Answer', 'Scheduled Campus Visit', 'Fee Paid'],
    default: 'Connected - Interested',
  },
  notes: {
    type: String,
    required: true,
    trim: true,
  },
  scheduledFollowUpDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('FollowUp', followUpSchema);
