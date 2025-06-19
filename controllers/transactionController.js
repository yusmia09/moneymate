const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');

function sanitizeAmount(input) {
    const clean = parseFloat(String(input).replace(/,/g, '').trim());
    if (isNaN(clean)) throw new Error('Invalid amount format');
    return clean;
}
exports.createTransaction = async (req, res) => {
    try {
        console.log("req.body:", req.body);
        const { walletId, name, amount, type, category, date } = req.body;

        const wallet = await Wallet.findByPk(walletId);
        if(!wallet) return res.status(404).json({ message: 'Wallet not found'});

        const cleanAmount = sanitizeAmount(amount);
        wallet.balance = Number(wallet.balance);

        const transaction = await Transaction.create({walletId, name, amount: cleanAmount, type, category, date});

        if (type === 'income') {
            wallet.balance += cleanAmount;
        } else if (type === 'expense') {
            wallet.balance -= cleanAmount; 
        }
        
        await wallet.save();
        res.status(201).json(transaction);
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTransactionsByWallet = async (req, res) => {
    try {
        const {walletId} = req.params;
        const transaction = await Transaction.findAll({
            where: {walletId},
            order: [["date", 'DESC']],
        });
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};

exports.getTransactionsByUser = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        const transactions = await Transaction.findAll({
            include: [{
                model: Wallet,
                where: { userId }, 
                attributes: [] 
            }],
            order: [["date", 'DESC']]
        });

        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateTransaction = async (req, res ) => {
    try {
        const id = req.params.id;
        const {amount, type, name, category, date} = req.body;

        const transaction = await Transaction.findByPk(id);
        if(!transaction) return res.status(404).json({message: 'Transaction not found'});

        const wallet = await Wallet.findByPk(transaction.walletId);
        if (!wallet) return res.status(404).json({ message: 'Wallet not found'});

        const cleanOldAmount = sanitizeAmount(transaction.amount);
        const cleanNewAmount = sanitizeAmount(amount);
        wallet.balance = Number(wallet.balance);

        if (transaction.type === 'income') {
            wallet.balance -= cleanOldAmount;
        } else if (transaction.type === 'expense') {
            wallet.balance += cleanOldAmount; 
        }

        transaction.name = name;
        transaction.amount = cleanNewAmount;
        transaction.type = type;
        transaction.category= category;
        transaction.date = date;

        if (type === 'income') {
            wallet.balance += cleanNewAmount;
        } else if (type === 'expense') {
            wallet.balance -= cleanNewAmount; 
        }

        await wallet.save();
        await transaction.update({amount:cleanNewAmount, type, name, category, date});

        res.json({message: 'Transaction updated', transaction})
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};

exports.deleteTransaction = async ( req, res ) => {
    try {
        const id = req.params.id;
        const transaction = await Transaction.findByPk(id);
        if(!transaction) return res.status(404).json({message: 'Transaction not found'});

        const wallet = await Wallet.findByPk(transaction.walletId);
        if (!wallet) return res.status(404).json({ message: 'Wallet not found'});

        const cleanAmount = sanitizeAmount(transaction.amount);

        if (transaction.type === 'income') {
            wallet.balance -= cleanAmount;
        } else if (transaction.type === 'expense') {
            wallet.balance += cleanAmount; 
        }

        await wallet.save();
        await transaction.destroy();

        res.json({message: 'Transaction deleted'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};