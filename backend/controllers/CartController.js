const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require('../errors/errors');
const CartItem = require('../models/CartItemModel');
const Course = require('../models/CourseModel');

const calculateTotalAmount = (cartTotal) => {
  // Example: Adding a 10% tax to the cart total
  const tax = cartTotal * 0.1;
  return Math.round((cartTotal + tax) * 100); // Stripe requires amount in cents
};


const cartController = {

  async addToCart(req, res, next) {
    try {
      const user = req.user.id;
      const courseId = req.params.courseId;
  
      if (!user) {
        throw new UnauthorizedError('User not authenticated');
      }
  
      // Fetch the course details
      const course = await Course.findById(courseId );
  
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      // Check if the course is already in the user's cart
      const existingCartItem = await CartItem.findOne({
        userId: user,
        itemId: course._id,
    });

    if (existingCartItem) {
        console.log('Course already in cart:', existingCartItem);
        return res.status(400).json({ error: 'Course already in cart' });
    }
      // Create a new cart item
      const cartItem = new CartItem({
        itemId: course._id,
        itemName: course.title,
        itemDescription: course.description,
        quantity: 1, // You can adjust the quantity as needed
        price: course.price,
        userId: user,
      });
      
      await cartItem.save();
  
      res.status(200).json({ message: 'Course added to cart successfully' });
    } catch (error) {
      next(error);
    }
  },


  async removeFromCart (req, res) {
    try {
      const Item = req.params.itemId

      const itemID = await CartItem.findByIdAndDelete(Item);
  
      if (!itemID) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      res.status(200).json(itemID);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateCartItemQuantity(req, res, next) {
    try {
      const user = req.user.id;
      const { courseId, quantity } = req.body;
  
      if (!user) {
        throw new UnauthorizedError('User not authenticated');
      }
  
      // Find and update the cart item's quantity
      const cartItem = await CartItem.findOneAndUpdate(
        { userId: user.id, itemId: courseId },
        { quantity },
        { new: true }
      );
  
      if (!cartItem) {
        return res.status(404).json({ error: 'Course not found in cart' });
      }
  
      res.status(200).json({ message: 'Cart item quantity updated successfully' });
    } catch (error) {
      next(error);
    }
  },
  
  
  async fetchCartContents(req, res, next) {
    try {
      const user = req.user.id; // Use destructuring to get the user ID
      if (!user) {
        throw new UnauthorizedError('User not authenticated');
      }
      const cartItems = await CartItem.find({  userId: user }).populate('itemId');
    
      const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      const cartContents = { items: cartItems, total };
  
      res.status(200).json(cartContents);
    } catch (error) {
      next(error);
    }
  },



 async checkout (req, res, next) {
  try {
    const user = req.user.id;

    const cartState = req.body; // Assuming cart state is sent in the request body
    if (!user) {
      throw new UnauthorizedError('User not authenticated');
    }

    // Calculate the total amount to charge using cartState.total
    const totalAmount = calculateTotalAmount(cartState.total);

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd', // Change to your desired currency
      description: 'Course purchase',
    });

    // Perform other necessary steps like updating user account info, sending emails, etc.
    // ...

    // Clear user's cart after successful checkout
    await CartItem.deleteMany({ userId: user.id });

    res.status(200).json({ message: 'Checkout successful', clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
},

 async applyCoupon (req, res, next) {
  try {
    const user = req.user.id;

    const { couponCode } = req.body;

    if (!user) {
      throw new UnauthorizedError('User not authenticated');
    }

    // Fetch cart items based on the user
    const cartItems = await CartItem.find({ userId: user.id });

    // Calculate the total price of cart items
    const totalCartPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // Simulate fetching the coupon details from a database (example: fixed discount)
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      throw new NotFoundError('Coupon not found');
    }

    // Apply the coupon discount
    const discountedTotal = totalCartPrice - coupon.discountAmount;

    // Update the cart state with the discounted total
    const updatedCart = {
      items: cartItems,
      total: discountedTotal,
    };

    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
},


async markAllCartItems (req, res, next) {
  try {

    const user = req.user.id;
    // Fetch cart items
    const cartItems = await CartItem.find({ userId: user });


    // Mark all cart items
    cartItems.forEach(item => {
      item.marked = true;
    });

    // Save the updated cart items
    await Promise.all(cartItems.map(item => item.save()));

    res.status(200).json({ message: 'All cart items marked' });
  } catch (error) {
    next(error);
  }
},

async unmarkAllCartItems(req, res, next) {
  try {
    const user = req.user.id; // Assuming you have user information available in req

    
    // Fetch cart items based on the user
    const cartItems = await CartItem.find({ userId: user });

    // Unmark all cart items
    cartItems.forEach((item) => {
      item.marked = false;
    });

    // Save the updated cart items
    await Promise.all(cartItems.map((item) => item.save()));

    res.status(200).json({ message: 'All cart items unmarked' });
  } catch (error) {
    next(error);
  }
},


async clearMarkedCartItems(req, res, next) {
  try {
    const user = req.user.id;

    if (!user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const cartItems = await CartItem.find({ userId: user });

    cartItems.forEach(item => {
      if (item.marked === true) { // Use triple equals for comparison
        item.remove();
      }else{
        console.log('No marked items');
      }
      // You can remove the else block if you don't need it
    });

    // Save the updated cart items
    await Promise.all(cartItems.map(item => item.save()));

    res.status(200).json({ message: 'Marked cart items cleared' });
  } catch (error) {
    next(error);
  }
},


 async markCartItem (req, res, next) {
  try {
 
    const item = req.params.itemId;
    console.log('item:', item);

    // Fetch the specific cart item by courseId
    const cartItem = await CartItem.findById(item);
    console.log('cartItem:', cartItem);

    if (!cartItem) {
      throw new NotFoundError('Cart item not found');
    }

    // Mark the cart item
    cartItem.marked = true;
    await cartItem.save();

    res.status(200).json({ message: `Cart item ${item} marked` });
  } catch (error) {
    next(error);
  }
},
 async unmarkCartItem (req, res, next) {
  try {
    const itemId = req.params.itemId;

    // Find the cart item by itemId
    const cartItem = await CartItem.findById(itemId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Unmark the cart item
    cartItem.marked = false;

    // Save the updated cart item
    await cartItem.save();

    res.status(200).json({ message: 'Cart item unmarked', cartItem });
  } catch (error) {
    next(error);
  }
},
};

module.exports = cartController;
