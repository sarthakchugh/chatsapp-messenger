import { useAppStore } from '@/store/store';
import { HOST } from '@/util/constants';
import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
	const socket = useRef();
	const { userInfo, addChannelToList, addContactToList } = useAppStore();

	useEffect(() => {
		if (userInfo) {
			socket.current = io(HOST, {
				withCredentials: true,
				query: {
					userId: userInfo._id,
				},
			});

			socket.current.on('connect', () => {
				console.log('Connected to Socket Server');
			});

			const handleReceiveMessage = (message) => {
				const { selectedChatType, selectedChatData, addMessage } =
					useAppStore.getState();
				if (
					selectedChatType !== undefined &&
					(selectedChatData._id.toString() === message.sender._id.toString() ||
						selectedChatData._id.toString() ===
							message.recipient._id.toString())
				) {
					addMessage(message);
				}
				addContactToList(message);
			};

			const handleReceiveChannelMessage = (message) => {
				const { selectedChatType, selectedChatData, addMessage } =
					useAppStore.getState();
				if (
					selectedChatType !== undefined &&
					selectedChatData._id.toString() === message.channelId.toString()
				) {
					addMessage(message);
				}

				addChannelToList(message);
			};

			socket.current.on('receiveMessage', handleReceiveMessage);
			socket.current.on('receiveChannelMessage', handleReceiveChannelMessage);

			return () => {
				socket.current.disconnect();
			};
		}
	}, [userInfo, addChannelToList, addContactToList]);

	return (
		<SocketContext.Provider value={socket.current}>
			{children}
		</SocketContext.Provider>
	);
};
