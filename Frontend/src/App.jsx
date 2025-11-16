import { Routes, Route } from 'react-router-dom'
import './index.css'
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
import NotFoundPage from './assets/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login />} />

      {/* Student Dashboard Routes - Nested */}
      <Route path="/student">
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="sessions" element={<SessionsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Mentor Dashboard Routes - Nested */}
      <Route path="/mentor">
        <Route path="dashboard" element={<MentorDashboard />} />
        <Route path="mentees" element={<MentorMenteesPage />} />
        <Route path="tasks" element={<MentorTasksPage />} />
        <Route path="messages" element={<MentorMessagesPage />} />
        <Route path="get-mentees" element={<MentorGetMenteesPage />} />
        <Route path="profile" element={<MentorProfilePage />} />
      </Route>

      {/* 404 Catch-all Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
