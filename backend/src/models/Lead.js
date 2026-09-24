const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  leadNumber: {
    type: String,
    required: true,
    unique: true,
  },
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  parentName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  alternatePhone: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  previousQualification: {
    type: String, // 10th, 12th State, 12th CBSE, UG Degree, Diploma
    trim: true,
  },
  academicPercentage: {
    type: Number,
  },
  entranceExamScore: {
    type: String, // e.g. "JEE Rank 14500", "NEET 540", "CAT 88 percentile"
    trim: true,
  },
  preferredCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  preferredCourseName: {
    type: String,
  },
  secondaryCourseName: {
    type: String,
  },
  preferredBatch: {
    type: String,
    enum: ['Regular Full-Time', 'Weekend/Part-Time', 'Evening Shift'],
    default: 'Regular Full-Time',
  },
  hostelRequired: {
    type: Boolean,
    default: false,
  },
  transportRequired: {
    type: Boolean,
    default: false,
  },
  source: {
    type: String,
    enum: ['Website', 'Walk-in', 'Phone Call', 'WhatsApp', 'Educational Fair', 'Campaign', 'Referral', 'Other'],
    default: 'Website',
  },
  campaignName: {
    type: String,
    trim: true,
  },
  fairLocation: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: [
      'New',
      'Contacted',
      'Counseling Scheduled',
      'Campus Visit',
      'Application Submitted',
      'Enrolled',
      'Deferred',
      'Lost'
    ],
    default: 'New',
  },
  assignedCounsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedCounsellorName: {
    type: String,
    default: 'Unassigned',
  },
  assignedAt: {
    type: Date,
  },
  assignmentType: {
    type: String,
    enum: ['Auto Round-Robin', 'Specialization Routing', 'Manual Manager Reallocation', 'Unassigned'],
    default: 'Unassigned',
  },
  nextFollowUpDate: {
    type: Date,
  },
  lastContactedAt: {
    type: Date,
  },
  followUpCount: {
    type: Number,
    default: 0,
  },
  ageingCategory: {
    type: String,
    enum: ['Fresh', 'Active', 'Stale', 'Aged'],
    default: 'Fresh',
  },
  slaBreached: {
    type: Boolean,
    default: false,
  },
  enrolledCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  feePaidAmount: {
    type: Number,
    default: 0,
  },
  enrollmentDate: {
    type: Date,
  },
  lostReason: {
    type: String,
    enum: [
      'Financial Constraints',
      'Joined Competitor Institution',
      'Desired Course Not Offered',
      'Distance / Relocation Issue',
      'Unresponsive / Not Reachable',
      'Other'
    ],
  },
  notes: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to compute ageing category before saving
leadSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  
  const created = this.createdAt || new Date();
  const diffHours = (new Date() - created) / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  if (diffDays <= 1) {
    this.ageingCategory = 'Fresh';
  } else if (diffDays <= 7) {
    this.ageingCategory = 'Active';
  } else if (diffDays <= 30) {
    this.ageingCategory = 'Stale';
  } else {
    this.ageingCategory = 'Aged';
  }

  // SLA breach check: If New and created over 4 hours ago without contact
  if (this.status === 'New' && diffHours > 4) {
    this.slaBreached = true;
  } else {
    this.slaBreached = false;
  }

  next();
});

module.exports = mongoose.model('Lead', leadSchema);
