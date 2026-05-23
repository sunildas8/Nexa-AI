import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

/**
 * MessageBubble Component - Individual message display with copy functionality
 */
const MessageBubble = ({ message, isDark }) => {
  const [copied, setCopied] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  const isUserMessage = message.role === 'user';

  // Typing effect for AI messages
  useEffect(() => {
    if (isUserMessage) {
      setDisplayedContent(message.content);
      return;
    }

    let index = 0;
    const typingSpeed = 5; // milliseconds per character
    const timer = setInterval(() => {
      if (index < message.content.length) {
        setDisplayedContent(message.content.substring(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [message.content, isUserMessage]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`group max-w-full lg:max-w-full xl:max-w-full px-4 py-3 rounded-lg transition-all duration-200 ${
          isUserMessage
            ? isDark
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-blue-500 text-white rounded-br-none'
            : isDark
            ? ' text-gray-100 rounded-bl-none'
            : ' text-gray-900 rounded-bl-none'
        }`}
      >
        {isUserMessage ? (
          <p className="text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">
            {message.content}
          </p>
        ) : (
          <div className="text-sm leading-relaxed max-w-none">
            <ReactMarkdown
              components={{
                h1: (props) => (
                  <h1 className={`text-lg font-bold mt-3 mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`} {...props} />
                ),
                h2: (props) => (
                  <h2 className={`text-base font-bold mt-2 mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`} {...props} />
                ),
                h3: (props) => (
                  <h3 className={`text-sm font-bold mt-2 mb-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`} {...props} />
                ),
                p: (props) => (
                  <p className={`mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`} {...props} />
                ),
                ul: (props) => (
                  <ul className={`list-disc list-inside mb-2 space-y-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`} {...props} />
                ),
                ol: (props) => (
                  <ol className={`list-decimal list-inside mb-2 space-y-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`} {...props} />
                ),
                li: (props) => (
                  <li className="ml-2" {...props} />
                ),
                code: ({ inline, ...props }) =>
                  inline ? (
                    <code className={`px-2 py-0.5 rounded text-xs font-mono ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'}`} {...props} />
                  ) : (
                    <code className={`block px-3 py-2 rounded my-2 text-xs font-mono overflow-x-auto ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'}`} {...props} />
                  ),
                pre: (props) => (
                  <pre className={`block p-3 rounded my-2 overflow-x-auto font-mono text-xs ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} {...props} />
                ),
                blockquote: (props) => (
                  <blockquote className={`border-l-4 pl-3 my-2 italic ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`} {...props} />
                ),
                a: (props) => (
                  <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                ),
                table: (props) => (
                  <table className={`table-auto border-collapse my-2 text-xs ${isDark ? 'border-gray-600' : 'border-gray-300'}`} {...props} />
                ),
                th: (props) => (
                  <th className={`border px-2 py-1 font-bold ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-200'}`} {...props} />
                ),
                td: (props) => (
                  <td className={`border px-2 py-1 ${isDark ? 'border-gray-600' : 'border-gray-300'}`} {...props} />
                ),
              }}
            >
              {displayedContent}
            </ReactMarkdown>
          </div>
        )}

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
