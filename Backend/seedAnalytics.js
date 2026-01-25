import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';
import Booking from './models/booking.model.js';
import MentorProfile from './models/mentorProfile.model.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // 1. Find Mentor and Student
        const mentor = await User.findOne({ email: 'arshchouhan004@gmail.com' });
        const student = await User.findOne({ email: 'student@example.com' }) || await User.findOne({ role: 'student' });

        if (!mentor || !student) {
            console.error('Could not find a mentor or student to seed data.');
            process.exit(1);
        }

        console.log(`Seeding data for Mentor: ${mentor.email} and Student: ${student.email}`);

        // 2. Clear old test bookings (optional, but good for clean dashboard)
        // await Booking.deleteMany({ mentor: mentor._id, sessionDescription: 'Seed Data' });

        // 3. Create mock bookings over the last 30 days
        const bookings = [];
        const now = new Date();

        for (let i = 0; i < 20; i++) {
            const date = new Date();
            date.setDate(now.getDate() - Math.floor(Math.random() * 30));

            bookings.push({
                student: student._id,
                mentor: mentor._id,
                sessionTitle: i % 2 === 0 ? 'Backend System Design' : 'Frontend Performance Tuning',
                sessionDescription: 'Mocked session for dashboard visualization',
                sessionDate: date,
                sessionTime: '10:00 AM',
                duration: 60,
                status: 'completed',
                price: Math.floor(Math.random() * 50) + 20, // $20 - $70
                currency: 'USD',
                paymentStatus: 'paid',
                topics: ['JavaScript', 'Node.js', 'React'],
                sessionCompleted: true
            });
        }

        // Add some recurring bookings for retention rate simulation
        for (let i = 0; i < 5; i++) {
            const date = new Date();
            date.setDate(now.getDate() - (i * 7));

            bookings.push({
                student: student._id,
                mentor: mentor._id,
                sessionTitle: 'Weekly Career Coaching',
                sessionDate: date,
                sessionTime: '02:00 PM',
                duration: 45,
                status: 'completed',
                price: 50,
                paymentStatus: 'paid',
                sessionCompleted: true
            });
        }

        await Booking.insertMany(bookings);
        console.log(`Successfully created ${bookings.length} mock bookings.`);

        // 4. Update Mentor Profile Skills
        let profile = await MentorProfile.findOne({ user: mentor._id });
        if (!profile) {
            profile = new MentorProfile({ user: mentor._id });
        }

        profile.skills = ['Node.js', 'React', 'MongoDB', 'System Design', 'AWS', 'Docker'];
        profile.company = 'Tech Innovators Inc.';
        profile.headline = 'Senior Staff Engineer & Mentorship Advocate';
        profile.bio = 'I have over 8 years of experience in full-stack development. I love helping junior developers find their path in the tech world.';
        profile.experience = 8;
        await profile.save();
        console.log('Updated mentor profile skills.');

        console.log('Seeding complete! Restarting server...');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
