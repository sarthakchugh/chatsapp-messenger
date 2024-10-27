const { default: mongoose } = require('mongoose');
const Channel = require('../models/Channel');
const User = require('../models/User');

const createChannel = async (req, res) => {
	try {
		const { name, members } = req.body;
		const userId = req.userId;
		const admin = await User.findById(userId);
		if (!admin) {
			return res.status(404).json({
				message: 'Admin User not found.',
			});
		}

		const validMembers = await User.find({ _id: { $in: members } });
		if (validMembers.length !== members.length) {
			return res.status(422).json({
				message: 'Some members are not valid users.',
			});
		}

		const channel = new Channel({
			name,
			members,
			admin: userId,
		});

		await channel.save();

		return res.status(201).json({
			channel,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

const getChannels = async (req, res) => {
	try {
		const userId = new mongoose.Types.ObjectId(req.userId);
		const channels = await Channel.find({
			$or: [{ admin: userId }, { members: userId }],
		}).sort({ updatedAt: -1 });

		return res.status(200).json({
			channels,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

const getChannelMessages = async (req, res) => {
	try {
		const channelId = req.params.channelId;
		const channel = await Channel.findById(channelId).populate({
			path: 'messages',
			populate: {
				path: 'sender',
				select: 'firstName lastName email _id image color',
			},
		});

		if (!channel) {
			return res.status(404).json({
				message: 'Channel not found',
			});
		}

		const messages = channel.messages;

		return res.status(200).json({
			messages,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

module.exports = { createChannel, getChannels, getChannelMessages };
