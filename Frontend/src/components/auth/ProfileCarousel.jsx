import React, { useState, useEffect } from 'react';

const ProfileCarousel = () => {
  const [currentProfile, setCurrentProfile] = useState(0);

  const profiles = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      review: "Ment2Be has been transformative for my career. My mentor helped me land my dream job at Google!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      review: "The guidance I received was invaluable. I learned skills that took my career to the next level.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      review: "Amazing platform! My mentor was incredibly supportive and helped me build a strong portfolio.",
      rating: 5
    },
    {
      name: "David Kim",
      role: "Data Scientist",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
      review: "The mentorship I received helped me transition from academia to industry seamlessly.",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      role: "Marketing Manager",
      photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
      review: "I cannot recommend Ment2Be enough! The connections I made here changed my professional life.",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProfile((prev) => (prev + 1) % profiles.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [profiles.length]);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <div className="text-center px-8 max-w-lg">
        {/* Profile Photo */}
        <div className="mb-8">
          <div className="relative inline-block">
            <img
              src={profiles[currentProfile].photo}
              alt={profiles[currentProfile].name}
              className="w-32 h-32 rounded-full mx-auto border-4 border-white/20 shadow-2xl"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-gray-900"></div>
          </div>
        </div>

        {/* Profile Info */}
        <h3 className="text-2xl font-bold text-white mb-1">{profiles[currentProfile].name}</h3>
        <p className="text-gray-400 mb-6">{profiles[currentProfile].role}</p>

        {/* Rating Stars */}
        <div className="flex justify-center mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < profiles[currentProfile].rating ? 'text-yellow-400' : 'text-gray-600'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Review Text */}
        <p className="text-gray-300 text-lg italic leading-relaxed mb-8">
          "{profiles[currentProfile].review}"
        </p>

        {/* Carousel Indicators */}
        <div className="flex justify-center space-x-2">
          {profiles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentProfile(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentProfile ? 'bg-white w-8' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCarousel;
