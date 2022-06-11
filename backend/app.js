const path = require('path');
const express = require('express');
const { default: axios } = require('axios');
const connectDB = require('./backendConfig/db');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars').engine;
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const CronJob = require('cron').CronJob;
app.use(
  cors({
    origin: 'http://127.0.0.1:5500',
  })
);

// Load config
dotenv.config({ path: '../config/config.env' });

// Connect to MongoDB
connectDB();

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Handlebars Helpers
// const { imageSource } = require('../helpers/hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

//Handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');

// Routes
app.use('/', require('./routes/index'));

const Conductor = require('./models/Conductor');

const job = new CronJob('0 0 */1 * * *', async () => {
  const response = await axios.get(
    `https://messenger.stipop.io/v1/search?userId=9937&lang=en&pageNumber=1&limit=10`,
    {
      headers: {
        apikey: process.env.STIPOP_APIKEY,
      },
    }
  );
  const randomnumbers = [];
  while (arr.length < 3) {
    const r = Math.floor(Math.random() * 10) + 1;
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  const stickers = [
    response.data.body.stickerList[randomnumbers[0]].stickerImg,
    response.data.body.stickerList[randomnumbers[1]].stickerImg,
    response.data.body.stickerList[randomnumbers[2]].stickerImg,
  ];
  await Conductor.findOneAndUpdate(
    { _id: '62a3efe6668ff4d8916aa92b' },
    { sticker: stickers[0] }
  );
  await Conductor.findOneAndUpdate(
    { _id: '62a3f029c6acdfa7c6b4148a' },
    { sticker: stickers[1] }
  );
  await Conductor.findOneAndUpdate(
    { _id: '62a3f053adc8d3c8d17c1d71' },
    { sticker: stickers[2] }
  );
});
job.start();

const PORT = process.env.PORT;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`)
);
