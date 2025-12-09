import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  saveAvailability,
  getAvailability,
  deleteAvailability,
  getAvailableSlots,
  getLatestAvailability,
  quickSetupAvailability
} from '../controllers/availability.controller.js';

const router = express.Router();

// All availability routes require authentication
router.use(authenticateToken);

// Save mentor availability
router.post('/', saveAvailability);

// Quick setup - Set availability for multiple dates
router.post('/quick-setup', quickSetupAvailability);

// Get mentor availability for a specific date
router.get('/:mentorId', getAvailableSlots);

// Get latest availability for a mentor (for dashboard)
router.get('/latest/:mentorId', getLatestAvailability);

// Get all availability for authenticated mentor
router.get('/mentor/all', getAvailability);

// Delete availability
router.delete('/:availabilityId', deleteAvailability);

export default router;
