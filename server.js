const express = require('express');
const cors = require('cors');
require('dotenv').config();
const serverless = require('serverless-http');
const sequelize = require('./config/db');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());


const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const walletRoutes = require('./routes/wallet');
app.use('/api/wallets',walletRoutes);

const transactionRoutes = require('./routes/transaction');
app.use('/api/transactions', transactionRoutes);

const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

const statisticRoutes = require('./routes/statistic');
app.use('/api', statisticRoutes);

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced with models');

        // Nyalakan server di port yang Adel inginkan
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`Server berjalan di http://localhost:${port}`);
        });
    })
    .catch(err => console.log('DB error!', err));

module.exports = app;
module.exports.handler = serverless(app);