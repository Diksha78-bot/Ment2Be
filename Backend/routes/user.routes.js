import { Router } from "express";
import { GetCurrentUser, UpdateCurrentUser } from "../controllers/user.controller.js";
import express from 'express';
import User from '../models/user.model.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const userRouter = Router();

// GET user profile
userRouter.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        hourlyRate: user.hourlyRate
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

userRouter.get("/me", GetCurrentUser);
userRouter.patch('/me', UpdateCurrentUser);




export default userRouter;