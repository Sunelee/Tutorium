const express = require('express');
const CourseCreationController = require('../controllers/CourseCreationController');
const authHandler = require('../middleware/authHandler');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();


router.post('/create', CourseCreationController.createCourse);
// Route for fetching created courses by a user
router.get('/coursescreated', authHandler, asyncHandler(CourseCreationController.fetchCreatedCourses));

router.put('/courses/:id', CourseCreationController.editCourse);

// Route for deleting a course
router.delete('/courses/:id',  authHandler, asyncHandler(CourseCreationController.deleteCourse));

router.get('/courses/:courseId/curriculum', authHandler, asyncHandler(CourseCreationController.getCurriculumByCourseId));

router.get('/curriculum/:curriculumId', authHandler, asyncHandler(CourseCreationController.getCurriculumById));

module.exports = router;
