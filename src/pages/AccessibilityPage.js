import React from 'react';
import HighContrastToggle from '../components/accessibility/HighContrastToggle';
import TextSizeControl from '../components/accessibility/TextSizeControl';
import VoiceAssistant from '../components/accessibility/VoiceAssistant';
const AccessibilityPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Accessibility Settings</h1>
      
      <div className="space-y-8">
        {/* Visual Preferences */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Visual Preferences</h2>
          <HighContrastToggle />
          <TextSizeControl />
           <VoiceAssistant />
        </section>
        
        {/* Add other accessibility controls here */}
      </div>
    </div>
  );
};

export default AccessibilityPage;
