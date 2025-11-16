import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MentorNavbar from '../components/MentorDashboard/Navbar';

const MentorGetMenteesPage = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <MentorNavbar userName={user?.name || 'Mentor'} />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Get Mentees</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Get mentees page content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default MentorGetMenteesPage;
