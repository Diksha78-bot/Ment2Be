import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './index.css';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import ExplorePage from './pages/ExplorePage';
import JournalPage from './pages/JournalPage';
import ChatPage from './pages/ChatPage';
import SessionsPage from './pages/SessionsPage';
import ProfilePage from './pages/ProfilePage';
import MentorMenteesPage from './pages/MentorMenteesPage';
import MentorTasksPage from './pages/MentorTasksPage';
import MentorMessagesPage from './pages/MentorMessagesPage';
import MentorGetMenteesPage from './pages/MentorGetMenteesPage';
import MentorProfilePage from './pages/MentorProfilePage';
import MentorProfileSetup from './pages/MentorProfileSetup';
import MentorDetailPage from './pages/MentorDetailPage';
import BookSession from './pages/BookSession';
import MeetingRoomZego from './pages/MeetingRoomZego';
import NotFoundPage from './assets/NotFoundPage';
import ProfileCompletionPage from './pages/ProfileCompletionPage';
import StudentTaskPage from './pages/StudentTaskPage';
import KarmaTest from './components/KarmaTest';
import { ForumPage } from './components/Forum/ForumPage';
import StudentForumPage from './pages/StudentForumPage';
import MentorJournalPage from './pages/MentorJournalPage';
import QuestionDetailPage from './pages/QuestionDetailPage';

function App() {
  const location = useLocation();

  return (
    <>
      {/* ✅ key forces rerender on every navigation */}
      <Routes location={location} key={location.key}>
        {/* Root redirect */}
        <Route path="/" element={<Login />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/explore" element={<ExplorePage />} />
        <Route path="/student/journal" element={<JournalPage />} />
        <Route path="/student/chat" element={<ChatPage />} />
        <Route path="/student/sessions" element={<SessionsPage />} />
        <Route path="/student/profile" element={<ProfilePage />} />
        <Route path="/student/forum" element={<StudentForumPage />} />
        <Route path="/student/forum/question/:questionId" element={<QuestionDetailPage />} />
        <Route path="/complete-profile" element={<ProfileCompletionPage />} />
        <Route path="/mentor-profile" element={<MentorDetailPage />} />
        <Route path="/booking" element={<BookSession />} />
        <Route path="/student/tasks" element={<StudentTaskPage />} />

        {/* Meeting Routes */}
        <Route path="/student/meeting/:roomId/:sessionId" element={<MeetingRoomZego />} />
        <Route path="/mentor/meeting/:roomId/:sessionId" element={<MeetingRoomZego />} />
        <Route path="/meeting" element={<MeetingRoomZego />} />

        {/* Mentor Routes */}
        <Route path="/mentor/dashboard" element={<MentorDashboard />} />
        <Route path="/mentor/mentees" element={<MentorMenteesPage />} />
        <Route path="/mentor/tasks" element={<MentorTasksPage />} />
        <Route path="/mentor/messages" element={<MentorMessagesPage />} />
        <Route path="/mentor/get-mentees" element={<MentorGetMenteesPage />} />
        <Route path="/mentor/profile" element={<MentorProfilePage />} />
        <Route path="/mentor/profile-setup" element={<MentorProfileSetup />} />
        <Route path="/mentor/forum" element={<ForumPage />} />
        <Route path="/mentor/forum/question/:questionId" element={<QuestionDetailPage />} />
        <Route path="/mentor/journal" element={<MentorJournalPage />} />

        {/* Testing Route */}
        <Route path="/karma-test" element={<KarmaTest />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
