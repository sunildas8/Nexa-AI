import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    sendMessage as sendMessageApi,
    getChats,
    getChatMessages,
} from './service/chat.api';

/* ─── Async Thunks ─── */

export const fetchChats = createAsyncThunk(
    'chat/fetchChats',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getChats();
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch chats');
        }
    }
);

export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async (chatId, { rejectWithValue }) => {
        try {
            const data = await getChatMessages(chatId);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch messages');
        }
    }
);

export const sendChatMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ content, chatId }, { rejectWithValue }) => {
        try {
            const data = await sendMessageApi({ content, chatId });
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to send message');
        }
    }
);

/* ─── Slice ─── */

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: [],          // sidebar history list
        activeChat: null,   // currently open chat object
        messages: [],       // messages in the active chat
        isTyping: false,    // typing indicator
        loading: false,
        error: null,
    },
    reducers: {
        setActiveChat(state, action) {
            state.activeChat = action.payload;
            state.messages = [];
        },
        startNewChat(state) {
            state.activeChat = null;
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        /* fetchChats */
        builder
            .addCase(fetchChats.pending, (state) => { state.loading = true; })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.loading = false;
                state.chats = action.payload.chats ?? action.payload ?? [];
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* fetchMessages */
        builder
            .addCase(fetchMessages.pending, (state) => { state.loading = true; })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload.messages ?? action.payload ?? [];
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* sendChatMessage */
        builder
            .addCase(sendChatMessage.pending, (state, action) => {
                state.isTyping = true;
                // Optimistically add the user's message immediately
                state.messages.push({
                    _id: `temp-${Date.now()}`,
                    role: 'user',
                    content: action.meta.arg.content,
                    createdAt: new Date().toISOString(),
                });
            })
            .addCase(sendChatMessage.fulfilled, (state, action) => {
                state.isTyping = false;
                const { userMessage, AIMessage, chat } = action.payload;

                // Remove the optimistic message and replace with real ones
                state.messages = state.messages.filter((m) => !m._id.startsWith('temp-'));
                if (userMessage) state.messages.push(userMessage);
                if (AIMessage) state.messages.push(AIMessage);

                // Update or insert the chat in the sidebar list
                if (chat) {
                    state.activeChat = chat;
                    const idx = state.chats.findIndex((c) => c._id === chat._id);
                    if (idx === -1) state.chats.unshift(chat);
                    else state.chats[idx] = chat;
                }
            })
            .addCase(sendChatMessage.rejected, (state, action) => {
                state.isTyping = false;
                state.error = action.payload;
                // Roll back optimistic message
                state.messages = state.messages.filter((m) => !m._id.startsWith('temp-'));
            });
    },
});

export const { setActiveChat, startNewChat } = chatSlice.actions;
export default chatSlice.reducer;
