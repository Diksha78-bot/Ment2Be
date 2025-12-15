import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage' // Use postmessage for popup mode
);

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

export async function Register(req, res) {
  try {
    const { name, email, password, role, phoneNumber, bio, hourlyRate } = req.validatedData;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      ...(phoneNumber && { phoneNumber }),
      ...(bio && { bio }),
      ...(hourlyRate && role === 'mentor' && { hourlyRate })
    });

    if (user) {      
      const token = generateToken(user._id, user.role);
      
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        ...(user.hourlyRate && { hourlyRate: user.hourlyRate }),
        token
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid user data"
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function Login(req, res) {
  try {
    const { email, password } = req.validatedData;
    const normalizedEmail = email.toLowerCase().trim();

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${escapeRegex(normalizedEmail)}$`, 'i') } 
    }).select('+password');

    if (!user) {
      console.log("User not found for email:", normalizedEmail);
      return res.status(401).json({"success":false,"message":"Invalid email or password"});
    }

    if (!user.password) {
      console.log("User has no password (Google OAuth user):", user._id);
      return res.status(401).json({"success":false,"message":"Please use Google Sign In for this account"});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({"success":false,"message":"Invalid email or password"});
    }

    const token = generateToken(user._id, user.role);
    const { password: _, ...userData } = user.toObject();
    
    return res.status(200).json({
      success: true,
      ...userData,
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({"success":false,"message":"Server error during login", "error": process.env.NODE_ENV === 'development' ? error.message : undefined});
  }
}

export async function GoogleLogin(req, res) {
  try {
    const { code, role } = req.body;
    
    if (!code) {
      return res.status(400).json({ success: false, message: "Google code is required" });
    }

    const { tokens } = await client.getToken(code);
    const idToken = tokens.id_token;

    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { name, email, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (user) {
      // Link Google ID if not present
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create new user
      const userRole = role || 'student';
      
      user = await User.create({
        name,
        email,
        googleId,
        role: userRole,
      });
    }

    const jwtToken = generateToken(user._id, user.role);
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      success: true,
      ...userData,
      token: jwtToken
    });
  } catch (error) {
    console.error("Google Login error:", error);
    res.status(401).json({
      success: false,
      message: "Google authentication failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export function Logout(req, res) {
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
}