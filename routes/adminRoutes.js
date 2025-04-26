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

// Admin product add route (POST)
router.post('/add-product', isAdmin, async (req, res) => {
  const { name, imageUrl, price, description, category } = req.body;

  if (!name || !imageUrl || !price || !description || !category) {
    try {
      const user = await User.findById(req.session.userId);
      return res.render('admin/add-product', { user: user, error: 'All fields are required!' });
    } catch (error) {
      console.error(error);
      return res.redirect('/login');
    }
  }

  const newProduct = new Product({
    name,
    imageUrl,
    price,
    description,
    category,
  });

  try {
    await newProduct.save();
    res.redirect('/admin/dashboard'); // Redirect to admin dashboard after saving
  } catch (error) {
    console.error(error);
    try {
      const user = await User.findById(req.session.userId);
      return res.render('admin/add-product', { user: user, error: 'Something went wrong. Please try again.' });
    } catch (innerError) {
      console.error(innerError);
      return res.redirect('/login');
    }
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
