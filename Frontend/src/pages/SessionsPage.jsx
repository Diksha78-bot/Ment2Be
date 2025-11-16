import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/StudentDashboard/Navbar';

const SessionsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user?.name || 'Student'} />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Bookings</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Sessions/Bookings page content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default SessionsPage;
