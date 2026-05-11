import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

/**
 * MessageBubble Component - Individual message display with copy functionality
 */
const MessageBubble = ({ message, isDark }) => {
  const [copied, setCopied] = useState(false);
  const isUserMessage = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`group max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg transition-all duration-200 ${
          isUserMessage
            ? isDark
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-blue-500 text-white rounded-br-none'
            : isDark
            ? 'bg-gray-800 text-gray-100 rounded-bl-none'
            : 'bg-gray-100 text-gray-900 rounded-bl-none'
        }`}
      >
        <p className="text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">
          {message.content}
        </p>

        {!isUserMessage && (
          <button
            onClick={handleCopy}
            className={`mt-2 flex items-center gap-1 text-xs px-2 py-1 rounded transition-all duration-200 opacity-0 group-hover:opacity-100 ${
              isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {copied ? (
              <>
                <Check size={12} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={12} />
                Copy
              </>
            )}
          </button>
        )}

        <span
          className={`text-xs mt-2 block ${
            isUserMessage
              ? 'text-blue-100'
              : isDark
              ? 'text-gray-500'
              : 'text-gray-500'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
