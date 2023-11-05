const mongoose = require('mongoose');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const availabilityEnum = ['Full-Time', 'Part-Time', 'Flexible'];


const UserSchema = new mongoose.Schema({
  tutorId: {
    type: String,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (email) {
        // Custom email validation logic if needed
        // You can use regular expressions or other validation libraries here
        return /\S+@\S+\.\S+/.test(email);
      },
      message: 'Invalid email format',
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'tutor'],
    default: 'student',
  },
  image: {
    type: String,
    
  },

  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet', // Reference to the Wallet model
  },
  achievements: [
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      dateEarned: {
        type: Date,
        required: true,
      },
    },
  ],
  numLogins: {
    type: Number,
    default: 0,
  },
  requestsCreatedCount: {
    type: Number,
    default: 0,
  },
  coursesEnrolledCount: {
    type: Number,
    default: 0,
  },

  settings: [
    {
      type: mongoose.Schema.Types.Mixed,
      ref: 'Settings',
    },
  ],
  

  resetPasswordToken: {
    type: String,
  },
  resetPasswordTokenExpiry: {
    type: Date,
  }, 

 
  location: {
    type: String,
  },
  availability: {
    type: String,
    enum: availabilityEnum, // Use the enum values as allowed options
  },

  education: {
    type: String, // You can customize this field based on your requirements
  },
  skills: [
    {
      type: String,
    },
  ],

  hourlyRate: {
    type: Number,
  },

  certifications: [
    {
      name: {
        type: String, // e.g., 'TEFL Certification'
      },
      issuer: {
        type: String, // e.g., 'TEFL Institute'
      },
      year: {
        type: Number, // e.g., 2022
      },
    },
  ],
  languagesSpoken: [
    {
      type: String, // e.g., 'English', 'Spanish', etc.
    },
  ],
  teachingSubjects: [
    {
      type: String,
    },
  ],

  bio: {
    type: String,
    required: function () {
      return this.role === 'tutor';
    },
  },
  
  phone: {
    type: String,
  },
  instagram: {
    type: String,
  },
  twitter: {
    type: String,
  },
  youtube: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  rating: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rating',
    },
  ],

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
  coursesCreated: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],
  lessonCreated: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
  ],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  enrollmentCount: {
    type: Number,
    default: 0,
  },
  totalSoldCourses: {
    type: Number,
    required: function () {
      return this.role === 'tutor';
    },
    default: 0,
  },
  isVerified: {
    type: Boolean,
    required: function () {
      return this.role === 'tutor';
    },
    default: false,
  },
  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  
});

// Method to generate a JWT for the user
UserSchema.methods.createJWT = function () {
  const token = jwt.sign(
    {
      userId: this._id,
      name: `${this.firstName} ${this.lastName}`,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  return token;
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (error) {
    throw error;
  }
};

UserSchema.pre('save', async function (next) {
  try {
    // Check if password is modified before hashing
    if (!this.isModified('password')) return next();

    // Hash the password using argon2
    this.password = await argon2.hash(this.password);
    next();
  } catch (error) {
    return next(error);
  }
});




module.exports = mongoose.model('User', UserSchema)
