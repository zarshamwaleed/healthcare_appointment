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

      <div className="mt-12 p-6 bg-gray-50 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Need Help Choosing?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg">
            <h3 className="font-semibold mb-2">👵 For Elderly Users</h3>
            <p className="text-sm text-gray-600">
              Choose Elderly Mode for larger text, simpler navigation, and voice assistance.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h3 className="font-semibold mb-2">🎯 For Low Literacy</h3>
            <p className="text-sm text-gray-600">
              Choose Icon Mode for visual navigation with minimal text reading.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h3 className="font-semibold mb-2">🎤 Voice Preference</h3>
            <p className="text-sm text-gray-600">
              Choose Voice Mode to navigate and book using voice commands.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate('/symptoms')}
          className="btn-primary px-8 py-3"
        >
          Continue to Symptoms Input →
        </button>
      </div>
    </div>
  );
};

export default ModeSelectionPage;