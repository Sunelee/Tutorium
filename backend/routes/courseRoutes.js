const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/CourseController'); // Import your course controller
const authHandler = require('../middleware/authHandler');
const asyncHandler = require('../middleware/asyncHandler');


router.get('/available', CourseController.fetchAvailableCourses);
router.get('/featured', CourseController.fetchFeaturedCourses);
router.get('/popular', CourseController.fetchPopularCourses);
router.get('/new', CourseController.fetchNewCourses);
router.get('/courses/:id', CourseController.fetchCourseByCourseId);
router.post('/courses/:courseId/enroll',  authHandler, asyncHandler(CourseController.enrollInCourse));
router.delete('/courses/:courseId/unenroll',  authHandler, asyncHandler(CourseController.unenrollFromCourse));
router.get('/enrolled',  authHandler, asyncHandler(CourseController.fetchEnrolledCourses));
router.get('/courses/:courseId', CourseController.fetchSingleCourse);
router.get('/topics', CourseController.fetchTopics);
router.get('/courses/:courseId/topics', CourseController.fetchTopicsByCourse);
router.get('/courses/:courseId/content', CourseController.fetchCourseContent);
router.get('/categories/:categoryId/courses', CourseController.fetchCoursesByCategory);
router.post('/filter', CourseController.fetchFilteredResults);




module.exports = router;
