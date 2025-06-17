const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced with models');
}).catch(err => console.log('DB error', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const walletRoutes = require('./routes/wallet');
app.use('/api/wallets',walletRoutes);

const transactionRoutes = require('./routes/transaction');
app.use('/api/transactions', transactionRoutes);

const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

const statisticRoutes = require('./routes/statistic');
app.use('/api', statisticRoutes);