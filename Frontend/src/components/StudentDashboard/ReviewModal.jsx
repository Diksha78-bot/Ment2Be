import React, { useState } from 'react';

const ReviewModal = ({ isOpen, onClose, sessionId, bookingId, mentorName }) => {
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!review.trim()) {
      alert('Please write a review');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: sessionId || bookingId,
          bookingId: bookingId || sessionId,
          rating: 5,
          review,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Review submitted!');
        setReview('');
        onClose();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#121212] rounded-lg p-6 w-96 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Review {mentorName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review here..."
          maxLength={500}
          className="w-full h-32 p-3 bg-[#202327] border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">{review.length}/500</p>

        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !review.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
