const express = require('express');
const connectDB = require('./backendConfig/db');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
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

// Routes
app.use('/', require('./routes/index'));

const PORT = process.env.PORT;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`)
);
