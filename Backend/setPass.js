import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';

dotenv.config();

const updatePassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'arshchouhan004@gmail.com' });
        if (user) {
            user.password = 'password123';
            await user.save();
            console.log('Password updated successfully for arshchouhan004@gmail.com');
        } else {
            console.log('User not found');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updatePassword();
