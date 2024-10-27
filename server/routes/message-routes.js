const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth-middleware');
const {
	getAllMessages,
	uploadFile,
} = require('../controllers/messages-controller');
const { multerUploadFile } = require('../util/cloudinary-multer');

router.post('/', verifyToken, getAllMessages);
router.post('/upload', multerUploadFile.single('file'), uploadFile);

module.exports = router;
