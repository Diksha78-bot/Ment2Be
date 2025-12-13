import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiX, FiUser } from 'react-icons/fi';

const TopExperts = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTopExperts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch('http://localhost:4000/api/mentors/top-experts?limit=4', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch top experts');
        }

        const data = await response.json();
        const topExperts = Array.isArray(data.mentors) ? data.mentors : [];
        
        console.log('🏆 Top Experts Raw Data:', topExperts);
        
        const transformedExperts = topExperts.map(mentor => ({
          id: mentor._id,
          name: mentor.name,
          company: mentor.company || 'N/A',
          image: mentor.profilePicture || mentor.mentorProfile?.profilePicture || '',
          verified: mentor.isVerified || false
        }));

        console.log('🏆 Transformed Experts:', transformedExperts);
        setExperts(transformedExperts);
      } catch (error) {
        console.error('Error fetching top experts:', error);
        setExperts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopExperts();
  }, []);

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-[#121212] rounded-lg border border-[#202327] overflow-hidden flex flex-col h-[350px] w-[270px]">
      <div className="p-2 border-b border-gray-700 flex-shrink-0">
        <h3 className="text-md font-semibold text-white">Top Experts</h3>
      </div>
      <div className="divide-y divide-gray-700 overflow-y-auto flex-1 scrollbar-hide">
        {loading ? (
          <div className="p-3 text-center text-gray-400 text-sm">Loading...</div>
        ) : experts.length === 0 ? (
          <div className="p-3 text-center text-gray-400 text-sm">No experts found</div>
        ) : (
          experts.map((expert) => (
            <div 
              key={expert.id} 
              className="p-3 hover:bg-gray-700/50 cursor-pointer transition-colors"
              onClick={() => {
                setSelectedExpert(expert);
                setShowModal(true);
              }}
            >
              <div className="flex items-center">
                <div className="relative">
                  {expert.image ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover border border-gray-600"
                      src={expert.image}
                      alt={expert.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextElementSibling) {
                          e.target.nextElementSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div 
                    style={{ display: expert.image ? 'none' : 'flex' }}
                    className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs border border-gray-600"
                  >
                    {getInitials(expert.name)}
                  </div>
                  {expert.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-white rounded-full p-0.5">
                      <FiCheckCircle className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-white truncate">{expert.name}</span>
                    {expert.verified && (
                      <FiCheckCircle className="ml-1 h-4 w-4 text-cyan-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{expert.company}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: '#da8c18' }}>
                    Available
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && selectedExpert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#121212] rounded-lg border border-gray-700 max-w-md w-full mx-4 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FiUser size={20} style={{ color: '#73501c' }} />
                <h2 className="text-lg font-semibold text-white">Connect with {selectedExpert.name}</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="h-5 w-5" style={{ color: '#73501c' }} />
              </button>
            </div>

            {/* Expert Info */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-700">
              <div className="relative">
                {selectedExpert.image ? (
                  <img
                    className="h-12 w-12 rounded-full object-cover border border-gray-600"
                    src={selectedExpert.image}
                    alt={selectedExpert.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextElementSibling) {
                        e.target.nextElementSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div 
                  style={{ display: selectedExpert.image ? 'none' : 'flex' }}
                  className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm border border-gray-600"
                >
                  {selectedExpert.name?.charAt(0).toUpperCase() || 'M'}
                </div>
              </div>
              <div>
                <p className="text-white font-semibold">{selectedExpert.name}</p>
                <p className="text-sm text-gray-400">{selectedExpert.company}</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-white font-semibold mb-2">How to Connect:</h3>
                <ol className="text-sm text-gray-300 space-y-2">
                  <li className="flex gap-2">
                    <span className="text-[#da8c18] font-bold">1.</span>
                    <span>View the mentor's full profile and expertise</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#da8c18] font-bold">2.</span>
                    <span>Check their availability and hourly rate</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#da8c18] font-bold">3.</span>
                    <span>Book a session or send a message to discuss your goals</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#da8c18] font-bold">4.</span>
                    <span>Start your mentorship journey and grow together</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors font-medium text-sm"
              >
                Close
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-[#da8c18] text-white hover:bg-[#c97d0f] transition-colors font-medium text-sm"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopExperts;
