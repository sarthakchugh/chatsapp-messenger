import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth/Auth';
import Chat from './pages/Chat/Chat';
import Profile from './pages/Profile/Profile';
import { useAppStore } from './store/store';
import { useEffect, useState } from 'react';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './util/constants';

const PrivateRoute = ({ children }) => {
	const { userInfo } = useAppStore();
	const isAuthenticated = !!userInfo;
	return isAuthenticated ? children : <Navigate to='/auth' />;
};

const AuthRoute = ({ children }) => {
	const { userInfo } = useAppStore();
	const isAuthenticated = !!userInfo;
	return isAuthenticated ? <Navigate to='/chat' /> : children;
};

const App = () => {
	const { userInfo, setUserInfo } = useAppStore();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const getUserData = async () => {
			try {
				const response = await apiClient.get(GET_USER_INFO, {
					withCredentials: true,
				});
				if (response.status === 200) {
					setUserInfo(response?.data?.user);
				} else {
					setUserInfo(undefined);
				}
			} catch (err) {
				console.log(err);
				setUserInfo(undefined);
			} finally {
				setLoading(false);
			}
		};

		if (!userInfo) {
			getUserData();
		} else {
			setLoading(false);
		}
	}, [userInfo, setUserInfo]);

	if (loading) {
		return <div>Loading....</div>;
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path='/auth'
					element={
						<AuthRoute>
							<Auth />
						</AuthRoute>
					}
				/>
				<Route
					path='/chat'
					element={
						<PrivateRoute>
							<Chat />
						</PrivateRoute>
					}
				/>
				<Route
					path='/profile'
					element={
						<PrivateRoute>
							<Profile />
						</PrivateRoute>
					}
				/>
				<Route path='*' element={<Navigate to='/auth' />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
