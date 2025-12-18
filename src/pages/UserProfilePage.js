// src/pages/UserProfilePage.jsx
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Heart, Settings, Shield, Bell, Globe, Palette, LogOut, Edit2, Download, ChevronRight, Zap, Activity, Award } from 'lucide-react';
// import UserPreferences from '../components/user-profile/UserPreferences';
// import PersonaSelector from '../components/user-profile/PersonaSelector';
import HistoryView from '../components/user-profile/HistoryView';

const UserProfilePage = () => {
  const { user } = useUser();
  const { settings } = useAccessibility();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  const handleEditProfile = () => {
    alert('Edit profile feature - Redirect to edit form');
    // Can be enhanced with actual edit modal later
  };

  const handleExportData = () => {
    // Simulate data export
    const data = JSON.stringify(user, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', `profile_${user?.name || 'user'}_${new Date().toISOString().split('T')[0]}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    alert('Profile data exported successfully!');
  };

  const handleSignOut = () => {
    const confirmed = window.confirm('Are you sure you want to sign out?');
    if (confirmed) {
      alert('Signing out...');
      navigate('/');
    }
  };

  const handleChangePassword = () => {
    alert('Change password feature - Redirect to password change form');
  };

  const handleManageSessions = () => {
    alert('Manage active sessions - Show list of devices/browsers');
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Are you sure? This action cannot be undone. Type "DELETE" to confirm.');
    if (confirmed) {
      alert('Account deletion process started...');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors">
      {/* Header Background */}
      <div className="bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500 dark:from-primary-600 dark:via-blue-600 dark:to-purple-600 h-32 md:h-40 relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              {/* Left: Avatar & Info */}
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-500 dark:from-primary-600 dark:to-blue-600 p-1 shadow-lg">
                    <div className="w-full h-full rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center">
                      {user?.profileImage ? (
                        <img 
                          src={user.profileImage} 
                          alt={user.name} 
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        <User size={56} className="text-primary-600 dark:text-primary-400" />
                      )}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 dark:bg-green-400 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {user?.name || 'Zarsham Butt'}
                    </h1>
                    <Shield size={24} className="text-green-500 dark:text-green-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                    {user?.email || 'zarshamwaleedbutt.com'}
                  </p>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-4 py-2 bg-gradient-to-r from-primary-100 to-blue-100 dark:from-primary-900/40 dark:to-blue-900/40 text-primary-800 dark:text-primary-300 rounded-full text-sm font-semibold flex items-center gap-2 border border-primary-200 dark:border-primary-700">
                      <Zap size={14} />
                      {user?.persona || 'Standard User'}
                    </span>
                    <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-800 dark:text-green-300 rounded-full text-sm font-semibold flex items-center gap-2 border border-green-200 dark:border-green-700">
                      <Shield size={14} />
                      Verified
                    </span>
                    <span className="px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-amber-800 dark:text-amber-300 rounded-full text-sm font-semibold flex items-center gap-2 border border-amber-200 dark:border-amber-700">
                      <Award size={14} />
                      Member Since 2024
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex flex-col gap-3 md:justify-start">
                <button 
                  onClick={handleEditProfile}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-105">
                  <Edit2 size={18} />
                  Edit Profile
                </button>
                <button 
                  onClick={handleExportData}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors">
                  <Download size={18} />
                  Export Data
                </button>
                <button 
                  onClick={handleSignOut}
                  className="px-6 py-3 border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2 transition-colors">
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Appointments */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-blue-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg">
                <Calendar size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">↑ 12%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {user?.appointments?.length || 0}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Appointments</p>
          </div>

          {/* Saved Doctors */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all hover:border-pink-300 dark:hover:border-pink-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-lg">
                <Heart size={24} className="text-pink-600 dark:text-pink-400" />
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">New</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {user?.savedDoctors?.length || 5}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Saved Doctors</p>
          </div>

          {/* Upcoming */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all hover:border-amber-300 dark:hover:border-amber-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg">
                <Bell size={24} className="text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">Alert</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {user?.upcomingAppointments?.length || 2}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Upcoming Today</p>
          </div>

          {/* Health Score */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all hover:border-green-300 dark:hover:border-green-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
                <Activity size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">Excellent</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              95/100
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Health Score</p>
          </div>
        </div>

        {/* Main Content Tabs & Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden sticky top-8">
              <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Dashboard</h3>
              </div>
              <nav className="p-4 space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: Globe },
                  // { id: 'preferences', label: 'Preferences', icon: Settings },
                  // { id: 'persona', label: 'Persona', icon: User },
                  { id: 'history', label: 'History', icon: Calendar },
                  { id: 'security', label: 'Security', icon: Shield },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-left ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-primary-500 to-blue-500 text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                    {activeSection === item.id && <ChevronRight size={18} className="ml-auto" />}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <Globe size={28} className="text-primary-600 dark:text-primary-400" />
                      Overview
                    </h2>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Profile Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Full Name</p>
                          <p className="text-gray-900 dark:text-white font-semibold">{user?.name || 'Zarsham Waleed'}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Email Address</p>
                          <p className="text-gray-900 dark:text-white font-semibold">{user?.email || 'zarshamwaleedbutt@gmail.com'}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Phone Number</p>
                          <p className="text-gray-900 dark:text-white font-semibold">{user?.phone || '+923042825000'}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Date of Birth</p>
                          <p className="text-gray-900 dark:text-white font-semibold">{user?.dateOfBirth || 'Sep 16, 2003'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

           

            {/* Preferences Section */}
            {activeSection === 'preferences' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <Settings size={28} className="text-primary-600 dark:text-primary-400" />
                      Preferences & Accessibility
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Customize your experience with detailed preferences</p>
                  </div>
                  {/* <div className="p-6">
                    <UserPreferences />
                  </div> */}
                </div>
              </div>
            )}

            {/* History Section */}
            {activeSection === 'history' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <Calendar size={28} className="text-primary-600 dark:text-primary-400" />
                      Appointment History
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">View your complete appointment history and records</p>
                  </div>
                  <div className="p-6">
                    <HistoryView showStats={true} showFilters={true} />
                  </div>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <Shield size={28} className="text-primary-600 dark:text-primary-400" />
                      Security & Privacy
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account security and privacy settings</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="flex items-start gap-3">
                        <Shield className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                          <h4 className="font-semibold text-green-800 dark:text-green-300">Two-Factor Authentication</h4>
                          <p className="text-sm text-green-700 dark:text-green-400 mt-1">Status: <span className="font-bold">Enabled</span></p>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={handleChangePassword}
                      className="w-full py-3 border-2 border-primary-500 text-primary-600 dark:text-primary-400 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                      Change Password
                    </button>
                    <button 
                      onClick={handleManageSessions}
                      className="w-full py-3 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      Manage Sessions
                    </button>
                    <button 
                      onClick={handleDeleteAccount}
                      className="w-full py-3 border-2 border-red-500 text-red-600 dark:text-red-400 rounded-lg font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 text-gray-600 dark:text-gray-400 text-sm">
          <p>© 2024 Healthcare Appointment System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;