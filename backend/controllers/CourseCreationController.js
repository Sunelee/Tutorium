const User = require('../models/UserModel');
const Course = require('../models/CourseModel');
const Curriculum = require('../models/curriculumModel');
const mongoose = require('mongoose');

const CourseCreationController = {
  // Controller to create a new course
  async createCourse(req, res) {
    console.log("1st check")
    try {
      const courseData = req.body;
      const userId = req.user.id; // Assuming you have user data in the request object
  
      // Create a new curriculum document
      const newCurriculum = new Curriculum(courseData.curriculum);
  
      // Save the curriculum document
      const savedCurriculum = await newCurriculum.save();
      console.log("2nd check")
      
      // Create a new course and reference the curriculum ObjectId
      const newCourse = new Course({
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        price: courseData.price,
        currency: courseData.currency,
        duration: courseData.duration,
        level: courseData.level,
        image: courseData.image,
        isPaid: courseData.isPaid,
        includes: courseData.includes,
        curriculum: [savedCurriculum._id], // Use the ObjectId of the curriculum document
        tutor: userId, // Associate the course with the user who is creating it
        // Add any other missing fields here
      });
      
      // Save the new course to the database
      const createdCourse = await newCourse.save();
      const updateduser = await User.findByIdAndUpdate(
        courseId,
        {
          ...courseData,
          curriculum: [curriculumId],
        },
        { new: true }
      )
      console.log("3rd check")
      // Push the ID of the created course to the coursesCreated array for the user
      await User.findByIdAndUpdate(userId, { $push: { coursesCreated: createdCourse._id } });
  
      // Send a response indicating success
      res.status(201).json(createdCourse);
    } catch (error) {
      // Handle errors and send an error response
      console.error(error);
      res.status(500).json({ error: 'Failed to create the course.' });
    }
  },  

  async editCourse(req, res) {
    try {
      const courseId  = req.params.courseId;
      const courseData  = req.body;
      // Create a new curriculum document
      const newCurriculum = new Curriculum(courseData.curriculum);
  
      // Save the curriculum document
      const savedCurriculum = await newCurriculum.save();
  
      // Extract the _id of the saved curriculum
      const curriculumId = savedCurriculum._id;
  
      // Find the course by ID and update its data with the curriculumId
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        {
          ...courseData,
          curriculum: [curriculumId],
        },
        { new: true }
      );
  
      if (!updatedCourse) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      res.status(200).json(updatedCourse);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },  
  
  async fetchCreatedCourses (req, res) {
    const userId = req.user.id; // Assuming you have user data in the request object
  
    try {
      // Find courses associated with the user using Mongoose
      const courses = await Course.find({  tutor:  userId });
  
      // Send the list of courses as the response
      res.json(courses);
    } catch (error) {
      // Handle errors and send an error response
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch created courses.' });
    }
  },



// Controller function to delete a course
async deleteCourse(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Find the course by ID and delete it
    const deletedCourse = await Course.findOneAndRemove({ tutor: userId, _id: id });

    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(204).send(); // No content response for successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
},

async getCurriculumByCourseId(req, res) {
  try {
    const { courseId } = req.params;
    const { userId } = req.user; // Get the user ID from the request (if logged in)

    // Use the courseId to fetch curriculum data from your data source (Course model)
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if the requesting user is enrolled in the course (if logged in)
    const isUserEnrolled = userId && course.enrolledStudents.includes(userId);

    // Make all lessons free for enrolled users (if logged in)
    if (isUserEnrolled) {
      // Modify the curriculum to set isPaid to false for all lessons
      const modifiedCurriculum = course.curriculum.map((topic) => {
        return {
          ...topic.toObject(),
          lessons: topic.lessons.map((lesson) => ({
            ...lesson.toObject(),
            isPaid: false, // Set isPaid to false for all lessons
          })),
        };
      });

      // Replace the curriculum with the modified version in the course
      course.curriculum = modifiedCurriculum;
    }

    // Check if curriculumData is a valid ObjectId or null
    if (mongoose.Types.ObjectId.isValid(course.curriculum) || course.curriculum === null) {
      // Curriculum data is valid, you can send it as a response
      res.json(course.curriculum);
    } else {
      // Invalid curriculum data, return an error response
      res.status(400).json({ error: 'Invalid curriculum data.' });
    }
  } catch (error) {
    console.error('Error fetching curriculum data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
},


async getCurriculumById(req, res) {
  try {
    const { curriculumId } = req.params;

    const curriculum = await Curriculum.findById(curriculumId);

    if (!curriculum) {
      return res.status(404).json({ error: 'Curriculum not found' });
    }

    // Respond with the original curriculum without any user-specific checks
    res.status(200).json(curriculum);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
  // ... (other controller methods)
};

module.exports = CourseCreationController;
