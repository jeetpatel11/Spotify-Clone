import express from 'express';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import path from 'path';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import songRoutes from './routes/songs.route.js';
import albumRoutes from './routes/albums.route.js';
import statRoutes from './routes/stats.route.js';

import connectDB from './lib/db.js';
import { initializeSocket } from './lib/socket.js';

dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
initializeSocket(httpServer);

// ✅ CORRECT CORS ORIGIN
app.use(cors({
  origin: ['http://localhost:3000', 'https://spotifyappa.netlify.app'],
  credentials: true,
}));

// ✅ Important middleware order
app.use(cookieParser());
app.use(express.json());
app.use(clerkMiddleware());

// ✅ File Upload config
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, "tmp"),
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}));

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per minute
  message: "Too many requests, please try again later.",
});

app.use(limiter);

// ✅ API routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

// ✅ Static frontend for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
  });
}

// ✅ Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    message: process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : error.message,
  });
});

// ✅ Start server and connect DB
httpServer.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
  connectDB();
});
