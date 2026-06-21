import { io } from "socket.io-client";

let socket = null;

export const initializeSocketConnection = () => {
    // Prevent multiple socket connections
    if (socket && socket.connected) {
        console.log('Socket already connected');
        return socket;
    }

    try {
        socket = io('https://nexa-ai-odre.vercel.app', {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 3,
            upgrade: false
        })

        socket.on('connect', () => {
            console.log('✅ Connected to Socket.io server');
        });

        socket.on('connect_error', (error) => {
            console.warn('⚠️ Socket.io connection error:', error.message);
        });

        socket.on('disconnect', (reason) => {
            console.log('❌ Disconnected from Socket.io server:', reason);
        });

        return socket;
    } catch (error) {
        console.error('Failed to initialize socket connection:', error);
        return null;
    }
}

export const getSocket = () => socket;