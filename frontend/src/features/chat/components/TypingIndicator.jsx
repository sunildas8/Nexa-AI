import React from 'react';

/**
 * TypingIndicator Component - Animated typing indicator for AI responses
 */
const TypingIndicator = ({ isDark }) => {
  return (
    <div className="flex items-center gap-1 mb-4">
      <div
        className={`px-4 py-3 rounded-lg rounded-bl-none ${
          isDark ? 'bg-gray-800' : 'bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full animate-bounce ${
              isDark ? 'bg-gray-500' : 'bg-gray-400'
            }`}
            style={{ animationDelay: '0s' }}
          />
          <div
            className={`w-2 h-2 rounded-full animate-bounce ${
              isDark ? 'bg-gray-500' : 'bg-gray-400'
            }`}
            style={{ animationDelay: '0.2s' }}
          />
          <div
            className={`w-2 h-2 rounded-full animate-bounce ${
              isDark ? 'bg-gray-500' : 'bg-gray-400'
            }`}
            style={{ animationDelay: '0.4s' }}
          />
        </div>
      </div>
      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
        AI is typing...
      </span>
    </div>
  );
};

export default TypingIndicator;
