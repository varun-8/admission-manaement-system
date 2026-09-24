const mongoose = require('mongoose');

const brandingSchema = new mongoose.Schema({
  appName: {
    type: String,
    required: true,
    default: 'EduMerge Admission CRM',
    trim: true,
  },
  appShortName: {
    type: String,
    default: 'EduMerge',
    trim: true,
  },
  tagline: {
    type: String,
    default: 'Educational Institution Admission Management System',
    trim: true,
  },
  logoType: {
    type: String,
    enum: ['icon', 'image'],
    default: 'icon',
  },
  logoIcon: {
    type: String,
    default: 'GraduationCap',
  },
  logoImage: {
    type: String,
    default: '',
  },
  primaryColor: {
    type: String,
    default: '#2563EB',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Branding', brandingSchema);
