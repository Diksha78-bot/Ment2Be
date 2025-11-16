const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor'); // Adjust path as needed

// GET /api/mentors/carousel
// router.get('/carousel', async (req, res) => {
//   try {
//     // Fetch top 10 approved mentors with highest ratings
//     const mentors = await Mentor.find({ 
//       isApproved: true,
//       status: 'active' 
//     })
//       .select('name expertise rating')
//       .sort({ rating: -1 })
//       .limit(10);

//     // If less than 10 mentors, duplicate to fill carousel
//     let carouselMentors = [...mentors];
//     while (carouselMentors.length < 10 && mentors.length > 0) {
//       carouselMentors = [...carouselMentors, ...mentors].slice(0, 10);
//     }

//     res.json(carouselMentors);
//   } catch (error) {
//     console.error('Error fetching carousel mentors:', error);
//     res.status(500).json({ message: 'Failed to fetch mentors' });
//   }
// });

// module.exports = router;
