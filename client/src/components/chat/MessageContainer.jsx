import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store/store';
import { CHANNEL_ROUTE, HOST, MESSAGE_ROUTE } from '@/util/constants';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { FaFile } from 'react-icons/fa6';
import { IoMdArrowRoundDown } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';
import { Avatar, AvatarImage } from '../ui/avatar';
import { getColor } from '@/lib/utils';

const MessageContainer = () => {
	const scrollRef = useRef();
	const {
		userInfo,
		selectedChatType,
		selectedChatData,
		selectedChatMessages,
		setSelectedChatMessages,
		setIsDownloading,
		setFileDownloadProgress,
	} = useAppStore();

	const [showImage, setShowImage] = useState(false);
	const [imageURL, setImageURL] = useState(null);

	const checkIfImage = (filePath) => {
		const imageRegex =
			/\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
		return imageRegex.test(filePath);
	};

	// todo: Download a file
	const downloadFile = async (filePath) => {
		setIsDownloading(true);
		setFileDownloadProgress(0);
		// get the file as a Blob from the server
		const response = await apiClient.get(`${HOST}/${filePath}`, {
			responseType: 'blob',
			onDownloadProgress: (progressEvent) => {
				const { loaded, total } = progressEvent;
				setFileDownloadProgress(Math.round((100 * loaded) / total));
			},
		});
		// create a temp URL object from the Blob
		const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
		// Add a link to the DOM
		const link = document.createElement('a');
		// Add Blob to the link
		link.href = urlBlob;
		// Make the link downloadable with correct file name
		link.setAttribute('download', filePath.split('/').pop());
		// Append the link to Body
		document.body.appendChild(link);
		// Click the link
		link.click();
		// Remove the link once clicked
		link.remove();
		// Clean up the temp URL object
		window.URL.revokeObjectURL(urlBlob);
		setIsDownloading(false);
		setFileDownloadProgress(0);
	};

	// todo: Direct Message Render
	const renderDM = (message) => {
		return (
			<div
				className={`mt-4 ${
					message.sender === selectedChatData._id ? 'text-left' : 'text-right'
				}`}
			>
				{message.messageType === 'text' && (
					<div
						className={`${
							message.sender !== selectedChatData._id
								? 'bg-[#8417ff]/15 text-white/70 border-[#8714ff]/15'
								: 'bg-[#2a2b33]/30 text-white/80 border-[#2a2b33]/50'
						} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
					>
						{message.content}
					</div>
				)}
				{message.messageType === 'file' && (
					<div
						className={`${
							message.sender !== selectedChatData._id
								? 'bg-[#8417ff]/15 text-white/70 border-[#8714ff]/15'
								: 'bg-[#2a2b33]/30 text-white/80 border-[#2a2b33]/50'
						} border inline-block p-2 rounded my-1 max-w-[50%] break-words`}
					>
						{checkIfImage(message.fileURL) ? (
							<div
								className='cursor-pointer'
								onClick={() => {
									setShowImage(true);
									setImageURL(message.fileURL);
								}}
							>
								<img
									src={`${HOST}/${message.fileURL}`}
									height={300}
									width={300}
								/>
							</div>
						) : (
							<div className='flex items-center justify-center gap-2 lg:gap-4'>
								<span className='text-white/80 lg:text-3xl bg-black/20 rounded-full p-3'>
									<FaFile />
								</span>
								<span className='max-w-16 lg:max-w-full text-sm lg:text-base'>
									{message.fileURL.split('/').pop().split('.')[0]}
								</span>
								<span
									className='bg-black/20 p-3 lg:text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
									onClick={() => downloadFile(message.fileURL)}
								>
									<IoMdArrowRoundDown />
								</span>
							</div>
						)}
					</div>
				)}
				<div className='text-xs text-gray-600'>
					{moment(message.timeStamp).format('LT')}
				</div>
			</div>
		);
	};

	// todo: Channel Message Render
	const renderChannelMessage = (message) => {
		return (
			<>
				<div
					className={`mt-4 ${
						message.sender._id !== userInfo._id
							? 'justify-start'
							: 'justify-end'
					} flex items-end`}
				>
					{message.sender._id !== userInfo._id ? (
						<div className='inline-flex items-center justify-start mr-2'>
							<Avatar className='h-10 w-10 rounded-full overflow-hidden'>
								{message.sender.image ? (
									<AvatarImage
										src={message.sender.image}
										alt={'profile'}
										className='h-full w-full bg-black object-cover'
									/>
								) : (
									<div
										className={`uppercase h-10 w-10 text-xl border-[1px] flex items-center justify-center rounded-full ${getColor(
											message.sender?.color
										)}`}
									>
										{message.sender.firstName
											? message.sender.firstName.split('').shift()
											: message.sender.email.split('').shift()}
									</div>
								)}
							</Avatar>
						</div>
					) : null}
					{message.messageType === 'text' && (
						<div
							className={`${
								message.sender._id === userInfo._id
									? 'bg-[#8417ff]/15 text-white/70 border-[#8714ff]/15'
									: 'bg-[#2a2b33]/30 text-white/80 border-[#2a2b33]/50'
							} border inline-block p-4 rounded my-1 max-w-[50%] break-words text-sm md:text-base`}
						>
							{message.content}
						</div>
					)}
					{message.messageType === 'file' && (
						<div
							className={`${
								message.sender._id === userInfo._id
									? 'bg-[#8417ff]/15 text-white/70 border-[#8714ff]/15'
									: 'bg-[#2a2b33]/30 text-white/80 border-[#2a2b33]/50'
							} border inline-block p-2 rounded my-1 max-w-[50%] break-words`}
						>
							{checkIfImage(message.fileURL) ? (
								<div
									className='cursor-pointer'
									onClick={() => {
										setShowImage(true);
										setImageURL(message.fileURL);
									}}
								>
									<img
										src={`${HOST}/${message.fileURL}`}
										height={300}
										width={300}
									/>
								</div>
							) : (
								<div className='flex items-center justify-center gap-2 lg:gap-4'>
									<span className='text-white/80 text-lg lg:text-3xl bg-black/20 rounded-full p-3'>
										<FaFile className='text-lg' />
									</span>
									<span className='max-w-16 lg:max-w-full text-sm lg:text-base'>
										{message.fileURL.split('/').pop().split('.')[0]}
									</span>
									<span
										className='bg-black/20 p-3 text-lg lg:text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
										onClick={() => downloadFile(message.fileURL)}
									>
										<IoMdArrowRoundDown />
									</span>
								</div>
							)}
						</div>
					)}
				</div>
				{message.sender._id !== userInfo._id ? (
					<div className='relative top-0 left-[50px] w-[50%] flex gap-5 items-baseline'>
						<span className='text-sm text-white/60'>{`${message.sender.firstName}`}</span>
						<span className='text-xs text-gray-600'>
							{moment(message.timeStamp).format('LT')}
						</span>
					</div>
				) : (
					<div className='flex justify-end'>
						<span className='text-xs text-gray-600'>
							{moment(message.timeStamp).format('LT')}
						</span>
					</div>
				)}
			</>
		);
	};

	// todo: General Message Render
	const renderMessages = () => {
		let lastDate = null;
		return selectedChatMessages.map((message, index) => {
			const messageDate = moment(message.timeStamp).format('YYYY-MM-DD');
			const showDate = messageDate !== lastDate;
			lastDate = messageDate;
			return (
				<div key={index}>
					{showDate && (
						<div className='text-center text-gray-500 my-2'>
							{moment(lastDate).format('LL')}
						</div>
					)}
					{selectedChatType === 'contact' && renderDM(message)}
					{selectedChatType === 'channel' && renderChannelMessage(message)}
				</div>
			);
		});
	};

	// todo: Scroll into view
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [selectedChatMessages]);

	// todo: Get messages on chat load
	useEffect(() => {
		const getMessages = async () => {
			const response = await apiClient.post(
				MESSAGE_ROUTE,
				{ user2: selectedChatData._id },
				{ withCredentials: true }
			);

			if (response.status === 200) {
				setSelectedChatMessages(response?.data?.messages);
			}
		};

		const getChannelMessages = async () => {
			const response = await apiClient.get(
				`
				${CHANNEL_ROUTE}/${selectedChatData._id}/messages`,
				{ withCredentials: true }
			);

			if (response.status === 200) {
				setSelectedChatMessages(response?.data?.messages);
			}
		};

		if (selectedChatData._id) {
			if (selectedChatType === 'contact') getMessages();
			else if (selectedChatType === 'channel') getChannelMessages();
		}
	}, [selectedChatData, selectedChatType, setSelectedChatMessages]);

	return (
		<div className='flex-1 overflow-y-auto scrollbar-hidden p-4 lg:px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full'>
			{renderMessages()}
			<div ref={scrollRef} />
			{showImage && (
				<div className='fixed z-[1000] top-0 left-0 h-screen w-screen flex flex-col items-center justify-center backdrop-blur-lg'>
					<div>
						<img
							src={`${HOST}/${imageURL}`}
							className='h-[30vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[80vh] w-full object-cover'
						/>
					</div>
					<div className='flex gap-5 fixed top-0 mt-5 xl:mt-2'>
						<button
							className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
							onClick={() => downloadFile(imageURL)}
						>
							<IoMdArrowRoundDown />
						</button>
						<button
							className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
							onClick={() => {
								setImageURL(null);
								setShowImage(false);
							}}
						>
							<IoCloseSharp />
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default MessageContainer;
