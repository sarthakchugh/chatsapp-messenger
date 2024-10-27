import Background from '@/assets/login2.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { useState } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/util/constants';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/store';

const Auth = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const setUserInfo = useAppStore((state) => state.setUserInfo);

	const validateSignup = () => {
		if (!email.length) {
			toast.error('Email is required.');
			return false;
		}

		if (!password.length) {
			toast.error('Password is required.');
			return false;
		}

		if (password !== confirmPassword) {
			toast.error('Password and Confirm Password should match.');
			return false;
		}

		return true;
	};

	const validateLogin = () => {
		if (!email.length) {
			toast.error('Email is required.');
			return false;
		}

		if (!password.length) {
			toast.error('Password is required.');
			return false;
		}

		return true;
	};

	const handleLogin = async () => {
		if (validateLogin()) {
			try {
				const response = await apiClient.post(
					LOGIN_ROUTE,
					{ email, password },
					{ withCredentials: true }
				);
				if (response.status === 200) {
					setUserInfo(response?.data?.user);
					if (response.data?.user?.profileSetup) {
						navigate('/chat');
					} else navigate('/profile');
				}
			} catch (err) {
				console.log(err);
				toast.error(err?.response?.data?.message);
			}
		}
	};

	const handleSignup = async () => {
		if (validateSignup()) {
			try {
				const response = await apiClient.post(
					SIGNUP_ROUTE,
					{ email, password },
					{ withCredentials: true }
				);
				if (response?.status === 201) {
					setUserInfo(response?.data?.user);
					navigate('/profile');
				}
			} catch (err) {
				console.log(err);
				toast.error(err?.response?.data?.message);
			}
		}
	};

	return (
		<div className='h-screen w-screen flex items-center justify-center bg-[#8417ff]/50'>
			<div className='h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2'>
				<div className='flex flex-col gap-10 md:gap-5 items-center justify-center'>
					<div className='flex flex-col items-center justify-center'>
						<div className='flex items-center justify-center'>
							<h1 className='text-5xl font-bold md:text-6xl mb-10 poppins-bold px-4 text-center mt-20 md:mt-10'>
								Welcome to <span className='text-purple-500'>ChatsApp</span>!
							</h1>
						</div>
						<p className='font-medium text-center poppins-medium px-5'>
							Enter your
							<span className='text-purple-500'> details </span> to get started
							with
							<span className='text-purple-500'> the best chat app</span>!
						</p>
					</div>
					<div className='flex items-center justify-center w-full'>
						<Tabs className='w-3/4' defaultValue='login'>
							<TabsList className='bg-transparent rounded-none w-full'>
								<TabsTrigger
									value='login'
									className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300'
								>
									Login
								</TabsTrigger>
								<TabsTrigger
									value='signup'
									className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300'
								>
									Signup
								</TabsTrigger>
							</TabsList>
							<TabsContent value='login' className='flex flex-col gap-2 mt-10'>
								<Input
									placeholder='Email'
									type='email'
									className='rounded-full p-6'
									value={email}
									name='email'
									onChange={(e) => setEmail(e.target.value)}
								/>
								<Input
									placeholder='Password'
									type='password'
									className='rounded-full p-6'
									value={password}
									name='password'
									onChange={(e) => setPassword(e.target.value)}
								/>
								<Button className='rounded-full p-6 mt-2' onClick={handleLogin}>
									Login
								</Button>
							</TabsContent>
							<TabsContent value='signup' className='flex flex-col gap-2'>
								<Input
									placeholder='Email'
									type='email'
									className='rounded-full p-6'
									value={email}
									name='email'
									onChange={(e) => setEmail(e.target.value)}
								/>
								<Input
									placeholder='Password'
									type='password'
									className='rounded-full p-6'
									value={password}
									name='password'
									onChange={(e) => setPassword(e.target.value)}
								/>
								<Input
									placeholder='Confirm Password'
									type='password'
									className='rounded-full p-6'
									value={confirmPassword}
									name='confirmPassword'
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
								<Button
									className='rounded-full p-6 mt-2'
									onClick={handleSignup}
								>
									Signup
								</Button>
							</TabsContent>
						</Tabs>
					</div>
				</div>
				<div className='flex items-center justify-center'>
					<img
						src={Background}
						alt='Background Login'
						className='hidden xl:h-[500px] xl:block'
					/>
				</div>
			</div>
		</div>
	);
};

export default Auth;
