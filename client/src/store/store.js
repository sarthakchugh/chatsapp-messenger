import { create } from 'zustand';
import { createAuthSlice } from './slices/authSlice';
import { createChatSlice } from './slices/chatSlice';
import { createChannelSlice } from './slices/channelSlice';

export const useAppStore = create((...a) => ({
	...createAuthSlice(...a),
	...createChatSlice(...a),
	...createChannelSlice(...a),
}));
