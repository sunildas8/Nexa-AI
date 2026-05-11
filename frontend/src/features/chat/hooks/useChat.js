import { useDispatch, useSelector } from 'react-redux';
import { initializeSocketConnection } from '../service/chat.socket';
import {
    fetchChats,
    fetchMessages,
    sendChatMessage,
    setActiveChat,
    startNewChat,
} from '../chat.slice';

export const useChat = () => {
    const dispatch = useDispatch();
    const { chats, activeChat, messages, isTyping, loading } = useSelector(
        (state) => state.chat
    );

    const handleFetchChats = () => dispatch(fetchChats());

    const handleSelectChat = (chat) => {
        dispatch(setActiveChat(chat));
        dispatch(fetchMessages(chat._id));
    };

    const handleNewChat = () => dispatch(startNewChat());

    const handleSendMessage = (content) => {
        dispatch(sendChatMessage({ content, chatId: activeChat?._id ?? null }));
    };

    return {
        chats,
        activeChat,
        messages,
        isTyping,
        loading,
        initializeSocketConnection,
        handleFetchChats,
        handleSelectChat,
        handleNewChat,
        handleSendMessage,
    };
};  
