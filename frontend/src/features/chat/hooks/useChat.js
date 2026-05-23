import { initializeSocketConnection } from '../service/chat.socket';
import { sendMessage, getChatMessages, getChats, deleteChat } from '../service/chat.api';
import { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, deleteChat as deleteChatFromStore  } from '../chat.slice';
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
            let isNewChat = false;
            const chatTitle = message.substring(0, 30) + '...';
            
            if (!chatId) {
                targetChatId = `temp-${Date.now()}`;
                isNewChat = true;
                dispatch(createNewChat({
                    chatId: targetChatId,
                    title: chatTitle
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
            const { aiMessage, chat } = data;
            
            // If this was a new chat, update with the real chat ID from server
            let finalChatId = chatId || targetChatId;
            if (isNewChat && chat && chat._id) {
                finalChatId = chat._id;
                // Create the chat with real ID
                dispatch(createNewChat({
                    chatId: finalChatId,
                    title: chatTitle
                }));
                // Add user message to real chat
                dispatch(addNewMessage({
                    chatId: finalChatId,
                    content: message,
                    role: 'user',
                    id: messageId,
                    timestamp: timestamp
                }));
                // Delete the temporary chat from Redux
                dispatch(deleteChatFromStore({
                    chatId: targetChatId
                }));
                // Update Redux with the real chat ID
                dispatch(setCurrentChatId(finalChatId));
            }
            
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
