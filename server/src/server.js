import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

import authRoutes from './routes/auth.js';
import recipeRoutes from './routes/recipes.js';
import commentRoutes from './routes/comments.js';
import favoriteRoutes from './routes/favorites.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Database
if (!process.env.MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI is not set. The server will fail to connect to MongoDB.');
}

mongoose.connect(process.env.MONGODB_URI || '', {
  dbName: process.env.MONGODB_DB || 'recipeshare'
}).then(() => {
  console.log('🗄️  MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});

// Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  console.log('☁️  Cloudinary configured');
} else {
  console.warn('⚠️  Cloudinary env vars not fully set. Image uploads will fail.');
}

// Middleware
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

// Optional: support regex-based origins via CORS_REGEX env (comma-separated regex patterns)
const originRegexes = (process.env.CORS_REGEX || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
  .map(pattern => {
    try { return new RegExp(pattern); } catch { return null; }
  })
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser tools
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (originRegexes.some(rx => rx.test(origin))) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
// Note: In production we use Cloudinary. Local uploads static is kept for dev compatibility.
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/favorites', favoriteRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'RecipeShare API is running' });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL}`);
});