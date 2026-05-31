import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useTheme } from '../hooks/useTheme';
import { useChat } from '../hooks/useChat';
import { setCurrentChatId, setChats, deleteChat } from '../chat.slice';
import { deleteChat as deleteChatApi } from '../service/chat.api';
import { setUser } from '../../auth/auth.slice';
import { ChevronDown, LogOut } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';

/**
 * Dashboard Component - Main layout orchestrating all chat components
 */
const Dashboard = () => {
  const chat = useChat();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  
  // Get Redux state
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);
  const isAITyping = useSelector((state) => state.chat.isAITyping);
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

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showProfileMenu]);

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

  const handleLogout = () => {
    dispatch(setUser(null));
    navigate('/login');
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
          <div className="flex justify-between items-center">
            <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              NexaAI 
            </h1>
            
            {/* Profile Pill with Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-full transition-colors duration-200 ${
                  isDark
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {/* Avatar Circle */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                  isDark ? 'bg-blue-600' : 'bg-blue-500'
                }`}>
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                
                {/* Username */}
                <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  {user?.username || 'User'}
                </span>
                
                {/* Dropdown Arrow */}
                <ChevronDown size={16} className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 transition-all duration-200 ${
                  isDark
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-200'
                }`}>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowProfileMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-200 hover:rounded-lg ${
                      isDark
                        ? 'text-red-400 hover:bg-gray-700'
                        : 'text-red-600 hover:bg-gray-100'
                    }`}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`flex flex-col overflow-scroll transition-all duration-200 my-auto ${
          messages.length === 0 ? 'justify-center' : 'flex-1'
        }`}>
          <ChatWindow messages={messages} isLoading={isLoading} isAITyping={isAITyping} isDark={isDark} />

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