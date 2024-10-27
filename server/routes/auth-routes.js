const express = require('express');
const {
	signup,
	login,
	getUserInfo,
	logout,
} = require('../controllers/auth-controller');
const { verifyToken } = require('../middlewares/auth-middleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/userInfo', verifyToken, getUserInfo);

module.exports = router;
