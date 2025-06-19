const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const User = require('./User')(sequelize, DataTypes);
const Wallet = require('./Wallet')(sequelize, DataTypes);
const Transaction = require('./Transaction')(sequelize, DataTypes);


User.hasMany(Wallet, { foreignKey: 'userId' });
Wallet.belongsTo(User, { foreignKey: 'userId' });

Wallet.hasMany(Transaction, { foreignKey: 'walletId', as: 'transactions' });
Transaction.belongsTo(Wallet, { foreignKey: 'walletId', as: 'wallet' });

module.exports = {
  sequelize,
  User,
  Wallet,
  Transaction
};
