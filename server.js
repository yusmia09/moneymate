const express = require('express');
const cors = require('cors');
require('dotenv').config();
const serverless = require('serverless-http');
const sequelize = require("./config/db");

const User = require("./models/User");

const app = express();

app.use(cors()); // Mengaktifkan CORS
app.use(express.json()); // Menghubungkan Express dengan body-JSON

// Cek koneksi ke database sebelum starting server
sequelize.authenticate()
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error("Unable to connect to db!", err));

// Import routes
const authRoutes = require("./routes/auth");

const walletRoutes = require("./routes/wallet");

const transactionRoutes = require("./routes/transaction");

const profileRoutes = require("./routes/profile");

const statisticRoutes = require("./routes/statistic");


// Menghubungkan routes
app.use('/api/auth', authRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', statisticRoutes);


// Port dari env
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server berjalan di port ${port}`));


// Jika memang Adel deploy di serverless (railway serverless)
module.exports = app;
module.exports.handler = serverless(app);
