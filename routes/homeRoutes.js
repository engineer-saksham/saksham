const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Home page route to display all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('home', { products }); // Ye 'home.ejs' page pe bhejenge products
  } catch (error) {
    console.error(error);
    res.send('Error fetching products');
  }
});

module.exports = router;
