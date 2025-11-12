import React, { useState, useEffect } from 'react';
import axios from 'axios';

// List of company logos (using placeholder images from picsum.photos)
const companyLogos = [
  'https://picsum.photos/seed/logo1/40/40',
  'https://picsum.photos/seed/logo2/40/40',
  'https://picsum.photos/seed/logo3/40/40',
  'https://picsum.photos/seed/logo4/40/40',
  'https://picsum.photos/seed/logo5/40/40',
  'https://picsum.photos/seed/logo6/40/40',
];

// List of company names
const companyNames = [
  'TechCorp', 'InnoTech', 'WebSolutions', 'DataSphere', 'CloudNine',
  'NexusLabs', 'ByteForge', 'QuantumSoft', 'NovaCore', 'Pinnacle'
];

// Function to get a random company logo and name
const getRandomCompany = () => {
  const randomIndex = Math.floor(Math.random() * companyLogos.length);
  return {
    logo: companyLogos[randomIndex],
    name: companyNames[randomIndex]
  };
};

const ProfileCarousel = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const emojiMap = {
    'Web Development': '👨‍💻',
    'Data Science': '👩‍💻',
    'UI/UX Design': '🎨',
    'Mobile Dev': '📱',
    'Cloud Computing': '☁️',
    'Machine Learning': '🤖',
    'Cybersecurity': '🔐',
    'DevOps': '⚙️',
    'Blockchain': '⛓️',
    'AI': '🤖'
  };

  const getEmoji = (expertise) => {
    if (!expertise || expertise.length === 0) return '👤';
    const firstExpertise = expertise[0];
    return emojiMap[firstExpertise] || '👨‍🏫';
  };

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get('/api/mentors/carousel');
        setMentors(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch mentors:', error);
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rating ? 'text-yellow-500' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-700 text-xl">Loading mentors...</div>
      </div>
    );
  }

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
                className="bg-white border border-gray-200 rounded-2xl p-4 w-[200px] min-h-[220px] flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="text-5xl mb-3">{getEmoji(mentor.expertise)}</div>

                <h3 className="font-semibold text-gray-900 text-lg">{mentor.name}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {mentor.expertise && mentor.expertise[0]}
                </p>

                <div className="mt-3 flex items-center justify-center gap-1">
                  {renderStars(mentor.rating)}
                  <span className="ml-1 text-gray-600 text-sm">{mentor.rating}.0</span>
                </div>

                <div className="mt-3 pt-3 w-full border-t border-gray-100">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <img 
                          src={getRandomCompany().logo} 
                          alt="Company" 
                          className="w-4 h-4 rounded-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{getRandomCompany().name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{Math.floor(Math.random() * 5) + 1} yr</span>
                  </div>
                  <div className="mt-1 text-left px-1">
                    <p className="text-[10px] text-gray-400">
                      {['Frontend Developer', 'UI/UX Designer', 'Product Manager', 'Data Scientist', 'DevOps Engineer'][Math.floor(Math.random() * 5)]}
                    </p>
                  </div>
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
                className="bg-white border border-gray-200 rounded-2xl p-4 w-[200px] min-h-[220px] flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="text-5xl mb-3">{getEmoji(mentor.expertise)}</div>

                <h3 className="font-semibold text-gray-900 text-lg">{mentor.name}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {mentor.expertise && mentor.expertise[0]}
                </p>

                <div className="mt-3 flex items-center justify-center gap-1">
                  {renderStars(mentor.rating)}
                  <span className="ml-1 text-gray-600 text-sm">{mentor.rating}.0</span>
                </div>

                <div className="mt-3 pt-3 w-full border-t border-gray-100">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <img 
                          src={getRandomCompany().logo} 
                          alt="Company" 
                          className="w-4 h-4 rounded-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{getRandomCompany().name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{Math.floor(Math.random() * 5) + 1} yr</span>
                  </div>
                  <div className="mt-1 text-left px-1">
                    <p className="text-[10px] text-gray-400">
                      {['Frontend Developer', 'UI/UX Designer', 'Product Manager', 'Data Scientist', 'DevOps Engineer'][Math.floor(Math.random() * 5)]}
                    </p>
                  </div>
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
