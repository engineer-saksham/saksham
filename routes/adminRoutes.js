const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User'); // Dhyan se - U capital hona chahiye import me

const router = express.Router();

// Admin middleware (to check if user is an admin)
const isAdmin = (req, res, next) => {
  if (req.session.role === 'admin') {
    return next();
  }
  return res.redirect('/login');
};

// Admin product add route (GET)
router.get('/add-product', isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render('admin/add-product', { user: user, error: null });
  } catch (error) {
    console.error(error);
    res.redirect('/login');
  }
});

router.post('/add-product', isAdmin, async (req, res) => {
  const { name, imageUrl, price, description, category } = req.body;

  try {
    if (!name || !imageUrl || !price || !description || !category) {
      const user = await User.findById(req.session.userId);
      return res.render('admin/add-product', { user, error: 'All fields are required!' });
    }

    // ✅ Find the highest productId
    const lastProduct = await Product.findOne().sort({ productId: -1 });
    const nextProductId = lastProduct ? lastProduct.productId + 1 : 1;

    // ✅ Create new product
    const newProduct = new Product({
      productId: nextProductId,
      name,
      imageUrl,
      price,
      description,
      category
    });

    await newProduct.save();
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    const user = await User.findById(req.session.userId);
    return res.render('admin/add-product', { user, error: 'Something went wrong. Please try again.' });
  }
});

// Admin dashboard route to view all products
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const products = await Product.find();
    res.render('admin/dashboard', { user: user, products: products });
  } catch (error) {
    console.error(error);
    res.redirect('/login');
  }
});

// Admin logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.send('Error logging out.');
    }
    res.redirect('/'); // Redirect to homepage after logout
  });
});

module.exports = router;
