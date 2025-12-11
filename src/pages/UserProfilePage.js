// src/pages/UserProfilePage.jsx
import React from 'react';
import { useUser } from '../context/UserContext';

import UserPreferences from '../components/user-profile/UserPreferences';
import PersonaSelector from '../components/user-profile/PersonaSelector';
import HistoryView from '../components/user-profile/HistoryView';

const UserProfilePage = () => {
  const { user } = useUser();
  
  return (
  
      <div className="profile-container p-6 min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 transition-colors">
        <div className="profile-header mb-8 flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-blue-100 flex items-center justify-center">
            <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary-600 font-bold text-xl">{user?.name?.charAt(0) || 'U'}</div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
            {user && (
              <p className="text-gray-600 dark:text-gray-300 mt-2">Welcome back, {user.name}</p>
            )}
            <div className="mt-3 flex gap-4">
              <div className="px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-lg text-sm">
                <div className="text-xs text-gray-500 dark:text-gray-400">Appointments</div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">{user?.appointments?.length || 0}</div>
              </div>
              <div className="px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-lg text-sm">
                <div className="text-xs text-gray-500 dark:text-gray-400">Saved Doctors</div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">{user?.savedDoctors?.length || 0}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Interface Preferences</h2>
            <PersonaSelector />
            <div className="mt-6">
              <UserPreferences />
            </div>
          </div>

          <div className="col-span-1">
            <div className="mb-8 bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Appointments</h2>
              <HistoryView />
            </div>
          </div>
        </div>
      </div>
  
  );
};

export default UserProfilePage;