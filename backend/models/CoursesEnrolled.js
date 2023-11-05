const mongoose = require('mongoose');


const CourseEnrolledSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  progress: {
    type: Number,
    default: 0,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const CourseEnrolled = mongoose.model('CourseEnrolled', CourseEnrolledSchema);

module.exports = CourseEnrolled;

