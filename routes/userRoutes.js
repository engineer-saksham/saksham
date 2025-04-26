// routes/userRoutes.js

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Capital 'U' for model
const router = express.Router();

// Home Route
router.get('/', (req, res) => {
  const loggedIn = !!req.session.username;
  const user = { username: req.session.username || '' };
  res.render('home', { loggedIn, user });
});

// Signup Page (GET)
router.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

// Signup Form (POST)
router.post('/signup', async (req, res) => {
  const { username, email, password, confirmPassword, role } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.render('signup', { error: 'All fields are required!' });
  }

  if (password !== confirmPassword) {
    return res.render('signup', { error: 'Passwords do not match.' });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.render('signup', { error: 'Email already registered.' });
    }

    // **Direct save karo bina manually hash kiye**
    const newUser = new User({
      username,
      email,
      password,  // plain password -- model me pre-save hook hash karega
      role: role || 'user',
    });

    await newUser.save();

    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('signup', { error: 'Error during signup. Try again.' });
  }
});

// Login Page (GET)
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Login Form (POST)
// Login form submit route (POST)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('login', { error: 'Please provide both username and password.' });
  }

  try {
    const user = await User.findOne({ username: username }); // find user by username

    if (!user) {
      return res.render('login', { error: 'Invalid credentials (User not found)' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render('login', { error: 'Invalid credentials (Password mismatch)' });
    }

    // Login successful
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.role = user.role;

    if (user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    } else {
      return res.redirect('/');
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.render('login', { error: 'Something went wrong. Please try again.' });
  }
});


// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.send('Error during logout.');
    }
    res.redirect('/');
  });
});

module.exports = router;
