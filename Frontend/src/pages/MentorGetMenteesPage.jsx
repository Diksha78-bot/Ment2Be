import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MentorNavbar from '../components/MentorDashboard/Navbar';
import { ForumPage } from '../components/Forum/ForumPage';

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
    <div className="h-screen bg-[#202327] overflow-hidden flex flex-col">
      <MentorNavbar userName={user?.name || 'Mentor'} />
      <div className="flex-1 overflow-hidden">
        <ForumPage />
      </div>
    </div>
  );
};

export default MentorGetMenteesPage;
