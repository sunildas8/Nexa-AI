import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

/**
 * ChatWindow Component - Main chat message display area with auto-scroll
 */
const ChatWindow = ({ messages, isLoading, isDark }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-6 transition-colors duration-200 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            What’s on your mind today?
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Start a conversation by typing your question below
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 overflow-y-auto p-6 transition-colors duration-200 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="max-w-4xl mx-auto">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isDark={isDark}
          />
        ))}

        {isLoading && <TypingIndicator isDark={isDark} />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
