const { genSalt, hash } = require('bcryptjs');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
	},
	firstName: String,
	lastName: String,
	image: String,
	color: {
		type: Number,
		default: 0,
	},
	profileSetup: {
		type: Boolean,
		default: false,
	},
});

userSchema.pre('save', async function (next) {
	const salt = await genSalt();
	this.password = await hash(this.password, salt);
	next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
