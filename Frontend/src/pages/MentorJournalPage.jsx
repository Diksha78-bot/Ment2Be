import React from 'react';
import MentorNavbar from '../components/MentorDashboard/Navbar';
import { BookOpen } from 'lucide-react';

export default function MentorJournalPage() {
  return (
    <div className="h-screen bg-black overflow-hidden flex flex-col">
      <MentorNavbar userName="Mentor" />
      <div className="flex-1 pt-14 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-[#121212] border border-[#404040] flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Mentor Journal</h1>
          <p className="text-2xl text-blue-500 font-semibold mb-2">Coming Soon</p>
          <p className="text-[#b3b3b3] max-w-md mx-auto">
            Track your mentoring sessions, notes, and progress with your mentees. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
}
