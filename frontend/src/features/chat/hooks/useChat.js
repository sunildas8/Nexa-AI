import { initializeSocketConnection } from '../service/chat.socket';
import { sendMessage, getChatMessages, getChats, deleteChat } from '../service/chat.api';
import { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage  } from '../chat.slice';
import { useDispatch } from 'react-redux';

/**
 * useChat Hook - Provides chat functionalities including socket connection, message handling, and chat management
 */

export const useChat = () => {

    const dispatch = useDispatch();

    async function handleSendMessage(message, chatId) {
        // Implementation for sending message
        try {
            const messageId = `msg-${Date.now()}-${Math.random()}`;
            const timestamp = new Date().toISOString();
            
            // If this is a new chat, create it immediately
            let targetChatId = chatId;
            if (!chatId) {
                targetChatId = `temp-${Date.now()}`;
                dispatch(createNewChat({
                    chatId: targetChatId,
                    title: message.substring(0, 30) + '...'
                }));
                dispatch(setCurrentChatId(targetChatId));
            }
            
            // Add user message IMMEDIATELY (before API call)
            dispatch(addNewMessage({
                chatId: targetChatId,
                content: message,
                role: 'user',
                id: messageId,
                timestamp: timestamp
            }));
            
            // Set loading state
            dispatch(setLoading(true));
            dispatch(setError(null));
            
            // Make API call
            const data = await sendMessage(message, chatId);
            const { aiMessage } = data;
            
            // If this was a new chat, we now have the real chat ID from server
            // For now, add AI message to the current chat
            const finalChatId = chatId || targetChatId;
            
            // Add AI response to the store
            dispatch(addNewMessage({
                chatId: finalChatId,
                content: aiMessage.content,
                role: aiMessage.role,
                timestamp: new Date().toISOString()
            }));
            
            dispatch(setLoading(false));
        } catch (error) {
            console.error('Error sending message:', error);
            dispatch(setError(error.response?.data?.message || 'Failed to send message'));
            dispatch(setLoading(false));
        }
    }

    async function handleGetChats() {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await getChats();
            const { chats } = data
            
            dispatch(setChats(chats.reduce((acc, chat) => {
                acc[chat._id] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt
                };
                return acc;
            }, {})));
            dispatch(setLoading(false));
        } catch (error) {
            console.error('Error fetching chats:', error);
            dispatch(setError(error.response?.data?.message || 'Failed to fetch chats'));
            dispatch(setLoading(false));
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        // sendMessage,
        // getChatMessages,
        // getChats,
        // deleteChat
    }
};  
