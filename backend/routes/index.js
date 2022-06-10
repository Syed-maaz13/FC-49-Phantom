const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { source, dest, user } = req.body;
  if (!source || !dest || !user) {
    return res
      .status(400)
      .send(
        'Paramters missing. Make sure the request contains source, dest and user.'
      );
  }

  const qrcode = `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    JSON.stringify({ source, dest, user })
  )}&size=100x100`;
  res.status(200).send({
    msg: `Source is ${source}, Destination is ${dest} and the username is ${user}`,
    price: `Price is Rs. ${calculatePrice(source, dest)}`,
    qrcode,
  });
});

module.exports = router;

const calculatePrice = (source, dest) => {
  listofDestinations = [
    'Jayanagara 4th Block',
    'Sanjay Gandhi Hospital',
    'Carmel Convent',
    'Pump House',
    'East End Circle',
  ];
  if (
    !listofDestinations.includes(source) ||
    !listofDestinations.includes(dest)
  ) {
    return 'Error, locations are invalid.';
  }
  return Math.abs(
    (listofDestinations.indexOf(dest) - listofDestinations.indexOf(source)) * 10
  );
};
