const { Server } = require('socket.io');
const Message = require('./models/Message');
const Channel = require('./models/Channel');

const setupSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: process.env.ORIGIN,
			methods: ['GET', 'POST', 'PUT', 'DELETE'],
			credentials: true,
		},
	});

	const userSocketMap = new Map();

	const disconnect = (socket) => {
		console.log(`Client Disconnected: ${socket.id}`);
		for (const [userId, socketId] of userSocketMap.entries()) {
			if (socketId === socket.id) {
				userSocketMap.delete(userId);
				break;
			}
		}
	};

	const sendMessage = async (message) => {
		const senderSocketId = userSocketMap.get(message.sender);
		const recipientSocketId = userSocketMap.get(message.recipient);

		const createdMessage = new Message(message);
		await createdMessage.save();

		const messageData = await Message.findById(createdMessage._id)
			.populate('sender', '_id email firstName lastName image color')
			.populate('recipient', '_id email firstName lastName color image');

		if (recipientSocketId) {
			io.to(recipientSocketId).emit('receiveMessage', messageData);
		}

		if (senderSocketId) {
			io.to(senderSocketId).emit('receiveMessage', messageData);
		}
	};

	const sendChannelMessage = async (message) => {
		const { sender, content, messageType, fileURL, channelId } = message;
		const createdMessage = new Message({
			sender,
			recipient: null,
			content,
			messageType,
			fileURL,
			timeStamp: new Date(),
		});
		await createdMessage.save();

		const messageData = await Message.findById(createdMessage._id)
			.populate('sender', '_id email firstName lastName image color')
			.exec();

		await Channel.findByIdAndUpdate(channelId, {
			$push: { messages: createdMessage._id },
		});

		const channel = await Channel.findById(channelId).populate('members');
		const finalData = { ...messageData._doc, channelId: channel._id };

		if (channel && channel.members) {
			channel.members.forEach((member) => {
				const memberSocketId = userSocketMap.get(member._id.toString());
				if (memberSocketId) {
					io.to(memberSocketId).emit('receiveChannelMessage', finalData);
				}
			});
			const adminSocketId = userSocketMap.get(channel.admin._id.toString());
			if (adminSocketId) {
				io.to(adminSocketId).emit('receiveChannelMessage', finalData);
			}
		}
	};

	io.on('connection', (socket) => {
		const userId = socket.handshake.query.userId;

		if (userId) {
			userSocketMap.set(userId, socket.id);
			console.log(`User connected: ${userId} with Socket ID: ${socket.id}`);
		} else {
			console.log('UserId not provided during connection');
		}

		socket.on('sendMessage', sendMessage);
		socket.on('sendChannelMessage', sendChannelMessage);

		socket.on('disconnect', () => {
			disconnect(socket);
		});
	});
};

module.exports = setupSocket;
