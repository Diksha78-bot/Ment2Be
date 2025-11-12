import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isMentor = user.role === 'mentor';

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">MentorMatch Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user.name || 'User'}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              {isMentor ? 'Your Mentor Dashboard' : 'Your Learning Dashboard'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {/* Stats Cards */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800">Upcoming Sessions</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">3</p>
                <p className="text-sm text-blue-600 mt-1">Scheduled this week</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-green-800">
                  {isMentor ? 'Students' : 'Mentors'}
                </h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {isMentor ? '12' : '5'}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {isMentor ? 'Active students' : 'Available mentors'}
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-purple-800">
                  {isMentor ? 'Earnings' : 'Progress'}
                </h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {isMentor ? '$1,250' : '75%'}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  {isMentor ? 'This month' : 'Course completion'}
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="divide-y divide-gray-200">
                  {[1, 2, 3].map((item) => (
                    <li key={item} className="py-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {isMentor 
                              ? `New session request from Student ${item}`
                              : `Session scheduled with Mentor ${item}`}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {item} hour ago
                          </p>
                        </div>
                        <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                          {isMentor ? 'View' : 'Join'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
