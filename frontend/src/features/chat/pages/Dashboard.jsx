import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import { useChat } from '../hooks/useChat';
import { setCurrentChatId, setChats, deleteChat } from '../chat.slice';
import { deleteChat as deleteChatApi } from '../service/chat.api';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';

/**
 * Dashboard Component - Main layout orchestrating all chat components
 */
const Dashboard = () => {
  const chat = useChat();
  const dispatch = useDispatch();
  const { isDark, toggleTheme } = useTheme();
  
  // Get Redux state
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);
  const { user } = useSelector((state) => state.auth);

  // Derive current messages from Redux store
  const messages = currentChatId && chats[currentChatId] 
    ? chats[currentChatId].messages 
    : [];

  // Convert chats object to array for Sidebar
  const chatHistory = Object.values(chats);

  useEffect(() => {
    if (chat?.initializeSocketConnection) {
      chat.initializeSocketConnection(); 
    }
  }, [chat]);

  const handleSendMessage = async (content) => {
    await chat.handleSendMessage(content, currentChatId);
  };
  const handleGetChats = () => {
    dispatch(chat.handleGetChats());
  };

  const handleNewChat = () => {
    dispatch(setCurrentChatId(null));
  };

  const handleLoadChat = (chatId) => {
    dispatch(setCurrentChatId(chatId));
    // Load messages for the selected chat
    chat.handleLoadChatMessages(chatId);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      // Clear all chats from Redux
      dispatch(setChats({}));
      dispatch(setCurrentChatId(null));
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      // Call API to delete the chat
      await deleteChatApi(chatId);
      
      // Dispatch Redux action to remove from state
      dispatch(deleteChat({ chatId }));
      
      // If the deleted chat is the currently selected one, reset it
      if (currentChatId === chatId) {
        dispatch(setCurrentChatId(null));
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat. Please try again.');
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      <Sidebar
        chatHistory={chatHistory}
        onNewChat={handleNewChat}
        onGetChats={handleGetChats}
        onSelectChat={handleLoadChat}
        onDeleteChat={handleDeleteChat}
        onClearHistory={handleClearHistory}
        currentChatId={currentChatId}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className={`border-b px-6 py-4 transition-colors duration-200 ${
          isDark
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-between">
            <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              NexaAI 
            </h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {user?.email ? `Logged in as ${user.email}` : 'Welcome'}
            </p>
          </div>
        </div>

        <div className={`flex flex-col overflow-scroll transition-all duration-200 my-auto ${
          messages.length === 0 ? 'justify-center' : 'flex-1'
        }`}>
          <ChatWindow messages={messages} isLoading={isLoading} isDark={isDark} />

          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;