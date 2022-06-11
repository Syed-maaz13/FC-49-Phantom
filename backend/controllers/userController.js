const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc Register a new user
// @route /register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;

  // Validation
  if (!username || !email || !password) {
    res.status(400);
    throw new Error('Please include all fields');
  }

  // Find if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    phoneNumber,
  });

  if (user) {
    const token = generateToken(user._id);
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }

    req.user = user;
    res.status(201).cookie('token', token, options).redirect('/dashboard');
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc Login an existing user
// @route /login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  // Check user and passwords match
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id);
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    res.status(200).cookie('token', token, options).redirect('/dashboard');
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc Get current user
// @route /users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
  };
  res.status(200).json(user);
});

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
