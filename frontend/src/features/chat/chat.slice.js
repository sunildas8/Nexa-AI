import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload;
            state.chats[chatId] = {
                id: chatId,
                title: title || 'New Chat',
                messages: [],
                lastUpdated: new Date().toISOString(),
            };
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload;
            state.chats[chatId].messages.push({ content, role });
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage } = chatSlice.actions;
export default chatSlice.reducer;

// chats = {
//     "docker and aws": {
//         messages: [
//             {
//                 role: 'user',
//                 content: 'How do I deploy a Docker container on AWS?'
//             },
//             {
//                 role: 'ai',
//                 content: 'To deploy a Docker container on AWS, you can use Amazon Elastic Container Service (ECS) or Amazon Elastic Kubernetes Service (EKS). Here are the general steps for using ECS:'
//             },
//         ],
//         id: "docker-and-aws",
//         lastUpdated: "2024-06-01T12:00:00Z"
//     }
// }