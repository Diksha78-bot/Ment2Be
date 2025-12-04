import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { ContextSidebar } from "./ContextSidebar";
import { ChatList } from "./ChatList";
import { MessageTypes, createMessage, createConversation } from "../../lib/types";
import { messageService } from "../../services/messageService";


export function MentorshipChat() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedType, setSelectedType] = useState(MessageTypes.NORMAL);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [activeParticipant, setActiveParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user info
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  
  // Get user ID (could be 'id' or '_id')
  const userId = currentUser.id || currentUser._id;
  
  // Debug authentication state
  console.log('Auth Debug:', {
    hasToken: !!token,
    hasUserId: !!userId,
    userId: userId,
    userRole: currentUser.role,
    userName: currentUser.name,
    userObject: currentUser
  });
  
  // Check if user is authenticated
  useEffect(() => {
    if (!token || !userId) {
      console.log('Authentication failed - redirecting to login');
      setError('Please log in to access the messaging system.');
      setLoading(false);
      return;
    }
  }, [token, userId]);

  // Fetch conversations on component mount
  useEffect(() => {
    if (token && userId) {
      fetchConversations();
    }
  }, [token, userId]);

  // Listen for storage changes (when user logs in in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        window.location.reload(); // Reload to get fresh auth state
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeParticipant) {
      fetchMessages(activeParticipant.participantId);
    }
  }, [activeParticipant]);

  // Fetch and transform confirmed sessions into conversation format
  const fetchConfirmedSessions = async () => {
    try {
      const sessions = await messageService.getConfirmedSessions();
      return sessions.map(session => {
        // Determine if current user is mentor or mentee
        const isMentor = session.mentor?._id === userId || session.mentor?.id === userId;
        const otherUser = isMentor ? session.student : session.mentor;
        
        return {
          id: `session_${session._id || session.id}`,
          participantId: otherUser?._id || otherUser?.id,
          mentorName: otherUser?.name || 'Session User',
          mentorAvatar: otherUser?.profilePicture || '',
          mentorRole: isMentor ? 'Mentee' : 'Mentor',
          lastMessage: `Session on ${new Date(session.sessionDate).toLocaleDateString()}`,
          lastMessageTime: new Date(session.updatedAt || session.createdAt || new Date()),
          unreadCount: 0,
          isOnline: false,
          isSession: true,
          sessionData: session
        };
      });
    } catch (error) {
      console.error('Error fetching confirmed sessions:', error);
      return [];
    }
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      // Fetch both conversations and confirmed sessions in parallel
      const [conversationsData, confirmedSessions] = await Promise.all([
        messageService.getConversations(),
        fetchConfirmedSessions()
      ]);
      
      // Transform regular conversations
      const transformedConversations = conversationsData.map(conv => ({
        id: conv.conversationId,
        participantId: conv.participantId,
        mentorName: conv.participantName,
        mentorAvatar: conv.profilePicture || "",
        mentorRole: conv.participantBio || `${conv.participantRole} User`,
        lastMessage: conv.lastMessage,
        lastMessageTime: new Date(conv.lastMessageTime),
        unreadCount: conv.unreadCount,
        isOnline: conv.isOnline,
        isSession: false
      }));

      // Combine and sort by last message time (newest first)
      const allConversations = [
        ...transformedConversations,
        ...confirmedSessions
      ].sort((a, b) => b.lastMessageTime - a.lastMessageTime);

      setConversations(allConversations);
      
      // Set first conversation as active if none selected
      if (allConversations.length > 0 && !activeConversationId) {
        const firstConv = allConversations[0];
        setActiveConversationId(firstConv.id);
        setActiveParticipant({
          participantId: firstConv.participantId,
          name: firstConv.mentorName,
          role: firstConv.mentorRole,
          avatar: firstConv.mentorAvatar,
          isSession: firstConv.isSession,
          sessionData: firstConv.sessionData
        });
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      if (err.message.includes('Authentication required') || err.message.includes('Access denied')) {
        setError('Please log in to view your conversations.');
      } else {
        setError('Failed to load conversations. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (participantId) => {
    try {
      const messagesData = await messageService.getConversationMessages(participantId);
      
      // Transform API data to match component expectations
      const transformedMessages = messagesData.map(msg => ({
        id: msg._id,
        content: msg.content,
        sender: msg.sender._id === userId ? 'mentor' : 'mentee',
        type: msg.messageType,
        timestamp: new Date(msg.createdAt),
        senderName: msg.sender.name,
        receiverName: msg.receiver.name
      }));

      setMessages(transformedMessages);
      
      // Mark messages as read
      if (messagesData.length > 0) {
        await messageService.markMessagesAsRead(participantId);
        // Update conversation unread count
        setConversations(prev => prev.map(conv => 
          conv.participantId === participantId 
            ? { ...conv, unreadCount: 0 }
            : conv
        ));
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    }
  };

  const handleSendMessage = async (content) => {
    if (!activeParticipant) return;

    try {
      const sentMessage = await messageService.sendMessage(
        activeParticipant.participantId,
        content,
        selectedType
      );

      // Add message to local state
      const newMessage = {
        id: sentMessage._id,
        content: sentMessage.content,
        sender: 'mentor', // Current user is mentor
        type: sentMessage.messageType,
        timestamp: new Date(sentMessage.createdAt),
        senderName: currentUser.name,
        receiverName: activeParticipant.name
      };

      setMessages(prev => [...prev, newMessage]);
      setSelectedType(MessageTypes.NORMAL);

      // Update conversation last message
      setConversations(prev => prev.map(conv => 
        conv.participantId === activeParticipant.participantId
          ? { 
              ...conv, 
              lastMessage: content,
              lastMessageTime: new Date()
            }
          : conv
      ));
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  const handleSelectConversation = (conversationId) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation) return;

    setActiveConversationId(conversationId);
    
    if (conversation.isSession && conversation.sessionData) {
      // For session conversations, extract the other user's details from the session data
      const session = conversation.sessionData;
      const isMentor = session.mentor?._id === userId || session.mentor?.id === userId;
      const otherUser = isMentor ? session.student : session.mentor;
      
      const participantInfo = {
        participantId: otherUser?._id || otherUser?.id || conversation.participantId,
        name: otherUser?.name || conversation.mentorName || 'Session User',
        role: isMentor ? 'Mentee' : 'Mentor',
        avatar: otherUser?.profilePicture || conversation.mentorAvatar || '',
        isSession: true,
        sessionData: {
          ...session,
          sessionDate: session.sessionDate ? new Date(session.sessionDate) : new Date(),
          isMentor: isMentor
        }
      };
      
      setActiveParticipant(participantInfo);
      
      // Load session info as the first message
      const sessionDate = session.sessionDate ? new Date(session.sessionDate) : new Date();
      const sessionMessage = {
        id: `session_${session._id || session.id}_info`,
        content: `Session scheduled for ${sessionDate.toLocaleString()}`,
        sender: 'system',
        type: 'info',
        timestamp: new Date(),
        isSessionInfo: true
      };
      setMessages([sessionMessage]);
    } else {
      // For regular conversations
      setActiveParticipant({
        participantId: conversation.participantId,
        name: conversation.mentorName,
        role: conversation.mentorRole,
        avatar: conversation.mentorAvatar,
        isSession: false
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-full w-full bg-[#121212] items-center justify-center">
        <div className="text-white">Loading conversations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full bg-[#121212] items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <div className="flex gap-3 justify-center">
            {error.includes('log in') && (
              <button 
                onClick={() => navigate('/login')} 
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Go to Login
              </button>
            )}
            {!error.includes('log in') && (
              <button 
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  fetchConversations();
                }} 
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-[#121212] overflow-hidden">
      {/* Main content */}
      <div className="relative z-10 flex w-full h-full">
        <div className="hidden md:block w-[280px] flex-shrink-0 h-full">
          <ChatList
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        {/* Chat area - flexible width */}
        <div className="flex flex-col flex-1 h-full min-w-0">
          {activeParticipant ? (
            <>
              <ChatHeader 
                participantName={activeParticipant.name || 'Mentor'}
                participantRole={activeParticipant.role || ''}
                participantAvatar={activeParticipant.avatar}
                sessionData={activeParticipant.sessionData}
              />
              <ChatMessages messages={messages} />
              <ChatInput 
                selectedType={selectedType} 
                onTypeChange={setSelectedType} 
                onSendMessage={handleSendMessage} 
              />
            </>
          ) : (
            <>
              <ChatHeader 
                participantName={currentUser?.name || 'Mentor'}
                participantRole=""
                participantAvatar=""
              />
              <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-400 text-center px-4">
                  {conversations.length === 0 
                    ? "No conversations yet. Start messaging with your mentees!"
                    : "Select a conversation to start messaging"
                  }
                </div>
              </div>
            </>
          )}
        </div>

        {/* Context sidebar - 320px fixed width */}
        {activeParticipant && (
          <div className="hidden lg:block w-[320px] flex-shrink-0 h-full border-l border-[#535353]/30">
            <ContextSidebar 
              messages={messages} 
              mentee={{
                name: activeParticipant.name,
                role: activeParticipant.role,
                avatar: activeParticipant.avatar,
                bio: activeParticipant.bio || '',
                sessionCount: activeParticipant.sessionCount || 0,
                totalSessions: activeParticipant.totalSessions || 12,
                nextSession: activeParticipant.sessionData?.sessionDate,
                goals: activeParticipant.goals || [],
                resources: activeParticipant.resources || []
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
