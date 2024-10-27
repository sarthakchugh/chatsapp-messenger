const mongoose = require('mongoose');
const User = require('../models/User');
const Message = require('../models/Message');

const searchContacts = async (req, res) => {
	try {
		const { searchTerm } = req.body;
		if (!searchTerm) {
			return res.status(422).json({
				message: 'Search Term is required',
			});
		}

		const sanitizedSearchTerm = searchTerm.replace(
			/[.+*?^${}()|[\]\\]/g,
			'\\$&'
		);

		const regex = new RegExp(sanitizedSearchTerm, 'i');
		const contacts = await User.find({
			$and: [
				{ _id: { $ne: req.userId } },
				{ $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
			],
		});

		return res.status(200).json({
			contacts,
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

const getContactinList = async (req, res) => {
	try {
		let userId = req.userId;
		userId = new mongoose.Types.ObjectId(userId);

		const contacts = await Message.aggregate([
			{
				$match: {
					$or: [{ sender: userId }, { recipient: userId }], // match the userId with sender or recipient
				},
			},
			{
				$sort: { timestamp: -1 }, // sort based on timestamp for newer messages on top
			},
			{
				$group: {
					_id: {
						$cond: {
							if: { $eq: ['$sender', userId] }, // If userId = sender, then _id = recipient
							then: '$recipient', // If userId = recipient, then _id = sender
							else: '$sender',
						},
					},
					lastMessageTime: { $first: '$timeStamp' },
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: '_id',
					foreignField: '_id',
					as: 'contactInfo',
				},
			},
			{
				$unwind: '$contactInfo',
			},
			{
				$project: {
					_id: 1,
					lastMessageTime: 1,
					email: '$contactInfo.email',
					firstName: '$contactInfo.firstName',
					lastName: '$contactInfo.lastName',
					color: '$contactInfo.color',
					image: '$contactInfo.image',
				},
			},
			{
				$sort: { lastMessageTime: -1 },
			},
		]);

		return res.status(200).json({
			contacts,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

const getAllContacts = async (req, res) => {
	try {
		const users = await User.find(
			{
				_id: { $ne: req.userId },
			},
			'firstName lastName image _id email'
		);

		const contacts = users.map((user) => ({
			label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
			value: user._id,
		}));

		return res.status(200).json({
			contacts,
		});
	} catch (err) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

module.exports = { searchContacts, getContactinList, getAllContacts };
