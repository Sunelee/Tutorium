const User = require('../models/UserModel');
const CourseModel = require('../models/CourseModel'); // Import your CourseModel
const CurriculumModel = require('../models/curriculumModel'); // Import your CourseModel
const mongoose = require('mongoose');


const CourseController = {
  fetchAvailableCourses: async (req, res) => {
    try {
      const courses = await CourseModel.find();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch available courses.' });
    }
  },

  fetchFeaturedCourses: async (req, res) => {
    try {
      const featuredCourses = await CourseModel.find();

      // Filter out courses that are not featured
      const featuredCoursesFiltered = featuredCourses.filter(course => course.isFeatured);

      res.json(featuredCoursesFiltered);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch featured courses.' });
    }
  },

  fetchPopularCourses: async (req, res) => {
    try {
      const popularCourses = await CourseModel.find();

      // Sort courses by popularity logic
      const sortedCourses = popularCourses.sort((a, b) => b.enrollmentCount - a.enrollmentCount);

      res.json(sortedCourses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch popular courses.' });
    }
  },

  fetchNewCourses: async (req, res) => {
    try {
      const newCourses = await CourseModel.find();

      // Sort courses by creation date logic
      const sortedCourses = newCourses.sort((a, b) => b.createdAt - a.createdAt);

      res.json(sortedCourses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch new courses.' });
    }
  },

 
  fetchEnrolledCourses: async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Find all courses where the enrolledStudents array contains the user's userId
      const enrolledCourses = await CourseModel.find({ enrolledStudents: userId });
  
      // Create an array to store the populated enrolled courses
      const populatedEnrolledCourses = [];
  
      // Populate course details for enrolled courses and set isPaid to false for each enrolled course
      for (const enrolledCourse of enrolledCourses) {
        // Set isPaid to false for the enrolled course
        await CourseModel.findByIdAndUpdate(
          enrolledCourse._id,
          { $set: { isPaid: false } },
          { new: true }
        );
  
        const course = await CourseModel.findById(enrolledCourse._id);
  
        // Modify the curriculum to set isPaid to false for all lessons
        const modifiedCurriculum = await Promise.all(course.curriculum.map(async (topic) => {
          // Check if topic is a Mongoose document
          if (topic instanceof mongoose.Document) {
            // Update lessons within the topic
            const updatedLessons = await Promise.all(topic.lessons.map(async (lesson) => {
              return {
                ...lesson.toObject(),
                isPaid: false, // Set isPaid to false for all lessons
              };
            }));
            // Return the topic with updated lessons
            return {
              ...topic.toObject(),
              lessons: updatedLessons,
            };
          } else {
            // Handle the case where topic is not a Mongoose document
            // You can choose to skip it or handle it differently
            return topic;
          }
        }));
  
        // Replace the curriculum with the modified version in the course
        course.curriculum = modifiedCurriculum;
  
        populatedEnrolledCourses.push({ ...enrolledCourse.toObject(), course });
      }
  
      res.json(populatedEnrolledCourses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch enrolled courses.' });
    }
  },
  
  

enrollInCourse: async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if the user is already enrolled in the course
    const isEnrolled = await CourseModel.exists({ _id: courseId, enrolledStudents: userId });

    if (isEnrolled) {
      return res.status(400).json({ error: 'User is already enrolled in the course.' });
    }

    // Enroll the user in the course
    const course = await CourseModel.findByIdAndUpdate(
      courseId,
      {
        $push: { enrolledStudents: userId },
        $inc: { enrollmentCount: 1 }, // Increment the enrollmentCount by 1
      },
      { new: true } // Get the updated course document
    );

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { enrollmentCount: 1 }, // Increment the enrollmentCount by 1
      },
      { new: true } // Get the updated course document
    );

    if (!user) {
      return res.status(404).json({ error: 'user not found.' });
    }

    

    // Fetch the associated Curriculum document
    const curriculum = await CurriculumModel.findById(course.curriculum);

    if (!curriculum) {
      return res.status(404).json({ error: 'Curriculum not found.' });
    }


    // Save the updated curriculum
    await curriculum.save();


    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to enroll in the course.' });
  }
},

  
  
  unenrollFromCourse: async (req, res) => {
    try {
      const { courseId } = req.params;
      const userId = req.user.id;
  
      // Check if the user is enrolled in the course
      const course = await CourseModel.findById(courseId);
      
      const isEnrolled = course.enrolledStudents.includes(userId);
  
      if (!isEnrolled) {
        return res.status(400).json({ error: 'User is not enrolled in the course.' });
      }
  
      // Remove the user from the enrolledStudents array
      course.enrolledStudents = course.enrolledStudents.filter((studentId) => studentId.toString() !== userId);
  
      // Decrement the enrollmentCount, but ensure it's never less than 0
      if (course.enrollmentCount > 0) {
        course.enrollmentCount--;
      }
  
      // Save the updated course
      await course.save();

      const user = await User.findByIdAndUpdate(
        userId,
        {
          $inc: { enrollmentCount: -1 }, // Increment the enrollmentCount by 1
        },
        { new: true } // Get the updated course document
      );
  
      if (!user) {
        return res.status(404).json({ error: 'user not found.' });
      }
  
      // Decrement coursesEnrolledCount for the user
      
      res.json({ message: 'Unenrolled from the course.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to unenroll from the course.' });
    }
  },
  
  
  fetchSingleCourse: async (req, res) => {
    try {
      const { courseId } = req.params;
      const course = await CourseModel.findById(courseId);
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch the course.' });
    }
  },

  fetchTopics: async (req, res) => {
    try {
      const topics = await CourseModel.find();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch topics.' });
    }
  },

  fetchTopicsByCourse: async (req, res) => {
    try {
      const { courseId } = req.params;
      const course = await CourseModel.findById(courseId);

      if (!course) {
        return res.status(404).json({ error: 'Course not found.' });
      }

      const topics = await CourseModel.findById(courseId);
      res.json(topics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch topics by course.' });
    }
  },

  fetchCourseContent: async (req, res) => {
    try {
      const { courseId, page } = req.params;
      const course = await CourseModel.findById(courseId);

      if (!course) {
        return res.status(404).json({ error: 'Course not found.' });
      }

      const content = await CourseModel.findById(courseId, page);
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch course content.' });
    }
  },
  fetchCoursesByCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
  
      const courses = await CourseModel.find({ category: categoryId });
      
      if (!courses) {
        return res.status(404).json({ error: 'No courses found for the given categoryId' });
      }
  
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch courses by category.' });
    }
  },

// CourseController.js

fetchCourseByCourseId: async (req, res) => {
  try {
    const courseId = req.params.id; // Use req.params.id to access the parameter value
   

    const course = await CourseModel.findOne({ _id: courseId }); // Use _id to match the MongoDB ObjectId

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching the course.' });
  }
},

  
  
  
fetchFilteredResults: async (req, res) => {
  try {
    const filterOptions = req.body;
    // Implement filtering logic based on filterOptions
    const filteredCourses = await CourseModel.find({ ...filterOptions });

    res.json(filteredCourses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch filtered results.' });
  }
},

};

module.exports = CourseController;
