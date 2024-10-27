const Message = require('../models/Message');
const fs = require('fs');

const getAllMessages = async (req, res) => {
	try {
		const user1 = req.userId;
		const { user2 } = req.body;
		if (!user1 || !user2) {
			return res.status(422).send({
				message: "Failed to fetch messages as UserId's are missing",
			});
		}

		const messages = await Message.find({
			$or: [
				{ sender: user1, recipient: user2 },
				{ sender: user2, recipient: user1 },
			],
		}).sort({ timestamp: 1 });

		res.status(200).json({
			messages,
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

const uploadFile = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(422).json({
				message: 'File is required.',
			});
		}
		const date = Date.now();
		let fileDir = `uploads/files/${date}`;
		let fileName = `${fileDir}/${req.file.originalname}`;

		fs.mkdirSync(fileDir, { recursive: true });
		fs.renameSync(req.file.path, fileName);

		// todo : Upload file to Cloudinary
		// const options = {
		// 	use_filename: true,
		// 	unique_filename: false,
		// 	overwrite: true,
		// 	resource_type: 'raw',
		// };

		// const result = await cloudinary.uploader.upload(fileName, options);
		// console.log(result);
		// const downloadableUrl = cloudinary.url(result.public_id, {
		// 	resource_type: result.resource_type,
		// 	flags: 'attachment',
		// 	format: result.format,
		// });

		return res.status(200).json({
			filePath: fileName,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

module.exports = { getAllMessages, uploadFile };
