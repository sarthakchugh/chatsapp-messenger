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

import { useState } from 'react';
import { Input } from '../ui/input';
import Lottie from 'react-lottie';
import { getColor, searchAnimationOptions } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import { SEARCH_CONTACTS_ROUTE } from '@/util/constants';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarImage } from '../ui/avatar';
import { useAppStore } from '@/store/store';

const NewDM = () => {
	const { setSelectedChatType, setSelectedChatData } = useAppStore();
	const [openNewContactModal, setOpenNewContactModal] = useState(false);
	const [searchedContacts, setSearchedContacts] = useState([]);

	const searchContacts = async (searchTerm) => {
		try {
			if (searchTerm.length > 0) {
				const response = await apiClient.post(
					SEARCH_CONTACTS_ROUTE,
					{ searchTerm },
					{ withCredentials: true }
				);
				if (response.status === 200) {
					setSearchedContacts(response?.data?.contacts);
				}
			} else {
				setSearchedContacts([]);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const selectNewContact = (contact) => {
		setOpenNewContactModal(false);
		setSearchedContacts([]);
		setSelectedChatType('contact');
		setSelectedChatData(contact);
	};

	return (
		<>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<FaPlus
							className=' text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300'
							onClick={() => setOpenNewContactModal(true)}
						/>
					</TooltipTrigger>
					<TooltipContent className='bg-[#1c1b1e] border-none mb-2 p-3 text-white'>
						<p>Select New Contact</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
				<DialogContent className='bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col rounded-md'>
					<DialogHeader>
						<DialogTitle>Please select a contact</DialogTitle>
						<DialogDescription />
					</DialogHeader>
					<div>
						<Input
							placeholder='Search Contacts'
							className='rounded-lg p-6 bg-[#2c2e3b] border-none'
							onChange={(e) => searchContacts(e.target.value)}
						/>
					</div>
					<ScrollArea className='h-[250px]'>
						<div className='flex flex-col gap-5'>
							{searchedContacts.map((contact) => (
								<div
									key={contact._id}
									className='flex gap-3 items-center cursor-pointer'
									onClick={() => selectNewContact(contact)}
								>
									<div className='w-12 h-12 relative'>
										<Avatar className='h-12 w-12 rounded-full overflow-hidden'>
											{contact.image ? (
												<AvatarImage
													src={contact.image}
													alt={'profile'}
													className='h-full w-full bg-black object-cover'
												/>
											) : (
												<div
													className={`uppercase h-12 w-12 text-xl border-[1px] flex items-center justify-center rounded-full ${getColor(
														contact?.color ? contact.color : 0
													)}`}
												>
													{contact.firstName
														? contact.firstName.split('').shift()
														: contact.email.split('').shift()}
												</div>
											)}
										</Avatar>
									</div>
									<div className='flex flex-col'>
										<span>
											{contact.firstName && contact.lastName
												? `${contact.firstName} ${contact.lastName}`
												: contact.email}
										</span>
										<span className='text-xs'>{contact.email}</span>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>
					{searchedContacts.length <= 0 && (
						<div className='flex-1 flex-col justify-center items-center duration-1000 transition-all mt-5'>
							<Lottie
								isClickToPauseDisabled={true}
								height={150}
								width={150}
								options={searchAnimationOptions}
							/>
							<div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 text-lg transition-all duration-300 text-center'>
								<h3 className='poppins-medium'>
									Add
									<span className='text-purple-500'> new contact </span> to
									start
									<span className='text-purple-500'> messaging</span>.
								</h3>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};

export default NewDM;
