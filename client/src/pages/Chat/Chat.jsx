import ChatContainer from '@/components/chat/ChatContainer';
import ContactsContainer from '@/components/chat/ContactsContainer';
import EmptyChatContainer from '@/components/chat/EmptyChatContainer';
import { useAppStore } from '@/store/store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Chat = () => {
	const {
		userInfo,
		selectedChatType,
		isUploading,
		isDownloading,
		fileUploadProgress,
		fileDownloadProgress,
	} = useAppStore();
	const navigate = useNavigate();

	// todo: Navigate user to profile section if the profile is not complete
	useEffect(() => {
		if (!userInfo.profileSetup) {
			toast.error('Please complete the profile setup to continue.');
			navigate('/profile');
		}
	}, [navigate, userInfo]);
	return (
		<div className='flex h-screen text-white overflow-hidden'>
			{isUploading && (
				<div className='h-screen w-screen fixed top-0 left-0 z-10 bg-black/80 flex flex-col items-center justify-center gap-5 backdrop-blur-lg'>
					<h5 className='text-5xl animate-pulse'>Uploading File</h5>
					{fileUploadProgress}%
				</div>
			)}
			{isDownloading && (
				<div className='h-screen w-screen fixed top-0 left-0 z-10 bg-black/80 flex flex-col items-center justify-center gap-5 backdrop-blur-lg'>
					<h5 className='text-5xl animate-pulse'>Downloading File</h5>
					{fileDownloadProgress}%
				</div>
			)}
			<ContactsContainer />
			{selectedChatType === undefined ? (
				<EmptyChatContainer />
			) : (
				<ChatContainer />
			)}
		</div>
	);
};

export default Chat;
