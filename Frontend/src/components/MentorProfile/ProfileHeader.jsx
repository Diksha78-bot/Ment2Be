import React from 'react';
import { FiMapPin, FiLinkedin, FiGithub, FiEdit } from 'react-icons/fi';

const ProfileHeader = ({ mentorData, isOwnProfile = false }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Profile Section */}
      <div className="p-6">
        <div className="flex items-start space-x-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            {mentorData.profileImage ? (
              <img
                className="h-32 w-32 rounded-full border-4 border-gray-100 object-cover"
                src={mentorData.profileImage}
                alt={mentorData.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`h-32 w-32 rounded-full border-4 border-gray-100 bg-gray-200 flex items-center justify-center ${mentorData.profileImage ? 'hidden' : 'flex'}`}
              style={{ display: mentorData.profileImage ? 'none' : 'flex' }}
            >
              <span className="text-4xl font-bold text-gray-500">
                {mentorData.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{mentorData.name}</h1>
                <p className="text-xl text-gray-600 mt-1">{mentorData.title}</p>
                
                {/* Bio */}
                <div className="mt-4">
                  <p className="text-gray-700 leading-relaxed max-w-2xl">
                    {mentorData.bio}
                  </p>
                </div>
                
                {/* Location and Social Links */}
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{mentorData.location}</span>
                  </div>
                  
                  {mentorData.socialLinks?.linkedin && (
                    <a 
                      href={mentorData.socialLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-blue-600 text-sm"
                    >
                      <FiLinkedin className="h-4 w-4 mr-1" />
                      LinkedIn
                    </a>
                  )}
                  
                  {mentorData.socialLinks?.github && (
                    <a 
                      href={mentorData.socialLinks.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-gray-900 text-sm"
                    >
                      <FiGithub className="h-4 w-4 mr-1" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
              
              {/* Action Button */}
              <div className="flex-shrink-0 ml-4">
                {isOwnProfile ? (
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <FiEdit className="h-4 w-4 mr-2" />
                    Edit profile
                  </button>
                ) : (
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                    Follow
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
