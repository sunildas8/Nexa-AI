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
            dispatch(setLoading(true));
            dispatch(setError(null));
            
            const data = await sendMessage(message, chatId);
            const { chat, aiMessage } = data;
            
            // If this is a new chat, create it in Redux store
            if (!chatId && chat) {
                dispatch(createNewChat({
                    chatId: chat._id,
                    title: chat.title
                }));
                dispatch(setCurrentChatId(chat._id));
            }
            
            // Add user message to the store
            dispatch(addNewMessage({
                chatId: chat._id,
                content: message,
                role: 'user'
            }));
            
            // Add AI response to the store
            dispatch(addNewMessage({
                chatId: chat._id,
                content: aiMessage.content,
                role: aiMessage.role
            }));
            
            dispatch(setLoading(false));
        } catch (error) {
            console.error('Error sending message:', error);
            dispatch(setError(error.response?.data?.message || 'Failed to send message'));
            dispatch(setLoading(false));
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        // sendMessage,
        // getChatMessages,
        // getChats,
        // deleteChat
    }
};  
