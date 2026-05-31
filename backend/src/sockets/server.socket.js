import { Server } from 'socket.io';

var io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true
        }
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