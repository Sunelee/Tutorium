const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  itemName: { // Adding a field to store the course title/name
    type: String,
    required: true,
  },
  itemDescription: { // Adding a field to store the course title/name
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  marked: {
    type: Boolean,
    default: false, // Initially, items are not marked
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CartItemModel = mongoose.model('CartItem', CartItemSchema);

module.exports = CartItemModel;
