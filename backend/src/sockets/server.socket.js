import { Server } from 'socket.io';

var io;
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://nexa-ai-chatgpt.vercel.app',
].filter(Boolean);

const isAllowedOrigin = (origin) => allowedOrigins.includes(origin) ||
    /^https:\/\/nexa-ai-chatgpt(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(origin);

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
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