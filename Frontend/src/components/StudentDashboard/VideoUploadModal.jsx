import React, { useState, useRef } from 'react';

const VideoUploadModal = ({ isOpen, onClose, sessionId, bookingId, mentorName }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      alert('Please select a valid video file');
    }
  };

  const handleSubmit = async () => {
    if (!videoFile) {
      alert('Please select a video file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('video', videoFile);

      const token = localStorage.getItem('token');
      const uploadResponse = await fetch('http://localhost:4000/api/upload/video', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadData.success) {
        alert('Video upload failed');
        return;
      }

      const reviewResponse = await fetch('http://localhost:4000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: sessionId || bookingId,
          bookingId: bookingId || sessionId,
          rating: 5,
          review: uploadData.data.url,
        }),
      });

      const reviewData = await reviewResponse.json();
      if (reviewData.success) {
        alert('Video uploaded successfully!');
        setVideoFile(null);
        onClose();
      } else {
        alert('Error: ' + reviewData.message);
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
          <h3 className="text-lg font-semibold text-white">Video for {mentorName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-600 rounded p-6 text-center cursor-pointer hover:border-gray-500 mb-4"
        >
          {videoFile ? (
            <div>
              <p className="text-white font-medium">{videoFile.name}</p>
              <p className="text-xs text-gray-400 mt-1">Click to change</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-400">Click to upload video</p>
              <p className="text-xs text-gray-500 mt-1">Max 100MB</p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !videoFile}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadModal;
