import Booking from '../models/booking.model.js';
import Review from '../models/review.model.js';
import MentorProfile from '../models/mentorProfile.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';
import { generateMentorReport } from '../services/reportingService.js';

export const getMentorAnalytics = async (req, res) => {
    try {
        const mentorId = req.user.id || req.user._id;
        const { timeframe = 'last30days' } = req.query;

        let startDate = new Date();
        if (timeframe === 'last7days') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (timeframe === 'last90days') {
            startDate.setDate(startDate.getDate() - 90);
        } else {
            startDate.setDate(startDate.getDate() - 30); // Default 30 days
        }

        // 1. Monthly/Timeframe Earnings & Session Counts
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
                    dailyEarnings: { $sum: "$amount" },
                    sessionCount: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        // 2. Student Retention (Repeated students)
        const retentionData = await Booking.aggregate([
            {
                $match: {
                    mentor: new mongoose.Types.ObjectId(mentorId),
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: "$student",
                    bookingCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    totalStudents: { $sum: 1 },
                    recurringStudents: {
                        $sum: { $cond: [{ $gt: ["$bookingCount", 1] }, 1, 0] }
                    }
                }
            }
        ]);

        const retentionRate = retentionData.length > 0
            ? Math.round((retentionData[0].recurringStudents / retentionData[0].totalStudents) * 100)
            : 0;

        // 3. Overall Summary
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
                    totalEarnings: { $sum: "$amount" },
                    totalSessions: { $sum: 1 }
                }
            }
        ]);

        // 4. Skill Area Popularity (based on session topics/tags if available, or just mentor skills)
        const mentorProfile = await MentorProfile.findOne({ user: mentorId });

        res.status(200).json({
            success: true,
            data: {
                timeframeStats: stats.map(s => ({
                    date: `${s._id.year}-${s._id.month}-${s._id.day}`,
                    earnings: s.dailyEarnings,
                    sessions: s.sessionCount
                })),
                summary: {
                    totalEarnings: overallStats[0]?.totalEarnings || 0,
                    totalSessions: overallStats[0]?.totalSessions || 0,
                    retentionRate,
                    studentCount: retentionData[0]?.totalStudents || 0
                },
                skills: mentorProfile?.skills || []
            }
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch analytics', error: error.message });
    }
};

export const exportAnalyticsReport = async (req, res) => {
    try {
        const mentorId = req.user.id || req.user._id;
        const user = await User.findById(mentorId);

        // Fetch snapshot of data for the report
        const overallStats = await Booking.aggregate([
            { $match: { mentor: new mongoose.Types.ObjectId(mentorId), status: 'completed' } },
            { $group: { _id: null, totalEarnings: { $sum: "$amount" }, totalSessions: { $sum: 1 } } }
        ]);

        const recentSessions = await Booking.find({
            mentor: mentorId,
            status: 'completed'
        })
            .sort({ sessionDate: -1 })
            .limit(10)
            .populate('student', 'name');

        const reportData = {
            mentorName: user.name,
            period: 'All Time Summary',
            totalEarnings: overallStats[0]?.totalEarnings || 0,
            totalSessions: overallStats[0]?.totalSessions || 0,
            recentSessions: recentSessions
        };

        const pdfBuffer = await generateMentorReport(reportData);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=MentorLink_Report_${Date.now()}.pdf`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Export Error:', error);
        res.status(500).json({ success: false, message: 'Failed to export report' });
    }
};
