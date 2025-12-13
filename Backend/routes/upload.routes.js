import express from 'express';
import multer from 'multer';
import { uploadVideo, uploadImage } from '../controllers/upload.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Upload video endpoint
router.post('/video', authenticateToken, upload.single('video'), uploadVideo);

// Upload image endpoint
router.post('/image', authenticateToken, upload.single('image'), uploadImage);

export default router;
