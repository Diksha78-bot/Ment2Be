import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from './models/booking.model.js';

dotenv.config();

const test = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const mentorId = '69175ec6392f419e12fc04f6';

    // Test overall summary
    const overallStats = await Booking.aggregate([
        {
            $match: {
                mentor: new mongoose.Types.ObjectId(mentorId),
                status: 'completed'
            }
        },
        {
            $group: {
                _id: null,
                totalEarnings: { $sum: "$price" },
                totalSessions: { $sum: 1 }
            }
        }
    ]);

    console.log('Overall Stats:', overallStats);

    // Test timeframe stats
    const timeframe = 'last30days';
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const stats = await Booking.aggregate([
        {
            $match: {
                mentor: new mongoose.Types.ObjectId(mentorId),
                status: 'completed',
                sessionDate: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$sessionDate" },
                    month: { $month: "$sessionDate" },
                    day: { $dayOfMonth: "$sessionDate" }
                },
                dailyEarnings: { $sum: "$price" },
                sessionCount: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    console.log('Timeframe Stats Count:', stats.length);
    process.exit(0);
};

test();
