const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');


const Wallet = sequelize.define('Wallet', {
    name: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
    balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },

});

Wallet.belongsTo(User, {foreignKey: 'userId'});
User.hasMany(Wallet, {foreignKey: 'userId'});


module.exports = Wallet;
