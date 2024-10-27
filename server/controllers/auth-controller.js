const User = require('../models/User');
const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60 * 1000;
const bcrypt = require('bcryptjs');

const createToken = (email, userId) => {
	return jwt.sign({ email, userId }, process.env.JWT_KEY, {
		expiresIn: maxAge,
	});
};

const signup = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(422).json({
				message: 'Email and Password are required',
			});
		}
		let user = await User.findOne({ email });
		if (user) {
			return res.status(422).json({
				message: 'User with this email already exists.',
			});
		}

		user = new User({
			email,
			password,
		});

		await user.save();

		const token = createToken(email, user._id);
		res.cookie('jwt', token, { maxAge, secure: true, sameSite: 'None' });
		return res.status(201).json({
			success: true,
			message: 'User Signup successful!',
			user,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(422).json({
				message: 'Email and Password are required',
			});
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				message: 'No user found for this email.',
			});
		}

		const doMatch = await bcrypt.compare(password, user.password);
		if (!doMatch) {
			return res.status(422).json({
				message: 'Invalid password.',
			});
		}

		const token = createToken(email, user._id);
		res.cookie('jwt', token, { maxAge, secure: true, sameSite: 'None' });
		return res.status(200).json({
			success: true,
			message: 'User Login successful!',
			user,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

const getUserInfo = async (req, res) => {
	try {
		const userId = req.userId;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				message: 'User not found.',
			});
		}

		return res.status(200).json({
			user,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

const logout = async (req, res) => {
	try {
		res.clearCookie('jwt').status(200).json({
			message: 'User Logout successful!',
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

module.exports = { signup, login, getUserInfo, logout };
