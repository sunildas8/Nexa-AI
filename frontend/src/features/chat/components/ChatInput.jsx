import React, { useRef, useEffect, useState } from 'react';
import { Send, Plus, Mic, ChevronDown } from 'lucide-react';

/**
 * ChatInput Component - Modern Gemini-style input with tools and voice options
 */
const ChatInput = ({ onSendMessage, isLoading, isDark }) => {
  const [message, setMessage] = useState('');
  const [showTools, setShowTools] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Standard');
  const textareaRef = useRef(null);
  const toolsRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 100) + 'px';
    }
  }, [message]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setShowTools(false);
      }
      if (modelRef.current && !modelRef.current.contains(e.target)) {
        setShowModel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`p-4 transition-colors duration-200 ${
      isDark
        ? 'bg-gray-900'
        : 'bg-white'
    }`}>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {/* Main Input Bar */}
        <div className={`flex items-center gap-3 px-4 py-3 rounded-full border transition-all duration-200 ${
          isDark
            ? 'bg-gray-800 border-gray-800'
            : 'bg-gray-100 border-gray-300'
        }`}>
          {/* Plus/Tools Button */}
          <div className="relative" ref={toolsRef}>
            <button
              type="button"
              onClick={() => setShowTools(!showTools)}
              className={`shrink-0 p-2 rounded-full transition-all duration-200 cursor-pointer ${
                isDark
                  ? 'text-gray-400 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Plus size={20} />
            </button>
            
            {showTools && (
              <div className={`absolute top-full left-0 mt-2 rounded-lg shadow-lg py-2 min-w-40 z-10 ${
                isDark
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200'
              }`}>
                <button type="button" className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  isDark
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}>
                  📎 Upload file
                </button>
                <button type="button" className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  isDark
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}>
                  🔗 Web search
                </button>
              </div>
            )}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Nexa AI..."
            className={`flex-1 resize-none outline-none text-sm font-medium max-h-24 bg-transparent ${
              isDark
                ? 'text-white placeholder-gray-500'
                : 'text-gray-900 placeholder-gray-500'
            }`}
            disabled={isLoading}
            rows="1"
          />

          {/* Model Selector */}
          <div className="relative hidden sm:block" ref={modelRef}>
            <button
              type="button"
              onClick={() => setShowModel(!showModel)}
              className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {selectedModel}
              <ChevronDown size={14} />
            </button>

            {showModel && (
              <div className={`absolute top-full right-0 mt-2 rounded-lg shadow-lg py-2 min-w-44 z-10  ${
                isDark
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200'
              }`}>
                {['Standard', 'Advanced', 'Thinking'].map((model) => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => {
                      setSelectedModel(model);
                      setShowModel(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                      selectedModel === model
                        ? isDark
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-900'
                        : isDark
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Voice Button */}
          <button
            type="button"
            disabled={isLoading}
            className={`shrink-0 p-2 rounded-full transition-all duration-200 cursor-pointer ${
              isLoading
                ? isDark
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  : 'text-gray-600 hover:bg-gray-200'
                : isDark
                  ? 'text-gray-400 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Mic size={20} />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`shrink-0 p-2 rounded-full transition-all duration-200 cursor-pointer ${
              !message.trim() || isLoading
                ? isDark
                  ? 'text-gray-700 cursor-not-allowed'
                  : 'text-gray-400 cursor-not-allowed'
                : isDark
                ? 'text-blue-400 hover:bg-gray-800'
                : 'text-blue-500 hover:bg-gray-200'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
      
    </div>
  );
};

export default ChatInput;
