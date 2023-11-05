
const Category = require('../models/CategoryModel'); // Import the Category model


const categoryController = {
  fetchCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories.' });
    }
  },

  fetchCategoryById: async (req, res) => {
    try {
      const { categoryId } = req.params; // Get categoryId from URL parameters
      const category = await Category.findById(categoryId); // Use findById to find a document by its ID
      if (!category) {
        return res.status(404).json({ error: 'Category not found.' });
      }
      res.json(category);
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: 'Failed to fetch category.' });
    }
  },
  

  createCategory: async (req, res) => {
    try {
      const { categoryData } = req.body;
      const newCategory = new Category(categoryData);
      await newCategory.save();
      res.json(newCategory);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create category.' });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { updatedData } = req.body;
      
      const category = await Category.findByIdAndUpdate(categoryId, updatedData, { new: true });
      if (!category) {
        return res.status(404).json({ error: 'Category not found.' });
      }

      res.json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update category.' });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;

      const category = await Category.findByIdAndDelete(categoryId);
      if (!category) {
        return res.status(404).json({ error: 'Category not found.' });
      }

      res.json({ message: 'Category deleted successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete category.' });
    }
  },
  
};

module.exports = categoryController;