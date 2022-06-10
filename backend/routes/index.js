const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// @desc Generate QR Code and Sticker
// @route POST /
// @access Public
router.post('/', async (req, res) => {
  // Get source, destination and username from the body of the POST call
  const { source, dest, user } = req.body;
  // If any parameters are missing, throw an error
  if (!source || !dest || !user) {
    return res
      .status(400)
      .send(
        'Paramters missing. Make sure the request contains source, dest and user.'
      );
  }
  // Validate if source and destination are different and present in the list of sources and destinations
  const valid = validate(source, dest);
  if (!valid) {
    return res
      .status(400)
      .send(
        'Input is invalid. Make sure source and destination are different and are a part of the provided list.'
      );
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
  )}&size=400x400`;
  const sticker = await generateSticker();
  // If everything is valid send a 200 status with a cookie of the token and information about price and the qr code itself
  res
    .status(200)
    .cookie('token', token, options)
    .send({
      msg: `Source is ${source}, Destination is ${dest} and the username is ${user}`,
      price: `Price is Rs. ${calculatePrice(source, dest)}`,
      qrcode,
      sticker,
    });
});

module.exports = router;

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
