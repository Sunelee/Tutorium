const Request = require('../models/RequestModel');
const User = require('../models/UserModel');
const {
  NotFoundError,
  InternalServerError,
} = require('../errors/errors');

const requestsController = {
  // Submit a request
  async submitRequest(req, res, next) {
    try {
      // Assuming your authentication middleware sets the user information in req.user
      const userId = req.user.id;
  
      // Create a new request based on your model
      const requestData = {
        user: userId,
        tutor: req.body.tutor, // Assuming you have the tutor ID in the request body
        type: req.body.type,
        message: req.body.message,
        duration: req.body.duration,
        location: req.body.location,
        dateTime: req.body.dateTime,
        agency: req.body.agency,
        urgency: req.body.urgency,
        requirements: req.body.requirements,
      };
  
      const newRequest = await Request.create(requestData);

      // Increment requestsCreatedCount for the user
      await User.findByIdAndUpdate(userId, { $inc: { requestsCreatedCount: 1 } });

      res.status(201).json(newRequest);
    } catch (error) {
      next(new InternalServerError('Internal Server Error'));
    }
  },


  // Update request details
  async updateRequestDetails(req, res, next) {
    try {
      // Your updateRequestDetails controller logic here
      const requestId = req.params.id;
      const updatedData = req.body;
      const updatedRequest = await Request.findByIdAndUpdate(requestId, updatedData, {
        new: true,
      });

      if (!updatedRequest) {
        next(new NotFoundError('Request not found'));
        return;
      }

      res.status(200).json(updatedRequest);
    } catch (error) {
      next(new InternalServerError('Internal Server Error'));
    }
  },

  // Fetch user requests
  async fetchUserRequests(req, res) {
    try {
      // Your fetchUserRequests controller logic here
      const userId = req.user.id;
      const userRequests = await Request.find({ user: userId });
      console.log('Requests',userRequests);

      res.status(200).json(userRequests);
    } catch (error) {
      next(new InternalServerError('Internal Server Error'));
    }
  },
    
    async fetchStudentRequests(req, res) {
      try {
        // Your fetchUserRequests controller logic here
        const userId = req.user.id;
        const userRequests = await Request.find({ user: userId });
        console.log('Requests',userRequests);
  
        res.status(200).json(userRequests);
      } catch (error) {
        next(new InternalServerError('Internal Server Error'));
      }
    },

    async fetchTutorRequests(req, res) {
      try {
        // Your fetchUserRequests controller logic here
        const userId = req.user.id;
        const userRequests = await Request.find({ tutor: userId });
        console.log('Requests',userRequests);
  
        res.status(200).json(userRequests);
      } catch (error) {
        next(new InternalServerError('Internal Server Error'));
      }
    },

  async fetchRequestById (req, res){
    try {
      const requestId = req.params.id; // Use req.params.id to access the parameter value
     
  
      const request = await Request.findOne({ _id: requestId }); // Use _id to match the MongoDB ObjectId
  
      if (!request) {
        return res.status(404).json({ error: 'request not found.' });
      }
  
      res.json(request);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while fetching the request.' });
    }
  },
  

  // Update request status
  async updateRequestStatus(req, res, next) {
    try {
      // Your updateRequestStatus controller logic here
      const { requestId } = req.params;
      const { status } = req.body;
      const updatedRequest = await Request.findByIdAndUpdate(
        requestId,
        { status: status },
        { new: true }
      );

      if (!updatedRequest) {
        next(new NotFoundError('Request not found'));
        return;
      }

      res.status(200).json(updatedRequest);
    } catch (error) {
      next(new InternalServerError('Internal Server Error'));
    }
  },
  

  // Delete request by ID
  async deleteRequestById(req, res, next) {
    try {
      // Your deleteRequestById controller logic here
      const { requestId } = req.params;
      const deletedRequest = await Request.findByIdAndDelete(requestId);

      if (!deletedRequest) {
        next(new NotFoundError('Request not found'));
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(new InternalServerError('Internal Server Error'));
    }
  },

  // Fetch all requests
  async fetchAllRequests(req, res, next) {
    try {
      // Your fetchAllRequests controller logic here
      const allRequests = await Request.find();
      res.status(200).json(allRequests);
    } catch (error) {
      next(new InternalServerError('Internal Server Error'));
    }
  },
  async deleteAllRequests(req, res, next) {
    try {
      // Get the user ID from the authenticated user (assuming it's stored in req.user)
      const userId = req.user._id;

      // Your deleteAllRequests controller logic here
      // Delete requests where the user ID matches the authenticated user
      await Request.deleteMany({
        $or: [{ user: userId }, { tutor: userId }],
      });

      res.status(204).send(); // Send a success response with no content
    } catch (error) {
      next(new InternalServerError('Internal Server Error'));
    }
  },
};

module.exports = requestsController;
