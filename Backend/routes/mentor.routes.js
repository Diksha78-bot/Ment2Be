import { Router } from 'express';
import { 
  GetAllMentors, 
  GetMentorById, 
  GetMentorsBySkill,
  GetCarouselMentors,
  CreateOrUpdateMentorProfile,
  UploadMentorPhoto,
  RemoveMentorPhoto
} from '../controllers/mentor.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const mentorRouter = Router();

mentorRouter.get('/', GetAllMentors);
mentorRouter.get('/carousel', GetCarouselMentors);
mentorRouter.get('/:id', GetMentorById);
mentorRouter.get('/skill/:skillId', GetMentorsBySkill);

// Create or update mentor profile
mentorRouter.post('/profile', authenticateToken, CreateOrUpdateMentorProfile);

// Upload mentor profile photo
mentorRouter.post(
  '/upload-photo', 
  authenticateToken, 
  upload.single('profilePhoto'), 
  UploadMentorPhoto
);

// Remove mentor profile photo
mentorRouter.delete(
  '/upload-photo', 
  authenticateToken, 
  RemoveMentorPhoto
);

export default mentorRouter;
