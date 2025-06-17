const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { where } = require("sequelize");

exports.register = async (req, res) => {
    const {name, email, password, username} = req.body;
    try {
        const exist = await User.findOne({ where: { email } });
        if (exist) return res.status(400).json({ message: 'Email already registered' });

        if (!username) return res.status(400).json({ message: 'Username is required' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, username });
        res.status(201).json({ message: 'User created!', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password} = req.body;
    try {
        const user = await User.findOne({where: {email} });
        if (!user) return res.status(400).json({ message: 'Invalid credentials'});

        const valid = await bcrypt.compare(password, user.password);
        if(!valid) return res.status(400).json({ message: 'Invalid credentials'});

        const token = jwt.sign({ id: user.id, email: user.email}, process.env.JWT_SECRET);
        res.status(200).json({ message: 'Login success', token, user});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({message: 'User not found'});

        const valid = await bcrypt.compare(oldPassword, user.password);
        if (!valid) return res.status(400).json({message: 'Old password is incorrect'});

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({message: 'Password updated successfully'});
    } catch (err) {
        res.status(500).json ({error: err.message});
    }
};
