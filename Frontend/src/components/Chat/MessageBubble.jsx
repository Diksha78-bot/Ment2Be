import React from "react";
import { MessageSquare, HelpCircle, Lightbulb, BookOpen, CheckSquare, AlertCircle } from "lucide-react";
import { MessageTypes } from "../../lib/types";

// Default configuration for message types
const typeConfig = {
  [MessageTypes.NORMAL]: {
    icon: MessageSquare,
    label: "Message",
    className: "bg-transparent",
  },
  [MessageTypes.QUESTION]: {
    icon: HelpCircle,
    label: "Question",
    className: "bg-blue-100 text-blue-800",
  },
  [MessageTypes.INSIGHT]: {
    icon: Lightbulb,
    label: "Insight",
    className: "bg-yellow-100 text-yellow-800",
  },
  [MessageTypes.ADVICE]: {
    icon: BookOpen,
    label: "Advice",
    className: "bg-green-100 text-green-800",
  },
  [MessageTypes.ACTION]: {
    icon: CheckSquare,
    label: "Action Item",
    className: "bg-purple-100 text-purple-800",
  },
  // Fallback for unknown message types
  unknown: {
    icon: AlertCircle,
    label: "Unknown",
    className: "bg-gray-100 text-gray-800",
  },
};

export function MessageBubble({ message = {} }) {
  // Safely get message properties with defaults
  const { 
    type = MessageTypes.NORMAL, 
    sender = 'mentor', 
    content = '',
    timestamp = new Date(),
    senderName = '',
    receiverName = ''
  } = message;

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isMentor = sender === 'mentor' || sender?._id === (user?._id || user?.id);
  
  // Get config with fallback to unknown type
  const config = typeConfig[type] || typeConfig.unknown;
  const Icon = config?.icon || AlertCircle;

  const formatTime = (date) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return isNaN(dateObj.getTime()) 
        ? 'Invalid Date' 
        : dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return '--:--';
    }
  };

  const cn = (...classes) => classes.filter(Boolean).join(' ');

  // Handle session info messages differently
  if (message.isSessionInfo) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm px-4 py-2 rounded-full">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full mb-3", isMentor ? "justify-start" : "justify-end")}>
      <div className={cn("max-w-[80%] relative", isMentor ? "pr-4" : "pl-4")}>
        {/* Sender name for group chats */}
        {senderName && !isMentor && (
          <div className="text-xs text-gray-500 mb-1 ml-1">
            {senderName}
          </div>
        )}
        
        <div 
          className={cn(
            "rounded-2xl px-4 py-2 text-sm transition-all duration-200",
            isMentor 
              ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none" 
              : "bg-blue-500 text-white rounded-tr-none",
            "hover:shadow-lg hover:shadow-gray-900/20"
          )}
        >
          {/* Message type indicator */}
          {type !== MessageTypes.NORMAL && (
            <div className={cn("flex items-center mb-1 text-xs font-medium", isMentor ? 'text-gray-500' : 'text-blue-100')}>
              <Icon className="w-3.5 h-3.5 mr-1" />
              <span>{config.label}</span>
            </div>
          )}
          
          {/* Message content */}
          <div className="whitespace-pre-wrap break-words">
            {content || 'No content'}
          </div>
          
          {/* Message time */}
          <div className={cn("text-xs mt-1 text-right", isMentor ? 'text-gray-500' : 'text-blue-100')}>
            {formatTime(timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
}
