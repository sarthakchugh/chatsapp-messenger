export const createChannelSlice = (set, get) => ({
	channels: [],
	setChannels: (channels) => set({ channels }),
	addChannel: (channel) => {
		const channels = get().channels;
		set({ channels: [channel, ...channels] });
	},
	addChannelToList: (message) => {
		const channels = get().channels;
		const data = channels.find((channel) => channel.id === message.channelId);
		const index = channels.findIndex(
			(channel) => channel.id === message.channelId
		);
		if (index !== -1 && index !== undefined) {
			channels.splice(index, 1);
			channels.unshift(data);
		}
	},
});
