import { FaPlus } from 'react-icons/fa';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { apiClient } from '@/lib/api-client';
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTE } from '@/util/constants';
import { useAppStore } from '@/store/store';
import { Button } from '../ui/button';
import MultipleSelector from '../ui/multi-select';

const CreateChannel = () => {
	const { addChannel } = useAppStore();
	const [openChannelModal, setOpenChannelModal] = useState(false);
	const [allContacts, setAllContacts] = useState([]);
	const [selectedContacts, setSelectedContacts] = useState([]);
	const [channelName, setChannelName] = useState('');

	useEffect(() => {
		const getData = async () => {
			const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
				withCredentials: true,
			});
			if (response.status === 200) {
				setAllContacts(response.data?.contacts);
			}
		};
		getData();
	}, []);

	const createChannel = async () => {
		try {
			if (channelName.trim().length > 0 && selectedContacts.length > 0) {
				const response = await apiClient.post(
					CREATE_CHANNEL_ROUTE,
					{
						name: channelName,
						members: selectedContacts.map((contact) => contact.value),
					},
					{ withCredentials: true }
				);

				if (response.status === 201) {
					setChannelName('');
					setSelectedContacts([]);
					setOpenChannelModal(false);
					addChannel(response.data?.channel);
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<FaPlus
							className=' text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300'
							onClick={() => setOpenChannelModal(true)}
						/>
					</TooltipTrigger>
					<TooltipContent className='bg-[#1c1b1e] border-none mb-2 p-3 text-white'>
						<p>Create new channel</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<Dialog open={openChannelModal} onOpenChange={setOpenChannelModal}>
				<DialogContent className='bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col rounded-md'>
					<DialogHeader>
						<DialogTitle>Create new channel</DialogTitle>
						<DialogDescription />
					</DialogHeader>
					<div>
						<Input
							placeholder='Channel Name'
							className='rounded-lg p-6 bg-[#2c2e3b] border-none'
							onChange={(e) => setChannelName(e.target.value)}
							value={channelName}
						/>
					</div>
					<div>
						<MultipleSelector
							className='rounded-lg bg-[#2c2e3b] border-none py-2 text-white'
							defaultOptions={allContacts}
							placeholder='Search Contacts'
							value={selectedContacts}
							onChange={setSelectedContacts}
							emptyIndicator={
								<p className='text-center text-lg leading-10 text-gray-600'>
									No Result Found!
								</p>
							}
						/>
					</div>
					<div>
						<Button
							className='mt-7 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300'
							onClick={createChannel}
						>
							Create Channel
						</Button>
					</div>
					<div className='text-opacity-80 text-white flex flex-col gap-5 items-start mt-10 text-lg transition-all duration-300 text-left'>
						<h3 className='poppins-medium'>
							Create a<span className='text-purple-500'> new group </span> and
							add
							<span className='text-purple-500'> your contacts</span>.
						</h3>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default CreateChannel;
