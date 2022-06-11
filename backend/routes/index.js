const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Conductor = require('../models/Conductor');

const {
  registerUser,
  registerConductor,
  loginUser,
  getMe,
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// @desc Generate QR Code and Sticker
// @route POST /
// @access Public
router.post('/', async (req, res) => {
  // Get source, destination and username from the body of the POST call
  const { source, dest, user } = req.body;
  // If any parameters are missing, throw an error
  if (!source || !dest || !user) {
    return res.status(400).render('error/400', {
      message:
        'Paramters missing. Make sure the request contains source, dest and user.',
    });
  }
  // Validate if source and destination are different and present in the list of sources and destinations
  const valid = validate(source, dest);
  if (!valid) {
    return res.status(400).render('error/400', {
      message:
        'Input is invalid. Make sure source and destination are different and are a part of the provided list.',
    });
  }
  // Generates a JSON Web Token with the user name and a secret key
  const token = generateToken(user);
  // The cookie created expires in JWT_COOKIE_EXPIRE number of days
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // Get QR code image from GoQR API. Add source, dest, username and the token created above as the data
  const qrcode = `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    JSON.stringify({ source, dest, user, token })
  )}&size=150x150`;
  // const sticker = await generateSticker();
  // If everything is valid send a 200 status with a cookie of the token and information about price and the qr code itself

  const stickerFromDB = await Conductor.findOne({
    destinations: `${source}`,
  }).select('sticker');
  if (!stickerFromDB) {
    return res
      .status(404)
      .render('error/404', { message: 'No conductor found for that route!' });
  }
  // console.log(stickerFromDB.sticker);
  const price = calculatePrice(source, dest);
  res
    .status(200)
    .cookie('token', token, options)
    .render('invoice', { price, user, source, dest });
  // res.status(200).cookie('token', token, options).render('sticker', {
  //   qrcode,
  //   sticker: stickerFromDB.sticker,
  // });
});
router.post('/qr', async (req, res) => {
  // Get source, destination and username from the body of the POST call
  const { source, dest, user } = req.body;
  // If any parameters are missing, throw an error
  if (!source || !dest || !user) {
    return res.status(400).render('error/400', {
      message:
        'Paramters missing. Make sure the request contains source, dest and user.',
    });
  }
  // Validate if source and destination are different and present in the list of sources and destinations
  const valid = validate(source, dest);
  if (!valid) {
    return res.status(400).render('error/400', {
      message:
        'Input is invalid. Make sure source and destination are different and are a part of the provided list.',
    });
  }
  // Generates a JSON Web Token with the user name and a secret key
  const token = generateToken(user);
  // The cookie created expires in JWT_COOKIE_EXPIRE number of days
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // Get QR code image from GoQR API. Add source, dest, username and the token created above as the data
  const qrcode = `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    JSON.stringify({ source, dest, user, token })
  )}&size=150x150`;
  // const sticker = await generateSticker();
  // If everything is valid send a 200 status with a cookie of the token and information about price and the qr code itself

  const stickerFromDB = await Conductor.findOne({
    destinations: `${source}`,
  }).select('sticker');
  if (!stickerFromDB) {
    return res
      .status(404)
      .render('error/404', { message: 'No conductor found for that route!' });
  }
  // console.log(stickerFromDB.sticker);
  const price = calculatePrice(source, dest);
  res.status(200).cookie('token', token, options).render('sticker', {
    qrcode,
    sticker: stickerFromDB.sticker,
  });
});
router.get('/', (req, res) => {
  res.render('travel', { layout: false });
});
router.get('/travel', (req, res) => {
  res.render('travel', { layout: false });
});
router.get('/about', (req, res) => {
  res.render('about', { layout: false });
});
router.get('/sticker', (req, res) => {
  res.render('sticker');
});
router.get('/signup', (req, res) => {
  res.render('signup', { layout: false });
});
router.get('/login', (req, res) => {
  res.render('login', { layout: false });
});
router.post('/register', registerUser);
router.post('/registerConductor', registerConductor);

router.post('/login', loginUser);

router.get('/me', protect, getMe);

const calculatePrice = (source, dest) => {
  const listofDestinations = [
    'Jayanagara 4th Block',
    'Sanjay Gandhi Hospital',
    'Carmel Convent',
    'Pump House',
    'East End Circle',
  ];
  // Calculates price as difference between indexes of source and destination multiplied by Rs. 10
  return Math.abs(
    (listofDestinations.indexOf(dest) - listofDestinations.indexOf(source)) * 10
  );
};

const generateToken = (id) => {
  // Creates JSON Web Token with user id and a secret
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const validate = (source, dest) => {
  const listofDestinations = [
    'Jayanagara 4th Block',
    'Sanjay Gandhi Hospital',
    'Carmel Convent',
    'Pump House',
    'East End Circle',
  ];
  // Must be in list and must not be the same
  if (
    !listofDestinations.includes(source) ||
    !listofDestinations.includes(dest) ||
    source == dest
  ) {
    return false;
  } else {
    return true;
  }
};

const generateSticker = async () => {
  try {
    // Generates sticker from the Stipop API
    const response = await axios.get(
      `https://messenger.stipop.io/v1/search?userId=9937&lang=en&pageNumber=1&limit=10`,
      {
        headers: {
          apikey: process.env.STIPOP_APIKEY,
        },
      }
    );
    const randomnum = Math.floor(Math.random() * 10);
    return response.data.body.stickerList[randomnum].stickerImg;
  } catch (error) {
    console.log(error);
  }
};

module.exports = router;
