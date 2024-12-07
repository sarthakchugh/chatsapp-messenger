const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const setupSocket = require('./socket');

const PORT = process.env.PORT || 3000;
const database_url = process.env.MONGODB_URI;

const app = express();

app.use(
	cors({
		origin: process.env.ORIGIN,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		credentials: true,
	})
);

app.use('/uploads/files', express.static('uploads/files'));

app.use(cookieParser());
app.use(express.json());

// todo: Import the routes
const authRouter = require('./routes/auth-routes');
const profileRouter = require('./routes/profile-routes');
const searchContactRouter = require('./routes/contact-routes');
const messageRouter = require('./routes/message-routes');
const channelRouter = require('./routes/channel-routes');

// todo: Use the routes
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/contacts', searchContactRouter);
app.use('/api/messages', messageRouter);
app.use('/api/channel', channelRouter);

mongoose.connect(database_url).then(() => {
	console.log('Mongo DB is running...');
});

const server = app.listen(PORT, () => {
	console.log('Server running at port: ' + PORT);
});

setupSocket(server);
