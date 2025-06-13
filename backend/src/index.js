import express from 'express';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import path from 'path';
import fielupload from 'express-fileupload';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import songRoutes from './routes/songs.route.js';
import albumRoutes from './routes/albums.route.js';
import statRoutes from './routes/stats.route.js';
import connectDB from './lib/db.js';
dotenv.config();


const __dirname = path.resolve();
const app = express();
const PORT=process.env.PORT ;

app.use(express.json());
app.use(clerkMiddleware());
app.use(fielupload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname,"tmp"),
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
}));


app.use("/api/users", userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/songs"  ,songRoutes);
app.use("/api/albums",albumRoutes);
app.use("/api/stats",statRoutes)


app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({message:process.env.NODE_ENV==="production"?"Internal Server Error":error.message});
});


app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
  connectDB();
});