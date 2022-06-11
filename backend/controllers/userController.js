const asyncHandler = require('express-async-handler');
const { default: axios } = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Conductor = require('../models/Conductor');

// @desc Register a new user
// @route /register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;

  // Validation
  if (!username || !email || !password || !phoneNumber) {
    res
      .status(400)
      .render('error/400', { message: 'Please include all fields' });
  }

  // Find if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).render('error/400', { message: 'User aready exists' });
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
    res.status(201).cookie('token', token, options).redirect('/travel'); //redirect to form
  } else {
    res.status(400).render('error/400', { message: 'Invalid user data' });
  }
});

const registerConductor = asyncHandler(async (req, res) => {
  const { username, email, password, phoneNumber, destinations } = req.body;

  // Validation
  if (!username || !email || !password || !destinations || !phoneNumber) {
    res
      .status(400)
      .render('error/400', { message: 'Please include all fields' });
  }

  // Find if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).render('error/400', { message: 'User aready exists' });
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
    role: 'Conductor',
  });
  const sticker = 'https://img.stipop.io/1526364515008_gg_19.png';

  await Conductor.create({
    user: user._id,
    destinations: destinations.split(','),
    sticker,
  });
  res.status(200).render('/travel');
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

    res.status(200).cookie('token', token, options).redirect('/travel');
  } else {
    res.status(401).render('error/400', { message: 'Invalid credentials' });
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
  registerConductor,
  loginUser,
  getMe,
};
