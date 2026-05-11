import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});

/**
 * Send a message — creates a new chat if no chatId is provided.
 * Returns: { userMessage, AIMessage, title, chat }
 */
export async function sendMessage({ content, chatId = null }) {
    const response = await api.post('/api/chat/send', { content, chatId });
    return response.data;
}

/** Get all chats for the logged-in user. Returns: { chats: [...] } */
export async function getChats() {
    const response = await api.get('/api/chat');
    return response.data;
}

/** Get all messages for a specific chat. Returns: { messages: [...] } */
export async function getChatMessages(chatId) {
    const response = await api.get(`/api/chat/${chatId}/messages`);
    return response.data;
}
