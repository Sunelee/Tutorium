const Course = require('../models/CourseModel');
const User = require('../models/UserModel');
const Request = require('../models/RequestModel');

const fetchWebsiteStatistics = async (req, res) => {
  try {
    // Fetch the total number of students
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Count the total number of unique tutor IDs from the courses
    const totalTutors = await Course.aggregate([
      { $group: { _id: '$tutor', count: { $sum: 1 } } },
      { $count: 'totalTutors' },
    ]).exec();

    // If no tutors are found, set totalTutors to 0
    const totalTutorsCount = totalTutors.length === 0 ? 0 : totalTutors[0].totalTutors;

    // Fetch the total number of courses
    const totalCourses = await Course.countDocuments();

    // Fetch the total number of requests
    const totalRequests = await Request.countDocuments();

    const statistics = {
      totalStudents,
      totalTutors: totalTutorsCount,
      totalCourses,
      totalRequests,
    };

    res.json(statistics);
  } catch (error) {
    console.error('Error fetching website statistics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  fetchWebsiteStatistics,
};
