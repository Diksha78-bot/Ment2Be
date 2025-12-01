import React from 'react';

const ProfileCarousel = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Big Light Mentoring Illustration */}
      <img
        src="https://undraw.co/illustrations/mentoring_re_2ts7.svg"
        alt="Mentoring Illustration"
        className="w-full max-w-[680px] opacity-95 drop-shadow-[0_25px_50px_rgba(0,0,0,0.45)]"
        style={{ filter: 'grayscale(1) brightness(1.85)' }}
        onError={(e) => {
          e.target.src = "https://illustrations.popsy.co/violet/remote-work.svg";
        }}
      />
    </div>
  );
};

export default ProfileCarousel;
