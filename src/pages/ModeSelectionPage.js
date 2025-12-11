import React from 'react';
import { useNavigate } from 'react-router-dom';
import ModeSelection from '../components/mode-selection/ModeSelection';

const ModeSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 transition-colors py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Choose Your Interface Mode
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Select the mode that best suits your needs. The interface will adapt to provide the best experience.
        </p>
      </div>

      <ModeSelection />

      <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl shadow-lg border border-blue-100 dark:border-slate-600">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Need Help Choosing?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg mb-3 text-blue-900 dark:text-blue-300">For Elderly Users</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Choose Elderly Mode for larger text, simpler navigation, and voice assistance.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
            <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Easy Mode</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Choose Icon Mode for visual navigation with minimal text reading.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
            <h3 className="font-bold text-lg mb-3 text-purple-900 dark:text-purple-300">Voice Preference</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Choose Voice Mode to navigate and book using voice commands.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate('/symptoms')}
          className="px-8 py-4 bg-blue-600 dark:bg-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-200 dark:shadow-blue-900/40 hover:shadow-xl hover:shadow-blue-300 dark:hover:shadow-blue-900/60 transform hover:scale-105 transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-500"
        >
          Continue to Symptoms Input →
        </button>
      </div>
    </div>
  );
};

export default ModeSelectionPage;