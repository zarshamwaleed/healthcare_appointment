import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Settings,
  Check,
  HelpCircle,
  Clock,
  Zap,
  MessageSquare
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const VoiceAssistant = () => {
  const { settings, updateSettings } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceCommands, setVoiceCommands] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const animationRef = useRef(null);
  const recognitionRef = useRef(null);

  const voicePresets = [
    { id: 'slow', name: 'Slow & Clear', rate: 0.7, description: 'For elderly users', icon: <Clock size={16} /> },
    { id: 'normal', name: 'Normal Speed', rate: 1.0, description: 'Standard pace', icon: <Volume2 size={16} /> },
    { id: 'fast', name: 'Fast Response', rate: 1.3, description: 'For experienced users', icon: <Zap size={16} /> },
  ];

  const commonCommands = [
    { command: "Book appointment", description: "Start booking process" },
    { command: "Find dermatologist", description: "Search for skin specialist" },
    { command: "Tomorrow morning", description: "Schedule for tomorrow AM" },
    { command: "Show my bookings", description: "View appointments" },
    { command: "Emergency help", description: "Contact emergency services" },
    { command: "Go to home", description: "Return to homepage" },
    { command: "Accessibility settings", description: "Open settings menu" },
    { command: "Speak slower", description: "Reduce speech rate" },
  ];

  useEffect(() => {
    // Simulate Web Speech API initialization
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript(prev => prev + transcript);
            processVoiceCommand(transcript);
          } else {
            interimTranscript += transcript;
          }
        }
        // Show interim results
        if (interimTranscript) {
          setTranscript(interimTranscript);
        }
      };
    }

    // Animation for audio level
    const animateAudioLevel = () => {
      if (isListening) {
        setAudioLevel(Math.random() * 100);
        animationRef.current = requestAnimationFrame(animateAudioLevel);
      }
    };

    if (isListening) {
      animationRef.current = requestAnimationFrame(animateAudioLevel);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setAudioLevel(0);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening]);

  const toggleVoiceControl = () => {
    const newState = !settings.voiceAssistance;
    updateSettings({ voiceAssistance: newState });
    
    if (newState) {
      setFeedbackMessage("Voice assistance activated. Say 'Help' for commands.");
      speakMessage("Voice assistance activated. How can I help you today?");
    } else {
      setIsListening(false);
      setFeedbackMessage("Voice assistance turned off.");
    }
  };

  const toggleListening = () => {
    if (!settings.voiceAssistance) {
      setFeedbackMessage("Please enable voice assistance first.");
      return;
    }

    const newListeningState = !isListening;
    setIsListening(newListeningState);

    if (newListeningState) {
      setFeedbackMessage("Listening... Speak now.");
      speakMessage("I'm listening. How can I help you?");
      // Start recognition in real implementation
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } else {
      setFeedbackMessage("Stopped listening.");
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  const speakMessage = (message) => {
    if (!settings.voiceAssistance || typeof window === 'undefined') return;

    setIsSpeaking(true);
    
    // Simulate speech synthesis
    setTimeout(() => {
      setIsSpeaking(false);
    }, message.length * 50); // Rough timing based on message length

    // In real implementation, use:
    // const utterance = new SpeechSynthesisUtterance(message);
    // utterance.rate = speechRate;
    // window.speechSynthesis.speak(utterance);
    // utterance.onend = () => setIsSpeaking(false);
  };

  const processVoiceCommand = (command) => {
    const normalizedCommand = command.toLowerCase().trim();
    setVoiceCommands(prev => [
      { command: normalizedCommand, timestamp: new Date().toLocaleTimeString() },
      ...prev.slice(0, 4)
    ]);

    // Command processing logic
    if (normalizedCommand.includes('book') || normalizedCommand.includes('appointment')) {
      setFeedbackMessage("Opening appointment booking...");
      speakMessage("Let's book an appointment. Please describe your symptoms.");
    } else if (normalizedCommand.includes('help')) {
      setFeedbackMessage("Available commands: Book appointment, Find doctor, Emergency help");
      speakMessage("You can say: Book appointment, Find a doctor, or Emergency help.");
    } else if (normalizedCommand.includes('emergency')) {
      setFeedbackMessage("⚠️ Emergency mode activated!");
      speakMessage("Emergency assistance requested. Please hold while we connect you.");
    } else {
      setFeedbackMessage(`Command received: "${normalizedCommand}"`);
      speakMessage(`I heard: ${normalizedCommand}`);
    }
  };

  const setPresetRate = (rate) => {
    setSpeechRate(rate);
    setFeedbackMessage(`Speech rate set to ${rate === 0.7 ? 'Slow' : rate === 1.0 ? 'Normal' : 'Fast'}`);
    speakMessage(`Speech rate adjusted to ${rate === 0.7 ? 'slow' : rate === 1.0 ? 'normal' : 'fast'} pace.`);
  };

  const clearTranscript = () => {
    setTranscript('');
    setFeedbackMessage("Transcript cleared.");
  };

  const simulateCommand = (command) => {
    processVoiceCommand(command);
  };

  return (
    <div className="space-y-6">
      {/* Main Voice Control Panel */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Mic size={28} className="text-purple-600" />
              Voice Assistant
            </h3>
            <p className="text-gray-600">Navigate and book appointments using voice commands</p>
          </div>
          
          <button
            onClick={toggleVoiceControl}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              settings.voiceAssistance 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {settings.voiceAssistance ? (
              <>
                <Volume2 size={20} />
                Voice ON
              </>
            ) : (
              <>
                <VolumeX size={20} />
                Voice OFF
              </>
            )}
          </button>
        </div>

        {/* Status Indicator */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${settings.voiceAssistance ? 'bg-white border border-purple-200' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${settings.voiceAssistance ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-500'}`}>
                <Volume2 size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-bold">{settings.voiceAssistance ? 'Active' : 'Disabled'}</p>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${isListening ? 'bg-white border border-green-200' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isListening ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                <Mic size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Listening</p>
                <p className="font-bold">{isListening ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${isSpeaking ? 'bg-white border border-blue-200' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isSpeaking ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Speaking</p>
                <p className="font-bold">{isSpeaking ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Control Center */}
        {settings.voiceAssistance && (
          <div className="space-y-6">
            {/* Microphone Control */}
            <div className="p-6 bg-white rounded-xl border border-purple-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    <Mic size={20} />
                    Voice Control
                  </h4>
                  <p className="text-gray-600">Click to start speaking or use wake word "Hello Health"</p>
                </div>
                
                <button
                  onClick={toggleListening}
                  className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all ${
                    isListening 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-pulse' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff size={24} />
                      STOP LISTENING
                    </>
                  ) : (
                    <>
                      <Mic size={24} />
                      START SPEAKING
                    </>
                  )}
                </button>
              </div>

              {/* Audio Visualization */}
              <div className="mb-6">
                <div className="h-20 bg-gradient-to-b from-gray-50 to-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-end h-full gap-1">
                    {Array.from({ length: 40 }).map((_, i) => {
                      const height = isListening 
                        ? Math.max(10, Math.random() * 60 + audioLevel / 3)
                        : Math.random() * 10;
                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded-t transition-all duration-100 ${
                            isListening 
                              ? 'bg-gradient-to-t from-purple-500 to-pink-400' 
                              : 'bg-gray-300'
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Feedback Area */}
              {feedbackMessage && (
                <div className={`p-4 rounded-lg mb-4 animate-fade-in ${
                  feedbackMessage.includes('Emergency') 
                    ? 'bg-red-50 border border-red-200 text-red-700' 
                    : 'bg-blue-50 border border-blue-200 text-blue-700'
                }`}>
                  <div className="flex items-center gap-2">
                    {feedbackMessage.includes('Emergency') ? <Zap size={16} /> : <MessageSquare size={16} />}
                    <p className="font-medium">{feedbackMessage}</p>
                  </div>
                </div>
              )}

              {/* Transcript Area */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold">What I Heard:</h5>
                  {transcript && (
                    <button
                      onClick={clearTranscript}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg min-h-[60px] border border-gray-200">
                  {transcript || (
                    <p className="text-gray-400 italic">
                      {isListening ? "Speak now... I'm listening" : "Press START SPEAKING to begin"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Speech Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Speech Rate Presets */}
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Settings size={20} />
                  Speech Settings
                </h4>
                <div className="space-y-3">
                  {voicePresets.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => setPresetRate(preset.rate)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        speechRate === preset.rate 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            speechRate === preset.rate 
                              ? 'bg-purple-100 text-purple-600' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {preset.icon}
                          </div>
                          <div>
                            <h5 className="font-bold">{preset.name}</h5>
                            <p className="text-sm text-gray-600">{preset.description}</p>
                          </div>
                        </div>
                        {speechRate === preset.rate && (
                          <Check size={20} className="text-purple-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Rate Slider */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Slower</span>
                    <span className="font-bold">Speed: {speechRate.toFixed(1)}x</span>
                    <span>Faster</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600"
                  />
                </div>
              </div>

              {/* Common Commands */}
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <HelpCircle size={20} />
                  Try These Commands
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {commonCommands.map((cmd, index) => (
                    <button
                      key={index}
                      onClick={() => simulateCommand(cmd.command)}
                      className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-left transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800 group-hover:text-purple-600">
                            "{cmd.command}"
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{cmd.description}</p>
                        </div>
                        <Play size={16} className="text-gray-400 group-hover:text-purple-500" />
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 <strong>Tip:</strong> Say "Help" at any time to hear available commands. 
                    The system understands natural language.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Commands */}
            {voiceCommands.length > 0 && (
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h4 className="font-bold mb-4">Recent Commands</h4>
                <div className="space-y-2">
                  {voiceCommands.map((cmd, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded">
                          <MessageSquare size={16} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{cmd.command}</p>
                          <p className="text-xs text-gray-500">{cmd.timestamp}</p>
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Processed
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Voice Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <h4 className="font-bold text-amber-800 mb-3">🎯 For Elderly Users</h4>
                <ul className="space-y-2 text-amber-700">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Use "Slow & Clear" speech rate for better understanding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Speak clearly and at a moderate pace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Use simple commands like "Book appointment"</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <h4 className="font-bold text-green-800 mb-3">🔊 For Best Results</h4>
                <ul className="space-y-2 text-green-700">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Use in a quiet environment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Speak close to the microphone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Allow microphone access in browser settings</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Voice Disabled State */}
        {!settings.voiceAssistance && (
          <div className="text-center py-12">
            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
              <VolumeX size={48} className="text-gray-400" />
            </div>
            <h4 className="text-xl font-bold mb-2">Voice Assistant Disabled</h4>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Enable voice assistance to navigate the healthcare system using voice commands. 
              Perfect for elderly users, those with mobility issues, or anyone preferring hands-free interaction.
            </p>
            <button
              onClick={toggleVoiceControl}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              Enable Voice Assistant
            </button>
          </div>
        )}
      </div>

      {/* Accessibility Compliance */}
      <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-purple-200">
        <h4 className="font-bold text-purple-800 mb-3">♿ Voice Accessibility Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg">
            <h5 className="font-semibold mb-2 flex items-center gap-2">
              <Mic size={16} />
              Hands-Free Navigation
            </h5>
            <p className="text-sm text-gray-600">
              Complete control without using hands. Essential for users with mobility impairments.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h5 className="font-semibold mb-2 flex items-center gap-2">
              <Volume2 size={16} />
              Audio Feedback
            </h5>
            <p className="text-sm text-gray-600">
              Verbal confirmation of all actions. Helps visually impaired users navigate confidently.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h5 className="font-semibold mb-2 flex items-center gap-2">
              <Settings size={16} />
              Adjustable Speech
            </h5>
            <p className="text-sm text-gray-600">
              Customize speech rate and tone to match user preference and hearing ability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;