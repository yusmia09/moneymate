const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    walletId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name:{
       type: DataTypes.STRING,
       allowNull: false, 
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull:false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
});

// 💡 Tambahkan fungsi associate untuk relasi
Transaction.associate = (models) => {
    Transaction.belongsTo(models.Wallet, {
        foreignKey: 'walletId',
        as: 'wallet',
    });
};

module.exports = Transaction;
