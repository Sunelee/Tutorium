const express = require('express');
const categoryController = require('../controllers/CategoryController'); // Import your category controller

const router = express.Router();

// Fetch categories
router.get('/categories', categoryController.fetchCategories);

// Create a new category
router.post('/categories', categoryController.createCategory);

// Update a category
router.patch('/categories/:categoryId', categoryController.updateCategory);

router.get('/category/:categoryId', categoryController.fetchCategoryById);

// Delete a category
router.delete('/categories/:categoryId', categoryController.deleteCategory);


module.exports = router;
