import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { colors, getColor } from '@/lib/utils';
import { useAppStore } from '@/store/store';
import { useEffect, useRef, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import {
	DELETE_PROFILE_IMAGE_ROUTE,
	UPDATE_PROFILE_IMAGE_ROUTE,
	UPDATE_PROFILE_ROUTE,
} from '@/util/constants';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
	const { userInfo, setUserInfo } = useAppStore();
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [image, setImage] = useState(null);
	const [hovered, setHovered] = useState(false);
	const [selectedColor, setSelectedColor] = useState(0);
	const navigate = useNavigate();
	const fileInputRef = useRef(null);

	const validateInput = () => {
		if (!firstName.length) {
			toast.error('First Name is required.');
			return false;
		}

		if (!lastName.length) {
			toast.error('Last Name is required.');
			return false;
		}

		return true;
	};

	const saveChanges = async () => {
		if (validateInput()) {
			try {
				const response = await apiClient.post(
					UPDATE_PROFILE_ROUTE,
					{ firstName, lastName, color: selectedColor },
					{ withCredentials: true }
				);

				if (response?.status === 200) {
					setUserInfo(response?.data?.user);
					toast.success(response?.data?.message);
					navigate('/chat');
				}
			} catch (err) {
				console.log(err);
				toast.error(err?.response?.data?.message);
			}
		}
	};

	const handleNavigate = () => {
		if (userInfo.profileSetup) {
			navigate('/chat');
		} else {
			toast.error('Please complete the profile setup to continue.');
		}
	};

	const handleFileInputClick = () => {
		fileInputRef.current.click();
	};

	const handleImageChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			const formData = new FormData();
			formData.append('profile-image', file);
			formData.append('userId', userInfo?._id);
			toast('Uploading Profile Image');
			const response = await apiClient.post(
				UPDATE_PROFILE_IMAGE_ROUTE,
				formData,
				{ withCredentials: true }
			);

			if (response?.status === 200) {
				setImage(response?.data?.user?.image);
				setUserInfo(response?.data?.user);
				toast.success(response?.data?.message);
			}
		}
	};

	const handleDeleteImage = async () => {
		const response = await apiClient.delete(
			`${DELETE_PROFILE_IMAGE_ROUTE}/${userInfo._id}`,
			{
				withCredentials: true,
			}
		);

		if (response?.status === 200) {
			setImage(null);
			setUserInfo(response?.data?.user);
			toast.success(response?.data?.message);
			fileInputRef.current.value = '';
		}
	};

	useEffect(() => {
		if (userInfo) {
			setFirstName(userInfo.firstName);
			setLastName(userInfo.lastName);
			setSelectedColor(userInfo.color);
			setImage(userInfo.image);
		}
	}, [userInfo]);

	return (
		<div className='bg-[#1b1c24] h-screen flex items-center justify-center flex-col gap-10'>
			<div className='flex flex-col gap-10 w-[80vw] md:w-max'>
				<div>
					<IoArrowBack
						className='text-4xl lg:text-5xl text-white/90 cursor-pointer'
						onClick={handleNavigate}
					/>
				</div>
				<div className='grid grid-cols-2'>
					<div
						className='h-32 w-32 md:w-48 md:h-48 relative flex items-center justify-center'
						onMouseEnter={() => setHovered(true)}
						onMouseLeave={() => setHovered(false)}
					>
						<Avatar className='h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden'>
							{image ? (
								<AvatarImage
									src={image}
									alt={'profile'}
									className='h-full w-full bg-black object-cover'
								/>
							) : (
								<div
									className={`uppercase h-32 w-32 md:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
										selectedColor
									)}`}
								>
									{firstName
										? firstName.split('').shift()
										: userInfo.email.split('').shift()}
								</div>
							)}
						</Avatar>
						{hovered && (
							<div
								className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer'
								onClick={image ? handleDeleteImage : handleFileInputClick}
							>
								{image ? (
									<FaTrash className='text-white text-3xl cursor-pointer' />
								) : (
									<FaPlus className='text-white text-3xl cursor-pointer' />
								)}
							</div>
						)}
						<input
							type='file'
							ref={fileInputRef}
							className='hidden'
							onChange={handleImageChange}
							name='profile-image'
							accept='.png, .jpeg, .jpg, .svg, .webp'
						/>
					</div>
					<div className='flex min-w-32 md:min-w-64 flex-col text-white items-center justify-center gap-5'>
						<div className='w-full'>
							<Input
								placeholder='Email'
								type='email'
								value={userInfo.email}
								disabled
								className='rounded-lg p-6 bg-[#2c2e3b] border-none'
							/>
						</div>
						<div className='w-full'>
							<Input
								placeholder='First Name'
								type='text'
								value={firstName}
								className='rounded-lg p-6 bg-[#2c2e3b] border-none'
								onChange={(e) => setFirstName(e.target.value)}
							/>
						</div>
						<div className='w-full'>
							<Input
								placeholder='Last Name'
								type='text'
								value={lastName}
								className='rounded-lg p-6 bg-[#2c2e3b] border-none'
								onChange={(e) => setLastName(e.target.value)}
							/>
						</div>
						<div className='w-full flex gap-5'>
							{colors.map((color, index) => (
								<div
									className={`${color} h-6 w-6 md:h-8 md:w-8 rounded-full cursor-pointer transition-all duration-100 ${
										selectedColor === index ? 'outline outline-white/50' : ''
									}`}
									key={index}
									onClick={() => setSelectedColor(index)}
								></div>
							))}
						</div>
					</div>
				</div>
				<div className='w-full'>
					<Button
						className='h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300'
						onClick={saveChanges}
					>
						Save Changes
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Profile;
