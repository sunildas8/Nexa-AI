import React, { useState } from 'react';
import { MessageSquare, Settings, Moon, Sun, Trash2, SquarePen, MoreHorizontal } from 'lucide-react';

/**
 * Sidebar Component - Left navigation panel with chat history and theme toggle
 */
const Sidebar = ({ 
  chatHistory = [], 
  onNewChat, 
  onSelectChat, 
  onDeleteChat,
  currentChatId, 
  isDark, 
  onToggleTheme 
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const handleMenuClick = (e, chatId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 5,
      left: rect.right - 20
    });
    setOpenDropdown(openDropdown === chatId ? null : chatId);
  };
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
              <div
                key={chat.id}
                className="relative group"
              >
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all duration-150 flex items-center justify-between gap-2 cursor-pointer ${
                    currentChatId === chat.id
                      ? isDark
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                      : isDark
                      ? 'text-gray-300 hover:bg-gray-800'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="truncate pr-7">{chat.title}</span>
                </button>
                
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => handleMenuClick(e, chat.id)}
                    className={`p-1 rounded-lg transition-all duration-200 ${
                      isDark
                        ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="border-t p-3 space-y-2" style={{borderColor: isDark ? '#1f2937' : '#e5e7eb'}}>
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

      {/* Dropdown Menu */}
      {openDropdown && (
        <div
          className={`fixed rounded-lg shadow-lg z-50 w-32 ${
            isDark
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-300'
          }`}
          style={{
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`
          }}
        >
          <button
            onClick={() => {
              onDeleteChat(openDropdown);
              setOpenDropdown(null);
            }}
            className={`w-full text-left px-3 py-2 flex items-center gap-2 text-sm rounded-lg transition-all duration-200 ${
              isDark
                ? 'text-red-400 hover:bg-gray-700'
                : 'text-red-600 hover:bg-gray-100'
            }`}
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
