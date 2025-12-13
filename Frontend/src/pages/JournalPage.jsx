import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/StudentDashboard/Navbar';

const JournalPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [error, setError] = useState(null);
  const [noConversation, setNoConversation] = useState(false);

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  // Check if coming from a session
  const fromSession = location.state?.fromSession;
  const sessionId = location.state?.sessionId;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // If coming from a session, fetch AI insights
    if (fromSession && sessionId) {
      fetchSessionInsights(sessionId);
    }
  }, [navigate, fromSession, sessionId]);

  const fetchSessionInsights = async (sessionId) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/ai/session-insights/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        // Check if no conversation happened
        if (data.noConversation) {
          setNoConversation(true);
          setSessionInfo({
            mentorName: data.data.mentorName,
            studentName: data.data.studentName,
            sessionDate: data.data.sessionDate,
            sessionTime: data.data.sessionTime,
            duration: data.data.duration,
            actualDuration: data.data.actualDuration
          });
        } else {
          setInsights(data.data.insights);
          setSessionInfo({
            mentorName: data.data.mentorName,
            studentName: data.data.studentName,
            sessionDate: data.data.sessionDate,
            sessionTime: data.data.sessionTime,
            duration: data.data.duration,
            topic: data.data.topic
          });
        }
      } else {
        setError(data.message || 'Failed to generate insights');
      }
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError('Failed to connect to AI service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 overflow-x-hidden pt-14">
      <Navbar userName={user?.name || 'Student'} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Session Journal</h1>
        <p className="text-gray-400 mb-8">Record your learnings and insights from mentoring sessions</p>

        {/* AI Session Insights Section */}
        {fromSession && (
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">AI Session Insights</h2>
                <p className="text-sm text-gray-400">Powered by Gemini AI</p>
              </div>
            </div>

            {loading ? (
              <div className="bg-[#121212] rounded-xl border border-gray-800 p-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-gray-700 border-t-purple-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-400 text-center">Analyzing your session with AI...</p>
                  <p className="text-gray-500 text-sm">Generating personalized insights and takeaways</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-red-400 font-medium">Failed to generate insights</p>
                    <p className="text-red-300 text-sm mt-1">{error}</p>
                    <button 
                      onClick={() => fetchSessionInsights(sessionId)}
                      className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            ) : noConversation ? (
              <div className="bg-[#121212] rounded-xl border border-gray-800 p-8">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">No Conversation Recorded</h3>
                  <p className="text-gray-400 max-w-md">
                    It looks like the session ended before a meaningful conversation could take place. 
                    {sessionInfo?.actualDuration !== undefined && (
                      <span className="block mt-2 text-gray-500">
                        Session duration: {Math.floor(sessionInfo.actualDuration / 60)} minutes {sessionInfo.actualDuration % 60} seconds
                      </span>
                    )}
                  </p>
                  <div className="bg-[#1a1a1a] rounded-lg p-4 mt-4 w-full max-w-md">
                    <p className="text-gray-300 text-sm">
                      <strong className="text-white">Tips for your next session:</strong>
                    </p>
                    <ul className="text-gray-400 text-sm mt-2 space-y-1 text-left">
                      <li>• Ensure both participants join the meeting</li>
                      <li>• Have a stable internet connection</li>
                      <li>• Prepare topics or questions beforehand</li>
                      <li>• Sessions need at least 2 minutes for AI insights</li>
                    </ul>
                  </div>
                  <div className="flex space-x-4 mt-4">
                    <button 
                      onClick={() => navigate('/student/sessions')}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                      View Sessions
                    </button>
                    <button 
                      onClick={() => navigate('/student/dashboard')}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            ) : insights ? (
              <div className="space-y-6">
                {/* Session Info Card */}
                {sessionInfo && (
                  <div className="bg-[#121212] rounded-xl border border-gray-800 p-5">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
                          {sessionInfo.mentorName?.charAt(0) || 'M'}
                        </div>
                        <div>
                          <p className="text-white font-medium">Session with {sessionInfo.mentorName}</p>
                          <p className="text-gray-400 text-sm">{sessionInfo.sessionDate} at {sessionInfo.sessionTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{sessionInfo.duration} minutes</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="bg-[#121212] rounded-xl border border-gray-800 p-5">
                  <div className="flex items-center space-x-2 mb-3">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-white">Session Summary</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{insights.summary}</p>
                </div>

                {/* Key Takeaways */}
                <div className="bg-[#121212] rounded-xl border border-gray-800 p-5">
                  <div className="flex items-center space-x-2 mb-4">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-white">Key Takeaways</h3>
                  </div>
                  <ul className="space-y-3">
                    {insights.keyTakeaways?.map((takeaway, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-300">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Items */}
                <div className="bg-[#121212] rounded-xl border border-gray-800 p-5">
                  <div className="flex items-center space-x-2 mb-4">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <h3 className="text-lg font-semibold text-white">Action Items</h3>
                  </div>
                  <ul className="space-y-3">
                    {insights.actionItems?.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Reflection Questions */}
                <div className="bg-[#121212] rounded-xl border border-gray-800 p-5">
                  <div className="flex items-center space-x-2 mb-4">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-white">Reflection Questions</h3>
                  </div>
                  <div className="space-y-4">
                    {insights.reflectionQuestions?.map((question, index) => (
                      <div key={index} className="bg-[#1a1a1a] rounded-lg p-4">
                        <p className="text-purple-300 font-medium mb-2">{question}</p>
                        <textarea 
                          placeholder="Write your thoughts..."
                          className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Resources */}
                <div className="bg-[#121212] rounded-xl border border-gray-800 p-5">
                  <div className="flex items-center space-x-2 mb-4">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="text-lg font-semibold text-white">Recommended Next Steps</h3>
                  </div>
                  <ul className="space-y-2">
                    {insights.recommendedResources?.map((resource, index) => (
                      <li key={index} className="flex items-center space-x-3 text-gray-300">
                        <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span>{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Save Journal Entry Button */}
                <div className="flex justify-end space-x-4">
                  <button 
                    onClick={() => navigate('/student/dashboard')}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Back to Dashboard
                  </button>
                  <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>Save Journal Entry</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Default Journal View (when not coming from session) */}
        {!fromSession && (
          <div className="bg-[#121212] rounded-xl border border-gray-800 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Your Session Journal</h3>
            <p className="text-gray-400 mb-6">
              After completing a mentoring session, you'll be redirected here to record your insights and learnings with AI-powered analysis.
            </p>
            <button 
              onClick={() => navigate('/student/sessions')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              View Your Sessions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalPage;
