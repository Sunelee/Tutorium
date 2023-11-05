const express = require('express');
const router = express.Router();
const requestsController = require('../controllers/RequestController');
const authHandler = require('../middleware/authHandler');
const asyncHandler = require('../middleware/asyncHandler');


// Routes
router.post('/requests', authHandler, asyncHandler(requestsController.submitRequest));
router.put('/requests:requestId',  authHandler, asyncHandler(requestsController.updateRequestDetails));
router.get('/requests',  authHandler, asyncHandler(requestsController.fetchUserRequests));
router.get('/student-requests',  authHandler, asyncHandler(requestsController.fetchStudentRequests));
router.get('/tutor-requests',  authHandler, asyncHandler(requestsController.fetchTutorRequests));
router.get('/requests/:id', requestsController.fetchRequestById);
router.put('/requests/:requestId/status',  requestsController.updateRequestStatus);
router.delete('/requests/:requestId', requestsController.deleteRequestById);
router.get('/allrequests',  requestsController.fetchAllRequests);
router.delete('/requests', authHandler, asyncHandler(requestsController.deleteAllRequests));

module.exports = router;
