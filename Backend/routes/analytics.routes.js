import express from 'express';
import { getMentorAnalytics, exportAnalyticsReport } from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All analytics routes require authentication
router.use(protect);

router.get('/summary', getMentorAnalytics);
router.get('/export', exportAnalyticsReport);

export default router;
