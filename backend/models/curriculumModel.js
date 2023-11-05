const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  lessonTitle: String,
  lessonDuration: String,
  lessonContent: String,
  lessonMedia: String,
  lessonURL: String,
  isPaid: Boolean, // Add the isPaid field
});

const curriculumSchema = new mongoose.Schema({
  topics: [
    {
      topicName: String,
      topicDescription: String,
      lessons: [lessonSchema], // Use the lesson schema
    },
  ],
});

const Curriculum = mongoose.model('Curriculum', curriculumSchema);

module.exports = Curriculum;
