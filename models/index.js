const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const User = require('./User')(sequelize, DataTypes);
const Wallet = require('./Wallet')(sequelize, DataTypes);
const Transaction = require('./Transaction')(sequelize, DataTypes);


User.hasMany(Wallet, { foreignKey: 'userId' });
Wallet.belongsTo(User, { foreignKey: 'userId' });

Wallet.hasMany(Transaction, { foreignKey: 'walletId', as: 'transactions' });
Transaction.belongsTo(Wallet, { foreignKey: 'walletId', as: 'wallet' });

const db = {
  sequelize,
  User,
  Wallet,
  Transaction,
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
