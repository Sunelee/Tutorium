const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost:27017'; // Replace 'your_database_name' with your actual database name

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Course = require('./models/CourseModel'); // Replace 'path/to/your/models' with the actual path to your Course model
const courseData = require('./testData'); // Replace 'path/to/your/testData' with the actual path to your testData.js file

const insertTestData = async () => {
  try {
    await Course.insertMany(courseData);
    console.log('Test data inserted successfully!');
  } catch (error) {
    console.error('Error inserting test data:', error);
  } finally {
    mongoose.connection.close();
  }
};

insertTestData();
