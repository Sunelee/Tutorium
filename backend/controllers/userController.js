
const User = require('../models/UserModel'); // Import the User model



const userController = {
  // ... (other controller functions)
 

  fetchProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user profile.' });
    }
  },

  updateAccountDetails: async (req, res) => {
    try {
      const userId = req.user.id;
      const updatedAccountDetails = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      Object.assign(user, updatedAccountDetails);
      await user.save();

      res.json({ message: 'Account details updated.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update account details.' });
    }
  },
  
  editUserProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const updatedProfile = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      Object.assign(user, updatedProfile);
      await user.save();

      res.json({ message: 'User profile updated.', updatedUser: user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to edit user profile.' });
    }
  },
 

  fetchUserStatistics: async (req, res) => {
    try {
      const userId = req.user.id;
      // Placeholder logic to fetch user statistics
      const user = await User.findById(userId);
      const statistics = user.statistics;
      res.json({ statistics }); // Respond with the user statistics
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user statistics.' });
    }
  },

  fetchTutor: async (req, res) => {
    try {
      const tutorId = req.params.tutorId;
      const tutor = await User.findById(tutorId);
  
      res.json({ tutor });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tutor details' });
    }
  },
  fetchTutors: async (req, res) => {
    try {
      const tutors = await User.find();
  
      res.json( tutors );
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tutor details' });
    }
  },
  
  // Controller to fetch student details
  fetchStudent: async (req, res) => {
    try {
      const studentId = req.params.studentId;
      const student = await User.findById(studentId);
  
      if (!student || student.role !== 'student') {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Handle student-specific logic here
  
      res.json({ student });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch student details' });
    }
  },


  verifyPassword: async (req, res) => {
    try {
      const { password } = req.query;
  
      const userId = req.user.id;
  
      // Assuming you have a user object from your database query
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      // Compare the user-provided password with the stored hashed password
      const isPasswordVerified = await user.comparePassword(password.trim());
  
      if (isPasswordVerified) {
        return res.status(200).json({ message: 'Password verified successfully' });
      } else {
        return res.status(400).json({ error: 'Password verification failed' });
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      return res.status(500).json({ error: 'Error verifying password' });
    }
  },

 Achievements: async (req, res) => {
    try {
      const userId = req.user.id;
      const { achievements } = req.body;

      // Find the user by userId
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Update the user's achievements
      user.achievements = achievements;

      // Save the updated user
      await user.save();

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to set student achievements.' });
    }
  },

  searchTutors: async (req, res) => {
    try {
      const { searchTerm } = req.query;

      // Define your search criteria using searchTerm
      const searchCriteria = {
        $or: [
          { firstName: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search by first name
          { lastName: { $regex: searchTerm, $options: 'i' } },  // Case-insensitive search by last name
        ],
      };

      // Make an API request to search for tutors using the defined criteria
      const tutors = await User.find(searchCriteria);

      if (tutors) {
        // Return the search results
        return res.json(tutors);
      } else {
        console.error('Failed to fetch tutors');
        return res.status(500).json({ error: 'Failed to fetch tutors' });
      }
    } catch (error) {
      console.error('Search tutors error:', error);
      return res.status(500).json({ error: 'Search tutors error' });
    }
  },

  filterTutors : async (req, res) => {
    try {
      const filterOptions = req.body;
  
      // Define your filter criteria using filterOptions
      const filterCriteria = {};
  
      // Example: Filtering by location
      if (filterOptions.location) {
        filterCriteria.location = filterOptions.location;
      }
  
      // Example: Filtering by availability
      if (filterOptions.availability) {
        filterCriteria.availability = filterOptions.availability;
      }
  
      // Example: Filtering by hourly rate range
      if (filterOptions.minHourlyRate || filterOptions.maxHourlyRate) {
        filterCriteria.hourlyRate = {};
        if (filterOptions.minHourlyRate) {
          filterCriteria.hourlyRate.$gte = filterOptions.minHourlyRate;
        }
        if (filterOptions.maxHourlyRate) {
          filterCriteria.hourlyRate.$lte = filterOptions.maxHourlyRate;
        }
      }
  
      // Example: Filtering by average rating
      if (filterOptions.averageRating > 0) {
        filterCriteria.averageRating = {};
        if (filterOptions.averageRating) {
          filterCriteria.averageRating.$gte = filterOptions.averageRating;
        }

       
      }
  
      // Additional filters based on your requirements
  
      // Make an API request to filter tutors using the defined criteria
      const tutors = await User.find(filterCriteria);
  
      if (tutors) {
        // Return the filtered results with averageRating
        return res.json(tutors);
      } else {
        console.error('Failed to filter tutors');
        return res.status(500).json({ error: 'Failed to filter tutors' });
      }
    } catch (error) {
      console.error('Filter tutors error:', error);
      return res.status(500).json({ error: 'Filter tutors error' });
    }
  },

  addTutor: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        image,
        walletId,
        location,
        availability,
        education,
        skills,
        hourlyRate,
        certifications,
        languagesSpoken,
        teachingSubjects,
        bio,
        phone,
        instagram,
        twitter,
        youtube,
        ratingSum,  // Sum of all ratings received
        averageRating,  // Average rating based on received ratings
        ratingCount,
      } = req.body;
  
      // Create a new tutor instance
      const tutor = new User({
        firstName,
        lastName,
        email,
        password, // Be sure to hash the password before sending it in the request
        image,
        walletId,
        location,
        availability,
        education,
        skills,
        hourlyRate,
        certifications,
        languagesSpoken,
        teachingSubjects,
        bio,
        phone,
        instagram,
        twitter,
        youtube,
        ratingSum,  // Sum of all ratings received
        averageRating,  // Average rating based on received ratings
        ratingCount,
        role: 'tutor', // Set the role to 'tutor' for tutors
      });
  
      // Save the tutor to the database
      await tutor.save();
  
      // Respond with the newly created tutor
      res.status(201).json({ message: 'Tutor added successfully', tutor });
    } catch (error) {
      console.error('Error adding tutor:', error);
      res.status(500).json({ error: 'Failed to add tutor' });
    }
  },
};


module.exports = userController;
