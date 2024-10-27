import { useAppStore } from '@/store/store';
import { Avatar, AvatarImage } from '../ui/avatar';
import { getColor } from '@/lib/utils';

const ContactList = ({ contacts, isChannel = false }) => {
	const {
		selectedChatData,
		setSelectedChatType,
		setSelectedChatData,
		setSelectedChatMessages,
	} = useAppStore();

	const handleClick = (contact) => {
		if (isChannel) setSelectedChatType('channel');
		else setSelectedChatType('contact');

		setSelectedChatData(contact);
		if (selectedChatData && selectedChatData._id !== contact._id)
			setSelectedChatMessages([]);
	};

	return (
		<div className='mt-5'>
			{contacts.map((contact) => (
				<div
					key={contact._id}
					className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
						selectedChatData && selectedChatData._id === contact._id
							? 'bg-[#8417ff]/20 hover:bg-[#8417ff]/40'
							: 'hover:bg-[#f1f1f1]/10'
					}`}
					onClick={() => handleClick(contact)}
				>
					<div className='flex gap-3 items-center justify-start text-neutral-300'>
						{!isChannel && (
							<Avatar className='h-10 w-10 rounded-full overflow-hidden'>
								{contact.image ? (
									<AvatarImage
										src={contact.image}
										alt={'profile'}
										className='h-full w-full bg-black object-cover'
									/>
								) : (
									<div
										className={` ${
											selectedChatData && selectedChatData._id === contact._id
												? 'border-[2px]'
												: getColor(contact?.color)
										} uppercase h-10 w-10 text-xl border-[1px] flex items-center justify-center rounded-full`}
									>
										{contact.firstName
											? contact.firstName.split('').shift()
											: contact.email.split('').shift()}
									</div>
								)}
							</Avatar>
						)}
						{isChannel && (
							<div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full'>
								#
							</div>
						)}
						{isChannel ? (
							<span>{contact.name}</span>
						) : (
							<span>{`${contact.firstName} ${contact.lastName}`}</span>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default ContactList;
