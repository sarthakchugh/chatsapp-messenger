import { useSocket } from '@/context/Socket-context';
import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store/store';
import { UPLOAD_FILE_ROUTE } from '@/util/constants';
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
import { GrAttachment } from 'react-icons/gr';
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerLine } from 'react-icons/ri';

const MessageBar = () => {
	const [message, setMessage] = useState('');
	const emojiRef = useRef(null);
	const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
	const {
		selectedChatType,
		selectedChatData,
		userInfo,
		setIsUploading,
		setFileUploadProgress,
	} = useAppStore();
	const socket = useSocket();
	const fileInputRef = useRef(null);

	const handleAttachmentClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	// todo: Uploading a file
	const handleAttachmentChange = async (e) => {
		try {
			const file = e.target.files[0];
			if (file) {
				const formData = new FormData();
				formData.append('file', file);
				setIsUploading(true);
				const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
					withCredentials: true,
					onUploadProgress: (data) => {
						setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
					},
				});

				if (response.status === 200 && response.data) {
					setIsUploading(false);
					if (selectedChatType === 'contact') {
						socket.emit('sendMessage', {
							sender: userInfo._id,
							content: undefined,
							recipient: selectedChatData._id,
							messageType: 'file',
							fileURL: response.data.filePath,
						});
					} else if (selectedChatType === 'channel') {
						socket.emit('sendChannelMessage', {
							sender: userInfo._id,
							content: undefined,
							messageType: 'file',
							fileURL: response.data.filePath,
							channelId: selectedChatData._id,
						});
					}
				}
			}
		} catch (err) {
			setIsUploading(false);
			console.log(err);
		}
	};

	const handleAddEmoji = (emoji) => {
		setMessage((msg) => msg + emoji?.emoji);
	};

	const handleEnterKey = async (e) => {
		if (e.key === 'Enter') {
			await handleSendMessage();
		}
	};

	// todo: Sending a message -> Emit to Socket
	const handleSendMessage = async () => {
		if (selectedChatType === 'contact') {
			socket.emit('sendMessage', {
				sender: userInfo._id,
				content: message,
				recipient: selectedChatData._id,
				messageType: 'text',
				fileURL: undefined,
			});
		} else if (selectedChatType === 'channel') {
			socket.emit('sendChannelMessage', {
				sender: userInfo._id,
				content: message,
				messageType: 'text',
				fileURL: undefined,
				channelId: selectedChatData._id,
			});
		}
		setMessage('');
	};

	// todo: Close the Emoji Picker
	useEffect(() => {
		function handleClickOutside(event) {
			if (emojiRef.current && !emojiRef.current.contains(event.target)) {
				setEmojiPickerOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [emojiRef]);

	return (
		<div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-2 gap-2'>
			<div className='flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5'>
				<input
					type='text'
					className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none'
					placeholder='Enter message'
					value={message}
					onChange={(e) => {
						setMessage(e.target.value);
					}}
					onKeyDown={handleEnterKey}
				/>
				<button
					className='text-neutral-500 border-none outline-none focus:text-white hover:text-white duration-200 transition-all'
					onClick={handleAttachmentClick}
				>
					<GrAttachment className='text-xl' />
				</button>
				<input
					type='file'
					className='hidden'
					ref={fileInputRef}
					onChange={handleAttachmentChange}
				/>
				<div className='relative'>
					<button
						className='text-neutral-500 border-none outline-none focus:text-white hover:text-white duration-200 transition-all'
						onClick={() => setEmojiPickerOpen(true)}
					>
						<RiEmojiStickerLine className='text-2xl' />
					</button>
					<div className='absolute bottom-16 right-0' ref={emojiRef}>
						<EmojiPicker
							theme='dark'
							open={emojiPickerOpen}
							onEmojiClick={handleAddEmoji}
							autoFocusSearch={false}
						/>
					</div>
				</div>
			</div>
			<button
				className='bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
				onClick={handleSendMessage}
			>
				<IoSend className='text-2xl' />
			</button>
		</div>
	);
};

export default MessageBar;
