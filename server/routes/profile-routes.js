const express = require('express');
const {
	updateProfile,
	updateProfileImage,
	deleteProfileImage,
} = require('../controllers/profile-controller');
const { verifyToken } = require('../middlewares/auth-middleware');
const { upload } = require('../util/cloudinary-multer');
const router = express.Router();

router.post('/update', verifyToken, updateProfile);
router.post(
	'/update/profile-image',
	verifyToken,
	upload.single('profile-image'),
	updateProfileImage
);

router.delete('/delete/profile-image/:userId', deleteProfileImage);

module.exports = router;
