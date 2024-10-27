const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth-middleware');
const {
	createChannel,
	getChannels,
	getChannelMessages,
} = require('../controllers/channel-controllers');

router.post('/create', verifyToken, createChannel);
router.get('/', verifyToken, getChannels);
router.get('/:channelId/messages', verifyToken, getChannelMessages);

module.exports = router;
