// src/pages/UserProfilePage.jsx
import React from 'react';
import { useUser } from '../context/UserContext';

import UserPreferences from '../components/user-profile/UserPreferences';
import PersonaSelector from '../components/user-profile/PersonaSelector';
import HistoryView from '../components/user-profile/HistoryView';

const UserProfilePage = () => {
  const { user } = useUser();
  
  return (
  
      <div className="profile-container p-6">
        <div className="profile-header mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          {user && (
            <p className="text-gray-600 mt-2">
              Welcome back, {user.name}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="col-span-1">
            <UserPreferences />
          </div>
          
          <div className="col-span-1">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Interface Preferences</h2>
              <PersonaSelector />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Appointments</h2>
              <HistoryView />
            </div>
          </div>
        </div>
      </div>
  
  );
};

export default UserProfilePage;