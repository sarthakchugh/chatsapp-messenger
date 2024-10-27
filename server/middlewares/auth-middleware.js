const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	const token = req.cookies.jwt;
	if (!token) {
		return res.status(401).json({
			message: 'Unauthenticated User',
		});
	}
	jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
		if (err) {
			return res.status(403).json({
				message: 'Invalid Token',
			});
		}
		req.userId = payload.userId;
		next();
	});
};

module.exports = { verifyToken };
