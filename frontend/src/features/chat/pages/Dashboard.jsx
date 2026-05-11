import React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import { useChatState } from '../hooks/useChatState';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';

/**
 * Dashboard Component - Main layout orchestrating all chat components
 */
const Dashboard = () => {
  const { isDark, toggleTheme } = useTheme();
  const {
    messages,
    isLoading,
    chatHistory,
    currentChatId,
    addUserMessage,
    simulateAIResponse,
    startNewChat,
    loadChat,
    clearHistory,
  } = useChatState();

  const { user } = useSelector((state) => state.auth);

  const handleSendMessage = async (content) => {
    addUserMessage(content);
    await simulateAIResponse(content);
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      <Sidebar
        chatHistory={chatHistory}
        onNewChat={startNewChat}
        onSelectChat={loadChat}
        onClearHistory={clearHistory}
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

        <div className={`flex flex-col overflow-visible transition-all duration-200 my-auto  ${
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