import Review from "../models/review.model.js";
import Session from "../models/Session.model.js";

export async function CreateReviewHandler(req, res) {
  try {
    const { sessionId, bookingId, rating, review } = req.body;
    const userId = req.user?.id;

    console.log('CreateReviewHandler called with:', { sessionId, bookingId, rating, userId });

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required"
      });
    }

    if (!sessionId && !bookingId) {
      return res.status(400).json({
        success: false,
        message: "Session ID or Booking ID is required"
      });
    }

    // Import Booking model to get mentor info
    const Booking = (await import('../models/booking.model.js')).default;

    let mentorId = null;
    let session = null;

    // Try to find booking to get mentor ID
    if (bookingId) {
      const booking = await Booking.findById(bookingId).populate('mentor');
      if (booking) {
        mentorId = booking.mentor?._id || booking.mentorId;
        console.log('Mentor ID from booking:', mentorId);
      }
    }

    // Try to find session
    if (sessionId) {
      session = await Session.findById(sessionId);
      if (session && !mentorId) {
        mentorId = session.mentorId;
      }
    }

    const newReview = await Review.create({
      session: sessionId || bookingId,
      booking: bookingId,
      mentor: mentorId,
      rating,
      review: review || undefined,
      student: userId
    });

    const populatedReview = await Review.findById(newReview._id)
      .populate('student', 'name profilePicture')
      .populate('mentor', 'name')
      .populate({
        path: 'session',
        select: 'mentorId studentId startTime endTime'
      });

    console.log('Review created successfully:', populatedReview);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: populatedReview
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message
    });
  }
}

export async function GetReviewsHandler(req, res) {
  try {
    const { mentor, mentorId, studentId } = req.query;
    // Try both req.user.id and req.user._id since JWT might use either
    const userId = req.user?.id || req.user?._id;

    console.log('GetReviewsHandler - userId:', userId, 'studentId:', studentId, 'mentorId:', mentorId);
    console.log('GetReviewsHandler - req.user:', req.user);

    // If studentId is provided, fetch reviews submitted by that student
    if (studentId) {
      const reviews = await Review.find({ student: studentId })
        .populate('student', 'name profilePicture')
        .populate('mentor', 'name profilePicture')
        .sort({ createdAt: -1 });

      console.log('Reviews for student:', studentId, 'count:', reviews.length);

      return res.status(200).json({
        success: true,
        count: reviews.length,
        reviews
      });
    }

    // If no studentId but user is authenticated, fetch their own reviews
    if (userId) {
      const reviews = await Review.find({ student: userId })
        .populate('student', 'name profilePicture')
        .populate('mentor', 'name profilePicture')
        .sort({ createdAt: -1 });

      console.log('Reviews for authenticated user:', userId, 'count:', reviews.length);

      return res.status(200).json({
        success: true,
        count: reviews.length,
        reviews
      });
    }

    // Otherwise, fetch reviews for a mentor
    const currentMentorId = mentor || mentorId;

    if (!currentMentorId) {
      return res.status(400).json({
        success: false,
        message: "Mentor ID is required"
      });
    }

    // Find all reviews for this mentor (from bookings or sessions or direct mentor field)
    const reviews = await Review.find({
      $or: [
        { mentor: currentMentorId },
        { 'session.mentor': currentMentorId },
        { 'session.mentorId': currentMentorId }
      ]
    })
      .populate('student', 'name profilePicture')
      .populate({
        path: 'session',
        select: 'mentorId studentId startTime endTime',
        populate: [
          { path: 'mentorId', select: 'name' },
          { path: 'studentId', select: 'name profilePicture' }
        ]
      })
      .sort({ createdAt: -1 });

    console.log('Reviews found for mentor:', currentMentorId, 'count:', reviews.length);

    const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    const averageRating = reviews.length > 0 ? parseFloat((totalRating / reviews.length).toFixed(2)) : 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating,
      reviews
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message
    });
  }
}

export async function GetReviewById(req, res) {
  try {
    const { id } = req.params;

    const review = await Review.findById(id)
      .populate({
        path: 'session',
        populate: [
          { path: 'mentor', select: 'name email' },
          { path: 'student', select: 'name email' }
        ]
      });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    res.status(200).json({
      success: true,
      review
    });
  } catch (error) {
    console.error("Get review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch review"
    });
  }
}
