import { Server } from 'socket.io';

var io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: 'https://nexa-ai-chatgpt.vercel.app',
            credentials: true
        },
        transports: ['websocket', 'polling'],
        allowEIO3: true,
        pingInterval: 25000,
        pingTimeout: 60000
    })

    console.log("✅ Socket.io server is Running");
    io.on('connection', (socket) => {
        console.log('🔌 New client connected:', socket.id);
    });
}

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }

    return io;
}