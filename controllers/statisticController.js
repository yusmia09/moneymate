const {Op} = require('sequelize');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');

function formatLabel(date, range){
    const d = new Date(date);
    switch (range) {
        case 'weekly' :
            return d.toLocaleDateString('en-US', {weekday: 'short'});
        case 'monthly' :
            return d.toLocaleDateString('en-US', {month: 'short'});
        case 'yearly' :
            return d.getFullYear().toString();
        
        default:
        return '';
    }
}

function generateStats(transaction, range){
    const stats = {};
    transaction.forEach((tx) => {
        const label = formatLabel(tx.date, range);
        if(!stats[label]){
            stats[label] = {income: 0, expense: 0};
        }
        if (tx.type === 'income'){
            stats[label].income += parseFloat(tx.amount);
        } else if (tx.type === 'expense'){
            stats[label].expense += parseFloat(tx.amount);
        }
    });

    return Object.entries(stats).map(([label, value]) => ({
        label,
        ...value,
    }))
    
}

exports.getStatistics = async (req, res ) => {
    try {
        const {walletId} = req.params;
        const range = req.query.range || 'weekly';

        const wallet = await Wallet.findByPk(walletId);
        if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

        const validRanges = ['weekly', 'monthly', 'yearly', 'all'];
        if (!validRanges.includes(range)) {
           return res.status(400).json({ message: 'Invalid range parameter' });
        }

        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        const dateRanges = {
            weekly : startOfWeek,
            monthly: startOfMonth,
            yearly: startOfYear,
        };

        const where = {
            walletId, 
            date: { [Op.gte]: dateRanges[range] || startOfWeek},
        };
        const transaction = await Transaction.findAll({where});

        if (range === 'all') {
            return res.json ({
                weekly: generateStats(transaction, 'weekly'),
                monthly : generateStats(transaction, 'monthly'),
                yearly: generateStats(transaction, 'yearly'),
            });
        }
        const data = generateStats(transaction, range);
        return res.json({ range, data});
    } catch (err){
        return res.status(500).json({error: err.message});
    }
}