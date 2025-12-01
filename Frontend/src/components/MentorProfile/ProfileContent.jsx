import React from 'react';
import { FiStar, FiCalendar, FiUsers, FiAward } from 'react-icons/fi';

const ProfileContent = ({ mentorData, activeTab }) => {
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Pinned Repositories Style - Recent Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Pinned</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700">Customize your pins</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Session Card 1 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                  React-Mentoring-Session
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Advanced React patterns and state management techniques
                </p>
                <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></div>
                    JavaScript
                  </div>
                  <div className="flex items-center">
                    <FiStar className="h-3 w-3 mr-1" />
                    12
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="h-3 w-3 mr-1" />
                    3
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Session Card 2 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                  Node.js-Backend-Design
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Scalable backend architecture and API design principles
                </p>
                <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    Node.js
                  </div>
                  <div className="flex items-center">
                    <FiStar className="h-3 w-3 mr-1" />
                    8
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="h-3 w-3 mr-1" />
                    5
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Session Card 3 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                  System-Design-Workshop
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Large scale system design patterns and best practices
                </p>
                <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    Architecture
                  </div>
                  <div className="flex items-center">
                    <FiStar className="h-3 w-3 mr-1" />
                    15
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="h-3 w-3 mr-1" />
                    7
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Session Card 4 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                  Career-Guidance-Sessions
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Tech career roadmap and interview preparation guidance
                </p>
                <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                    Career
                  </div>
                  <div className="flex items-center">
                    <FiStar className="h-3 w-3 mr-1" />
                    20
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="h-3 w-3 mr-1" />
                    12
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Student Reviews</h3>
      <div className="space-y-4">
        {/* Review 1 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JS</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">John Smith</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">2 weeks ago</span>
              </div>
              <p className="text-gray-700 mt-2">
                Excellent mentor! Really helped me understand React concepts and provided great career advice.
              </p>
            </div>
          </div>
        </div>

        {/* Review 2 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">AD</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">Alice Davis</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">1 month ago</span>
              </div>
              <p className="text-gray-700 mt-2">
                Very knowledgeable and patient. The system design session was incredibly valuable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Achievements & Certifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Achievement 1 */}
        <div className="border border-gray-200 rounded-lg p-4 flex items-center space-x-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <FiAward className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Top Mentor 2024</h4>
            <p className="text-sm text-gray-600">Awarded for exceptional mentoring</p>
          </div>
        </div>

        {/* Achievement 2 */}
        <div className="border border-gray-200 rounded-lg p-4 flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiUsers className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">100+ Sessions</h4>
            <p className="text-sm text-gray-600">Completed over 100 mentoring sessions</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Group Sessions</h3>
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Weekly React Workshop</h4>
            <p className="text-sm text-gray-600">Every Saturday at 10:00 AM</p>
          </div>
          <div className="flex items-center space-x-2">
            <FiCalendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Next: Dec 7</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'reviews':
        return renderReviews();
      case 'achievements':
        return renderAchievements();
      case 'sessions':
        return renderSessions();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {renderContent()}
    </div>
  );
};

export default ProfileContent;
