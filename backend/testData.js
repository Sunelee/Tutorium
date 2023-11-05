const faker = require('faker');
const mongoose = require('mongoose');

faker.locale = 'en';
// Generate random course data
const generateCourseData = () => {
  return {
    title: faker.lorem.words(3),
    description: faker.lorem.sentences(3),
    category: new mongoose.Types.ObjectId(), // Generate a new ObjectId for the category
    tutor: new mongoose.Types.ObjectId(), // Generate a new ObjectId for the tutor
    price: faker.random.number({ min: 10, max: 100 }),
    currency: 'USD',
    duration: faker.random.number({ min: 1, max: 30 }),
    level: faker.random.arrayElement(['Beginner', 'Intermediate', 'Advanced']),
    image: faker.image.imageUrl(),
    curriculum: [],
    includes: [faker.random.word(), faker.random.word(), faker.random.word()],
    isPaid: faker.random.boolean(),
    enrollmentCount: faker.random.number({ min: 0, max: 100 }),
    clickCount: faker.random.number({ min: 0, max: 100 }),
    viewCount: faker.random.number({ min: 0, max: 1000 }),
    ratingSum: faker.random.number({ min: 0, max: 500 }),
    ratingCount: faker.random.number({ min: 0, max: 100 }),
    reviews: [],
    createdAt: faker.date.past(),
    isFeatured: faker.random.boolean(),
    totalSoldCourses: faker.random.number({ min: 0, max: 1000 }),
  };
};

const courseData = Array.from({ length: 2 }, () => generateCourseData());

module.exports = courseData;
