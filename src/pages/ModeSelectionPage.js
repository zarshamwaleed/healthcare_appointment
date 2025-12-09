import React from 'react';
import { useNavigate } from 'react-router-dom';
import ModeSelection from '../components/mode-selection/ModeSelection';

const ModeSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Choose Your Interface Mode
        </h1>
        <p className="text-gray-600 text-lg">
          Select the mode that best suits your needs. The interface will adapt to provide the best experience.
        </p>
      </div>

      <ModeSelection />

      <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Need Help Choosing?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg mb-3 text-blue-900">For Elderly Users</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Choose Elderly Mode for larger text, simpler navigation, and voice assistance.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
            <h3 className="font-bold text-lg mb-3 text-gray-900">Easy Mode</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Choose Icon Mode for visual navigation with minimal text reading.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
            <h3 className="font-bold text-lg mb-3 text-purple-900">Voice Preference</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Choose Voice Mode to navigate and book using voice commands.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate('/symptoms')}
          className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transform hover:scale-105 transition-all duration-300 hover:bg-blue-700"
        >
          Continue to Symptoms Input →
        </button>
      </div>
    </div>
  );
};

export default ModeSelectionPage;