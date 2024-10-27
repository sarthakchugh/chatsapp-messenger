const mongoose = require('mongoose');
const channelSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		members: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
		],
		admin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Message',
			},
		],
	},
	{ timestamps: true }
);

channelSchema.pre('save', function (next) {
	this.updatedAt = Date.now();
	next();
});

channelSchema.pre('findOneAndUpdate', function (next) {
	this.set({ updatedAt: Date.now() });
	next();
});

const Channel = mongoose.model('Channel', channelSchema);
module.exports = Channel;
