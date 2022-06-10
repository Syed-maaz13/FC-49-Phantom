const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
app.use(
  cors({
    origin: 'http://127.0.0.1:5500',
  })
);

// Load config
dotenv.config({ path: './config/config.env' });

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`)
);
