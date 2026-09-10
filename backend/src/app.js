import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://nexa-ai-chatgpt.vercel.app',
].filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  return allowedOrigins.includes(origin) ||
    /^https:\/\/nexa-ai-chatgpt(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(origin);
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

// Connect to database
export const initializeDB = connectDB;

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running', status: 'OK' });
});

app.use("/api/auth", authRouter)
app.use("/api/chats", chatRouter)

export default app;
