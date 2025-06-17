const User = require('./User');
const Wallet = require('./Wallet');
const Transaction = require('./Transaction');


User.hasMany(Wallet, { foreignKey: 'userId' });
Wallet.belongsTo(User, { foreignKey: 'userId' });


Wallet.hasMany(Transaction, { foreignKey: 'walletId', as: 'transactions' });
Transaction.belongsTo(Wallet, { foreignKey: 'walletId', as: 'wallet' });

module.exports = { User, Wallet, Transaction };
