import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        isAITyping: false,
        error: null,
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload;
            state.chats[chatId] = {
                id: chatId,
                title: title || 'New Chat',
                messages: [],
                lastUpdated: new Date().toISOString(),
            };
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role, id, timestamp } = action.payload;
            if (state.chats[chatId]) {
                // For AI messages (streaming), find and update existing message with same ID
                if (role === 'ai' && id) {
                    const existingMessageIndex = state.chats[chatId].messages.findIndex(msg => msg.id === id);
                    if (existingMessageIndex !== -1) {
                        // Update existing message
                        state.chats[chatId].messages[existingMessageIndex] = {
                            id,
                            content,
                            role,
                            timestamp: timestamp || new Date().toISOString()
                        };
                        return;
                    }
                }
                
                // For new messages, append to array
                state.chats[chatId].messages.push({ 
                    id: id || `msg-${Date.now()}-${Math.random()}`,
                    content, 
                    role,
                    timestamp: timestamp || new Date().toISOString()
                });
            }
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setAITyping: (state, action) => {
            state.isAITyping = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        deleteChat: (state, action) => {
            const { chatId } = action.payload;
            delete state.chats[chatId];
        },
        setMessagesForChat: (state, action) => {
            const { chatId, messages } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages = messages;
            }
        }
    }
})

export const { setChats, setCurrentChatId, setLoading, setAITyping, setError, createNewChat, addNewMessage, deleteChat, setMessagesForChat } = chatSlice.actions;
export default chatSlice.reducer;