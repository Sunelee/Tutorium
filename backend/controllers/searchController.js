// src/controllers/searchController.js

// Import the models (e.g., Tutor, Course, Category, Topic)
const Course = require('../models/CourseModel');
const Tutor = require('../models/UserModel'); // Assuming UserModel contains tutor information

// Search function that combines search for tutors, courses, categories, and topics
exports.search = async (req, res) => {
  try {
    const query = req.query.query;

    // Perform the search query on the Tutor, Course, Category, and Topic models
  
    const courses = await Course.find({ title: { $regex: new RegExp(query, 'i') } });
 

    res.status(200).json({
   
      courses,
   
    });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch suggestions for search query
exports.fetchSuggestions = async (req, res) => {
  try {
    const query = req.query.query;

    // Perform the search query on the Tutor, Course, Category, and Topic models

    const courses = await Course.find({ title: { $regex: new RegExp(query, 'i') } });

    const suggestions = courses.map(course => course.title);

    res.status(200).json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
