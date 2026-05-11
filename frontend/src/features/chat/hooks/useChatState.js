import { useState, useCallback } from 'react';

/**
 * useChatState Hook - Manages chat messages, loading state, and chat history
 */
export const useChatState = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addUserMessage = useCallback((content) => {
    const newMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, []);

  const addAIMessage = useCallback((content) => {
    const newMessage = {
      id: generateId(),
      role: 'ai',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, []);

  const simulateAIResponse = useCallback(() => {
    return new Promise((resolve) => {
      setIsLoading(true);
      setTimeout(() => {
        const responses = [
          'That\'s an interesting question! Let me break that down for you...',
          'Great point! Here\'s what I think about this...',
          'Based on what you asked, I believe...',
          'That\'s a complex topic. Let me explain...',
          'Excellent question! Here\'s the answer...',
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        addAIMessage(response);
        setIsLoading(false);
        resolve();
      }, 1500);
    });
  }, [addAIMessage]);

  const saveChat = useCallback((title) => {
    const chatId = generateId();
    const newChat = {
      id: chatId,
      title: title || messages[0]?.content?.substring(0, 30) || 'New Chat',
      messages: [...messages],
      timestamp: new Date(),
    };
    setChatHistory((prev) => [newChat, ...prev]);
    setCurrentChatId(chatId);
    return newChat;
  }, [messages]);

  const startNewChat = useCallback(() => {
    if (messages.length > 0) {
      saveChat();
    }
    setMessages([]);
    setCurrentChatId(null);
  }, [messages, saveChat]);

  const loadChat = useCallback((chatId) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
    }
  }, [chatHistory]);

  const clearHistory = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      setChatHistory([]);
      setMessages([]);
      setCurrentChatId(null);
    }
  }, []);

  return {
    messages,
    isLoading,
    chatHistory,
    currentChatId,
    addUserMessage,
    addAIMessage,
    simulateAIResponse,
    startNewChat,
    loadChat,
    clearHistory,
  };
};
