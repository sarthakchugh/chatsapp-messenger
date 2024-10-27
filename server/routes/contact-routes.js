const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth-middleware');
const {
	searchContacts,
	getContactinList,
	getAllContacts,
} = require('../controllers/contact-controller');

router.post('/search', verifyToken, searchContacts);
router.get('/getList', verifyToken, getContactinList);
router.get('/getAll', verifyToken, getAllContacts);

module.exports = router;
