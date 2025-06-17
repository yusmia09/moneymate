const express = require('express');
const cors = require('cors');
require('dotenv').config();
const serverless = require('serverless-http');
const sequelize = require("./config/db");

const User = require("./models/User");

const app = express();

app.use(cors()); 
app.use(express.json());


sequelize.authenticate()
  .then(() => console.log("Database connected!"))
  .then(() => {
    
    return sequelize.sync();
  })
  .then(() => console.log("Table siap!"))
  .catch((err) => console.error("Unable to connect to db!", err));



const authRoutes = require("./routes/auth");

const walletRoutes = require("./routes/wallet");

const transactionRoutes = require("./routes/transaction");

const profileRoutes = require("./routes/profile");

const statisticRoutes = require("./routes/statistic");



app.use('/api/auth', authRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', statisticRoutes);



const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server berjalan di port ${port}`));



module.exports = app;
module.exports.handler = serverless(app);