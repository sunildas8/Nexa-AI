import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useTheme } from '../hooks/useTheme';
import { useChat } from '../hooks/useChat';
import { setCurrentChatId, setChats, deleteChat } from '../chat.slice';
import { deleteChat as deleteChatApi } from '../service/chat.api';
import { setUser } from '../../auth/auth.slice';
import { ChevronDown, LogOut, Menu, X } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile, visible on md and up */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
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
          onMobileSidebarClose={() => setSidebarOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Mobile Menu Button */}
        <div className={`border-b px-4 sm:px-6 py-3 sm:py-4 transition-colors duration-200 ${
          isDark
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-between items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${
                isDark
                  ? 'hover:bg-gray-800 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <h1 className={`text-lg sm:text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              NexaAI 
            </h1>
            
            {/* Profile Pill with Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full transition-colors duration-200 cursor-pointer ${
                  isDark
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {/* Avatar Circle */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm ${
                  isDark ? 'bg-blue-600' : 'bg-blue-500'
                }`}>
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                
                {/* Username - Hidden on small screens */}
                <span className={`hidden sm:inline text-xs sm:text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  {user?.username || 'User'}
                </span>
                
                {/* Dropdown Arrow */}
                <ChevronDown size={16} className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className={`absolute right-0 mt-2 w-40 sm:w-48 rounded-lg shadow-lg z-50 transition-all duration-200 ${
                  isDark
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-200'
                }`}>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowProfileMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer ${
                      isDark
                        ? 'text-red-400 hover:bg-gray-700 rounded-lg'
                        : 'text-red-600 hover:bg-gray-100 rounded-lg'
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

        {/* Chat Area */}
        <div className={`flex flex-col overflow-auto transition-all duration-200 my-auto ${
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