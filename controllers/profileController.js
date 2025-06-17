const User= require ('../models/User');
const path = require('path');
const fs = require('fs');

exports.getProfile = async (req, res)=> {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: {exclude : ['password']}
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};

exports.updateProfile = async (req, res) => {
    try { 
        const {name, phone, birthdate, email } = req.body;
        let profilePicture = req.file? req.file.filename : undefined;

        const updateData= {
            name,phone, birthdate, email
        };

        if(profilePicture) updateData.profilePicture = profilePicture;

        await User.update(updateData, {
            where: {id: req.user.id}
        
        });
        res.json({ message: 'Profil updated' });
    }catch (err) {
        console.log(err) ;
        res.status(500).json({ error: err.message});
    }
};

exports.deleteProfilePicture = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if(!user) {
            return res.status(404).json({ error: 'User not found'});
        }

        if(user.profilePicture) {
            const filePath = path.join(__dirname, '..', 'uploads', user.profilePicture);

            fs.unlink(filePath, (err) =>{
                if (err) console.log('File not found or image not deleted:', err);
            });

            user.profilePicture = null;
            await user.save();

            res.json({ message: 'Image deleted'});
        } else {
            res.json({ message: 'No profile picture to delete' });
        }
    } catch (err) {
        console.log(err) ;
        res.status(500).json({ error: err.message});
    }
};