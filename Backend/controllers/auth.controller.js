import zod from "zod";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


const registerSchema = zod.object({
  name: zod.string(),
  role: zod.enum(["mentor", "student"]),
  email: zod.email(),
  password: zod.string().min(6).max(100),
  bio: zod.string().optional(),
  hourlyRate: zod.number().optional(),
});


export function Register(req, res) {
    try {
        
    } catch (error) {
        
    }

}


export function Login(req, res) {
    
}



export function Logout(req, res) {
    
}