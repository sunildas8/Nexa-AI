import React from 'react';
import { MessageSquare, Settings, Moon, Sun, Trash2, SquarePen } from 'lucide-react';

/**
 * Sidebar Component - Left navigation panel with chat history and theme toggle
 */
const Sidebar = ({ 
  chatHistory = [], 
  onNewChat, 
  onSelectChat, 
  onClearHistory,
  currentChatId, 
  isDark, 
  onToggleTheme 
}) => {
  return (
    <div className={`w-64 h-screen flex flex-col border-r transition-colors duration-200 ${
      isDark 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      {/* Header */}
      <div className="p-4 border-b" style={{borderColor: isDark ? '#1f2937' : '#e5e7eb'}}>
        <div className="flex items-center gap-2 mb-4">
          <img src="Nexa_AI.png" alt="" className='w-10'/>
        </div>
        <button
          onClick={onNewChat}
          className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium text- transition-all duration-200 cursor-pointer ${
            isDark
              ? 'bg-gray-800 text-white hover:bg-gray-700'
              : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          <SquarePen size={16} />
          New Chat
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-3">
        <p className={`text-xs font-bold uppercase mb-3 tracking-wide ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Chat History
        </p>
        
        {chatHistory.length === 0 ? (
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'} text-center mt-10`}>
            No chats yet. Start a new conversation!
          </p>
        ) : (
          <div className="space-y-2">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 flex items-center gap-2 ${
                  currentChatId === chat.id
                    ? isDark
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-900'
                    : isDark
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MessageSquare size={14} className="shrink-0" />
                <span className="truncate">{chat.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="border-t p-3 space-y-2" style={{borderColor: isDark ? '#1f2937' : '#e5e7eb'}}>
        {chatHistory.length > 0 && (
          <button
            onClick={onClearHistory}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
              isDark
                ? 'text-gray-400 hover:bg-gray-800 hover:text-red-400'
                : 'text-gray-600 hover:bg-gray-200 hover:text-red-600'
            }`}
          >
            <Trash2 size={16} />
            Clear History
          </button>
        )}

        <button
          onClick={onToggleTheme}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
            isDark
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          <span className="text-sm font-medium">
            {isDark ? 'Light' : 'Dark'}
          </span>
        </button>

        <button
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
            isDark
              ? 'text-gray-400 hover:bg-gray-800'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Settings size={16} />
          Settings
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
