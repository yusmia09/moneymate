const express = require('express');
const router = express.Router();
const profileController = require ('../controllers/profileController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { getProfile, changePassword } = require('../controllers/authController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) =>{
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});
const upload = multer({storage});
router.get('/', auth, profileController.getProfile);
router.put('/', auth, upload.single('profilePicture'), profileController.updateProfile);
router.delete('/photo', auth, profileController.deleteProfilePicture);
router.get('/profile', auth, getProfile);
router.put('/change-password', auth, changePassword);

module.exports = router;
