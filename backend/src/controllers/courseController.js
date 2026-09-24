const Course = require('../models/Course');
const Lead = require('../models/Lead');

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ active: { $ne: false } }).sort({ name: 1 });
    
    // Calculate seatsFilled dynamically from Enrolled leads for each course
    const coursesWithDynamicSeats = await Promise.all(
      courses.map(async (course) => {
        const enrolledCount = await Lead.countDocuments({
          $or: [{ preferredCourse: course._id }, { preferredCourseName: course.name }],
          status: 'Enrolled'
        });
        const courseObj = course.toObject();
        courseObj.seatsFilled = enrolledCount;
        return courseObj;
      })
    );

    res.json({ success: true, count: coursesWithDynamicSeats.length, data: coursesWithDynamicSeats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
