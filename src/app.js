const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middlewares/error');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (to be added)
app.use('/auth', require('./routes/authRoutes'));
app.use('/vendors', require('./routes/vendorRoutes'));
app.use('/payouts', require('./routes/payoutRoutes'));

// Error Handler
app.use(errorHandler);

module.exports = app;
