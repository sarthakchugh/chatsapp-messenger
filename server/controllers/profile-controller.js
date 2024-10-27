const User = require('../models/User');
const { Buffer } = require('buffer');
const { imageUploadUtil } = require('../util/cloudinary-multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const updateProfile = async (req, res) => {
	try {
		const userId = req.userId;
		const { firstName, lastName, color } = req.body;
		if (!firstName || !lastName) {
			return res.status(422).json({
				message: 'First Name and Last Name are required.',
			});
		}

		const user = await User.findByIdAndUpdate(
			userId,
			{ firstName, lastName, color, profileSetup: true },
			{ new: true, runValidators: true }
		);

		if (!user) {
			return res.status(404).json({
				message: 'User not found.',
			});
		}

		res.status(200).json({
			message: 'Profile updated successfully!',
			user,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

const updateProfileImage = async (req, res) => {
	try {
		const b64 = Buffer.from(req.file.buffer).toString('base64');
		const url = 'data:' + req.file.mimetype + ';base64,' + b64;
		const result = await imageUploadUtil(url);

		const { userId } = req.body;
		const user = await User.findByIdAndUpdate(
			userId,
			{ image: result?.url },
			{ new: true, runValidators: true }
		);

		if (!user) {
			return res.status(404).json({
				message: 'User not found!',
			});
		}

		res.status(200).json({
			message: 'Profile Image updated successfully!',
			user,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

const deleteProfileImage = async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await User.findByIdAndUpdate(
			userId,
			{ $unset: { image: 1 } },
			{ new: true }
		);
		if (!user) {
			return res.status(404).json({
				message: 'User not found',
			});
		}

		res.status(200).json({
			message: 'Profile Image removed.',
			user,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

// const testCloudinaryUpload = async (req, res) => {
// 	try {
// 		const filePath = path.join(__dirname, 'Lies for MBASM.txt');
// 		const result = await cloudinary.uploader.upload(filePath, {
// 			resource_type: 'auto',
// 		});
// 		console.log(result);
// 		res.status(200).send('File Uploaded');
// 	} catch (err) {
// 		console.log(err);
// 	}
// };

module.exports = {
	updateProfile,
	updateProfileImage,
	deleteProfileImage,
};
