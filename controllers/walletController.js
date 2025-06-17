const Wallet = require('../models/Wallet');

exports.getWallets = async (req, res) => {
    try {
        const wallets = await Wallet.findAll({ where: { userId: req.query.userId } });
        res.status(200).json(wallets);
    } catch (err){
        res.status(500).json({ error: err.message });
    }
};

exports.createWallet = async (req, res) => {
    const {name, balance, userId } = req.body;
    try {
        const wallet = await Wallet.create({name, balance, userId});
        res.status(201).json(wallet);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

exports.updateWallet = async (req, res) => {
    const { name, balance } = req.body;
    const { id } = req.params;
    try{
        const wallet = await Wallet.findByPk(id);
        if(!wallet) return res.status(404).json({message : 'Wallet not found'});
        
        wallet.name = name || wallet.name;
        wallet.balance = balance ?? wallet.balance;
        await wallet.save();

        res.status(200).json(wallet);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.deleteWallet = async (req, res) => {
    const { id } = req.params;
    try {
        const wallet = await Wallet.findByPk(id);
        if (!wallet) return res.status(404).json({ message: 'Wallet not found'});

        await wallet.destroy();
        res.status(200).json({ message: 'Wallet deleted'});
    }catch (err) {
        res.status(500).json({ message: err.message});
    }
};