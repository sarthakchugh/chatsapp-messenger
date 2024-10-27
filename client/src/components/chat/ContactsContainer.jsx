import { useAppStore } from '@/store/store';
import { Avatar, AvatarImage } from '../ui/avatar';
import { getColor } from '@/lib/utils';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';
import { FiEdit2 } from 'react-icons/fi';
import { IoLogOut } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api-client';
import {
	CHANNEL_ROUTE,
	GET_CONTACT_LIST_ROUTE,
	LOGOUT_ROUTE,
} from '@/util/constants';
import NewDM from './NewDM';
import { useEffect } from 'react';
import ContactList from './ContactList';
import CreateChannel from '../channel/CreateChannel';

const Logo = () => {
	return (
		<div className='flex p-5  justify-start items-center gap-2'>
			<svg
				id='logo-38'
				width='78'
				height='32'
				viewBox='0 0 78 32'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				{' '}
				<path
					d='M55.5 0H77.5L58.5 32H36.5L55.5 0Z'
					className='ccustom'
					fill='#8338ec'
				></path>{' '}
				<path
					d='M35.5 0H51.5L32.5 32H16.5L35.5 0Z'
					className='ccompli1'
					fill='#975aed'
				></path>{' '}
				<path
					d='M19.5 0H31.5L12.5 32H0.5L19.5 0Z'
					className='ccompli2'
					fill='#a16ee8'
				></path>{' '}
			</svg>
			<span className='text-3xl font-semibold '>ChatsApp</span>
		</div>
	);
};

const Title = ({ text }) => {
	return (
		<h6 className='uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm'>
			{text}
		</h6>
	);
};

const ProfileInfo = () => {
	const { userInfo, setUserInfo } = useAppStore();
	const navigate = useNavigate();

	const logout = async () => {
		const response = await apiClient.get(LOGOUT_ROUTE, {
			withCredentials: true,
		});
		if (response.status === 200) {
			setUserInfo(null);
			navigate('/auth');
		}
	};

	return (
		<div className='absolute bottom-0 h-20 flex items-center justify-between px-6 w-full bg-[#2a2b33]'>
			<div className='flex gap-3 items-center justify-center'>
				<div className='w-12 h-12 relative'>
					<Avatar className='h-12 w-12 rounded-full overflow-hidden'>
						{userInfo.image ? (
							<AvatarImage
								src={userInfo.image}
								alt={'profile'}
								className='h-full w-full bg-black object-cover'
							/>
						) : (
							<div
								className={`uppercase h-12 w-12 text-xl border-[1px] flex items-center justify-center rounded-full ${getColor(
									userInfo?.color ? userInfo.color : 0
								)}`}
							>
								{userInfo.firstName
									? userInfo.firstName.split('').shift()
									: userInfo.email.split('').shift()}
							</div>
						)}
					</Avatar>
				</div>
				<div>
					{userInfo.firstName && userInfo.lastName
						? `${userInfo.firstName} ${userInfo.lastName}`
						: ''}
				</div>
			</div>
			<div className='flex gap-5'>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<FiEdit2
								className='text-purple-500 text-xl font-medium'
								onClick={() => navigate('/profile')}
							/>
						</TooltipTrigger>
						<TooltipContent className='bg-[#1c1b1e] border-none text-white'>
							<p>Edit Profile</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<IoLogOut
								className='text-red-500 text-3xl font-medium'
								onClick={logout}
							/>
						</TooltipTrigger>
						<TooltipContent className='bg-[#1c1b1e] border-none text-white'>
							<p>Logout</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
};

const ContactsContainer = () => {
	const { contactList, setContactList, channels, setChannels } = useAppStore();

	useEffect(() => {
		const getContactList = async () => {
			const response = await apiClient.get(GET_CONTACT_LIST_ROUTE, {
				withCredentials: true,
			});
			if (response.status === 200) {
				setContactList(response?.data?.contacts);
			}
		};

		const getChannels = async () => {
			const response = await apiClient.get(CHANNEL_ROUTE, {
				withCredentials: true,
			});
			if (response.status === 200) {
				setChannels(response?.data?.channels);
			}
		};

		getContactList();
		getChannels();
	}, [setContactList, setChannels]);

	return (
		<div className='relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full'>
			<div className='pt-3'>
				<Logo />
			</div>
			<div className='my-5'>
				<div className='flex items-center justify-between pr-10'>
					<Title text={'direct messages'} />
					<NewDM />
				</div>
				<div className='max-h-[38vh] overflow-y-auto scrollbar-hidden'>
					<ContactList contacts={contactList} />
				</div>
			</div>
			<div className='my-5'>
				<div className='flex items-center justify-between pr-10'>
					<Title text={'channels'} />
					<CreateChannel />
				</div>
				<div className='max-h-[38vh] overflow-y-auto scrollbar-hidden'>
					<ContactList contacts={channels} isChannel={true} />
				</div>
			</div>
			<ProfileInfo />
		</div>
	);
};

export default ContactsContainer;
