import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});

/**
 * Send a message with streaming response
 * Returns a promise that resolves to an async iterable of stream events
 */
export const sendMessage = async(message, chatId) => {
    const response = await fetch('http://localhost:3000/api/chats/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message, chat: chatId })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Return an async iterable that parses ndjson chunks
    return {
        async *[Symbol.asyncIterator]() {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop(); // Keep incomplete line in buffer

                    for (const line of lines) {
                        if (line.trim()) {
                            try {
                                yield JSON.parse(line);
                            } catch (e) {
                                console.error('Failed to parse line:', line, e);
                            }
                        }
                    }
                }

                // Process any remaining buffer
                if (buffer.trim()) {
                    try {
                        yield JSON.parse(buffer);
                    } catch (e) {
                        console.error('Failed to parse final buffer:', buffer, e);
                    }
                }
            } finally {
                reader.releaseLock();
            }
        }
    };
}

export const getChats = async () => {
    const response = await api.get('/api/chats');
    return response.data;
}

export const getChatMessages = async (chatId) => {
    const response = await api.get(`/api/chats/${chatId}/messages`);
    return response.data;
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/delete/${chatId}`);
    return response.data;
}
