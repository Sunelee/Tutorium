const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
    min: 0,
  },
  level: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  curriculum: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Curriculum', // Reference to the Curriculum model
    },
  ],
  includes: [String],

  isPaid: {
    type: Boolean,
    required: true,
  },
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  enrollmentCount: {
    type: Number,
    default: 0,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  ratingSum: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    get: function () {
      if (this.ratingCount === 0) {
        return 0;
      }
      return this.ratingSum / this.ratingCount;
    },
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  totalSoldCourses: {
    type: Number,
    default: 0,
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
