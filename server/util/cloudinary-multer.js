const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
	try {
		const result = await cloudinary.uploader.upload(file, {
			resource_type: 'auto',
		});
		return result;
	} catch (err) {
		console.log(err);
	}
}

const upload = multer({ storage });

const fileStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/files');
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname);
	},
});

const multerUploadFile = multer({ storage: fileStorage });

module.exports = { upload, imageUploadUtil, multerUploadFile };
