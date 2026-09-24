const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    enum: ['Engineering', 'Management', 'Arts & Science', 'Medical & Allied', 'Diploma', 'Other'],
    default: 'Engineering',
  },
  durationYears: {
    type: Number,
    default: 4,
  },
  totalSeats: {
    type: Number,
    required: true,
    default: 60,
  },
  seatsFilled: {
    type: Number,
    default: 0,
  },
  annualFee: {
    type: Number,
    required: true,
    default: 100000,
  },
  description: {
    type: String,
    trim: true,
  },
  eligibilityCriteria: {
    type: String,
    default: 'Minimum 50% in qualifying examinations.',
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', courseSchema);
