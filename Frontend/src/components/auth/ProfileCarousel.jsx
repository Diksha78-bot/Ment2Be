import React from 'react';

// 10 mentors with unique Unsplash avatars
const mentors = [
  { 
    id: 1, 
    name: "Arjun Mehta", 
    expertise: ["Web Development"], 
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&crop=faces"
  },
  { 
    id: 2, 
    name: "Priya Sharma", 
    expertise: ["Data Science"], 
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&crop=faces"
  },
  { 
    id: 3, 
    name: "Karan Patel", 
    expertise: ["UI/UX Design"], 
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&crop=faces"
  },
  { 
    id: 4, 
    name: "Sneha Kapoor", 
    expertise: ["AI"], 
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&crop=faces"
  },
  { 
    id: 5, 
    name: "Rohan Verma", 
    expertise: ["Mobile Dev"], 
    rating: 3,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&crop=faces"
  },
  { 
    id: 6, 
    name: "Ananya Singh", 
    expertise: ["Cloud Computing"], 
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&crop=faces"
  },
  { 
    id: 7, 
    name: "Dev Malhotra", 
    expertise: ["Machine Learning"], 
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&crop=faces"
  },
  { 
    id: 8, 
    name: "Sara Khan", 
    expertise: ["Cybersecurity"], 
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a2c9f9?w=200&h=200&crop=faces"
  },
  { 
    id: 9, 
    name: "Varun Rao", 
    expertise: ["DevOps"], 
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&crop=faces"
  },
  { 
    id: 10, 
    name: "Meera Joshi", 
    expertise: ["Blockchain"], 
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544723795-f2a3c5a09739?w=200&h=200&crop=faces"
  }
];


// Star Rating Renderer
const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, idx) => (
    <span key={idx} className={idx < rating ? 'text-yellow-500' : 'text-gray-300'}>
      ★
    </span>
  ));
};

const ProfileCarousel = () => {
  // Duplicate lists for infinite scrolling
  const column1Data = [...mentors.slice(0, 5), ...mentors.slice(0, 5)];
  const column2Data = [...mentors.slice(5, 10), ...mentors.slice(5, 10)];

  return (
    <div className="w-full h-full overflow-hidden p-8">
      <div className="flex gap-6 h-full">

        {/* Column 1 - Scroll Up */}
        <div className="flex-1 overflow-hidden">
          <div className="animate-scroll-up space-y-6">
            {column1Data.map((mentor, index) => (
              <div
                key={`col1-${index}`}
                className="bg-white border border-gray-200 rounded-2xl p-4 w-[200px] min-h-[220px] flex flex-col items-center text-center shadow-sm"
              >
                {/* Avatar */}
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-20 h-20 rounded-full object-cover mb-3 shadow"
                />

                <h3 className="font-semibold text-gray-900 text-lg">{mentor.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{mentor.expertise[0]}</p>

                <div className="mt-3 flex items-center gap-1">
                  {renderStars(mentor.rating)}
                  <span className="text-gray-600 text-sm">{mentor.rating}.0</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 - Scroll Down */}
        <div className="flex-1 overflow-hidden">
          <div className="animate-scroll-down space-y-6">
            {column2Data.map((mentor, index) => (
              <div
                key={`col2-${index}`}
                className="bg-white border border-gray-200 rounded-2xl p-4 w-[200px] min-h-[220px] flex flex-col items-center text-center shadow-sm"
              >
                {/* Avatar */}
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-20 h-20 rounded-full object-cover mb-3 shadow"
                />

                <h3 className="font-semibold text-gray-900 text-lg">{mentor.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{mentor.expertise[0]}</p>

                <div className="mt-3 flex items-center gap-1">
                  {renderStars(mentor.rating)}
                  <span className="text-gray-600 text-sm">{mentor.rating}.0</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileCarousel;
