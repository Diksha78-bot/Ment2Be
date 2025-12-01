import React from 'react';
import { FiStar, FiUsers, FiClock, FiTrendingUp, FiCalendar } from 'react-icons/fi';

const ProfileSidebar = ({ mentorData, onBookSession }) => {
  return (
    <div className="space-y-6">
      {/* Achievements/Stats Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Achievements</h3>
        
        <div className="space-y-4">
          {/* Rating */}
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <FiStar className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{mentorData.rating}/5.0</div>
              <div className="text-sm text-gray-500">Rating ({mentorData.reviews} reviews)</div>
            </div>
          </div>

          {/* Sessions completed */}
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <FiUsers className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{mentorData.stats.sessionsCompleted}</div>
              <div className="text-sm text-gray-500">Sessions completed</div>
            </div>
          </div>

          {/* Total mentoring time */}
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <FiClock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{mentorData.stats.totalMentoringTime}</div>
              <div className="text-sm text-gray-500">Total mentoring time</div>
            </div>
          </div>

          {/* Karma Points */}
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <FiTrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{mentorData.stats.karmaPoints}</div>
              <div className="text-sm text-gray-500">Karma Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
        <div className="flex flex-wrap gap-2">
          {mentorData.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Book Session Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Book a Session</h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Hourly Rate:</span>
            <span className="font-medium text-gray-900">
              {mentorData.hourlyRate > 0 ? `$${mentorData.hourlyRate}` : 'Free'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Response Time:</span>
            <span className="font-medium text-gray-900">Within 2 hours</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Availability:</span>
            <span className="font-medium text-green-600">Available now</span>
          </div>
        </div>

        <button 
          onClick={onBookSession}
          className="w-full bg-green-600 text-white py-2.5 px-4 rounded-md hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
        >
          <FiCalendar className="h-4 w-4 mr-2" />
          Book Session
        </button>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          Usually responds within 2 hours
        </p>
      </div>
    </div>
  );
};

export default ProfileSidebar;
