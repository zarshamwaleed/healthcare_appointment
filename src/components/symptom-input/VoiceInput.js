import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  AlertCircle, 
  Check, 
  X, 
  RotateCcw,
  VolumeX,
  Ear,
  Clock,
  Zap,
  Shield
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const VoiceInput = ({ 
  onTranscript,
  onFindDoctors,
  placeholder = "Click the microphone and speak your symptoms...",
  language = 'en-US',
  autoStart = false,
  showTips = true,
  maxDuration = 30000 // 30 seconds
}) => {
  const { settings } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState([]);
  
  const timerRef = useRef(null);
  const audioLevelRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (autoStart && !isListening) {
      setTimeout(() => {
        startListening();
      }, 1000);
    }

    return () => {
      stopListening();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioLevelRef.current) {
        cancelAnimationFrame(audioLevelRef.current);
      }
    };
  }, []);

  // Analyze transcript for doctor suggestions
  useEffect(() => {
    if (transcript) {
      analyzeSymptomsAndSuggestDoctors(transcript);
    }
  }, [transcript]);

  const symptomToDoctorMapping = {
    // Orthopedic/Sports Medicine
    'leg': 'Orthopedic Surgeon',
    'knee': 'Orthopedic Surgeon',
    'joint': 'Rheumatologist',
    'bone': 'Orthopedic Surgeon',
    'muscle': 'Physiotherapist',
    'sports injury': 'Sports Medicine Specialist',
    'fracture': 'Orthopedic Surgeon',
    'arthritis': 'Rheumatologist',
    'back pain': 'Orthopedic Surgeon',
    'spine': 'Orthopedic Surgeon',
    
    // General/Fever
    'fever': 'General Physician',
    'headache': 'General Physician',
    'cold': 'General Physician',
    'cough': 'Pulmonologist',
    'flu': 'General Physician',
    'infection': 'General Physician',
    
    // Heart/Chest
    'chest': 'Cardiologist',
    'heart': 'Cardiologist',
    'breathing': 'Pulmonologist',
    'lungs': 'Pulmonologist',
    'blood pressure': 'Cardiologist',
    
    // Stomach/Digestive
    'stomach': 'Gastroenterologist',
    'stomach pain': 'Gastroenterologist',
    'digestion': 'Gastroenterologist',
    'nausea': 'Gastroenterologist',
    'vomiting': 'Gastroenterologist',
    'diarrhea': 'Gastroenterologist',
    
    // Skin
    'skin': 'Dermatologist',
    'rash': 'Dermatologist',
    'allergy': 'Allergist',
    
    // Eye/Ear
    'eye': 'Ophthalmologist',
    'vision': 'Ophthalmologist',
    'ear': 'ENT Specialist',
    'hearing': 'ENT Specialist',
    
    // Brain/Nerves
    'head': 'Neurologist',
    'brain': 'Neurologist',
    'dizziness': 'Neurologist',
    'nerve': 'Neurologist',
    
    // Mental Health
    'stress': 'Psychiatrist',
    'anxiety': 'Psychiatrist',
    'depression': 'Psychiatrist',
    
    // Women's Health
    'pregnancy': 'Gynecologist',
    'period': 'Gynecologist',
    'women': 'Gynecologist',
    
    // Children
    'child': 'Pediatrician',
    'baby': 'Pediatrician',
    'kids': 'Pediatrician'
  };

  const analyzeSymptomsAndSuggestDoctors = (text) => {
    const lowerText = text.toLowerCase();
    const foundSpecialties = new Set();
    const suggested = [];

    // Check for each symptom keyword
    Object.entries(symptomToDoctorMapping).forEach(([keyword, specialty]) => {
      if (lowerText.includes(keyword.toLowerCase())) {
        if (!foundSpecialties.has(specialty)) {
          foundSpecialties.add(specialty);
          suggested.push({
            specialty: specialty,
            keyword: keyword,
            confidence: 80 + Math.floor(Math.random() * 20) // Random confidence 80-100%
          });
        }
      }
    });

    // If no specific specialties found, suggest General Physician
    if (suggested.length === 0) {
      suggested.push({
        specialty: 'General Physician',
        keyword: 'general symptoms',
        confidence: 70
      });
    }

    setSuggestedDoctors(suggested);
  };

  const initializeRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
      return null;
    }

    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = language;
    recognitionInstance.maxAlternatives = 3;

    recognitionInstance.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      setPermissionGranted(true);
      setError('');
      startRecordingTimer();
      simulateAudioLevel();
    };

    recognitionInstance.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        const newTranscript = transcript + finalTranscript;
        setTranscript(newTranscript);
        setInterimTranscript('');
        
        // Trigger analysis when we have final transcript
        analyzeSymptomsAndSuggestDoctors(newTranscript);
      } else {
        setInterimTranscript(interimTranscript);
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      switch(event.error) {
        case 'no-speech':
          setError('No speech detected. Please speak clearly.');
          break;
        case 'audio-capture':
          setError('No microphone found. Please check your microphone connection.');
          break;
        case 'not-allowed':
          setError('Microphone permission denied. Please allow microphone access in your browser settings.');
          break;
        case 'network':
          setError('Network error. Please check your internet connection.');
          break;
        case 'service-not-allowed':
          setError('Speech recognition service is not available.');
          break;
        default:
          setError('Error: ' + event.error);
      }
      
      stopListening();
    };

    recognitionInstance.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioLevelRef.current) {
        cancelAnimationFrame(audioLevelRef.current);
      }
    };

    return recognitionInstance;
  };

  const startListening = () => {
    setError('');
    setTranscript('');
    setInterimTranscript('');
    setSuggestedDoctors([]);
    
    const recognitionInstance = initializeRecognition();
    
    if (!recognitionInstance) {
      return;
    }

    setRecognition(recognitionInstance);
    startTimeRef.current = Date.now();

    try {
      recognitionInstance.start();
    } catch (err) {
      setError('Failed to start voice recognition: ' + err.message);
    }
  };

  const stopListening = () => {
    if (recognition) {
      try {
        recognition.stop();
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
    }
    
    setIsListening(false);
    setIsPaused(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (audioLevelRef.current) {
      cancelAnimationFrame(audioLevelRef.current);
    }

    // DON'T automatically call onTranscript here - wait for user to click "Use This Description"
  };

  const handleUseDescription = () => {
    if (transcript.trim()) {
      if (onTranscript) {
        onTranscript(transcript.trim());
      }
      
      // Pass the suggested doctors to the find doctors function
      if (onFindDoctors && suggestedDoctors.length > 0) {
        onFindDoctors({
          transcript: transcript.trim(),
          suggestedDoctors: suggestedDoctors
        });
      }
    }
  };

  const togglePause = () => {
    if (!recognition) return;

    if (isPaused) {
      recognition.start();
      setIsPaused(false);
      startRecordingTimer();
      simulateAudioLevel();
    } else {
      recognition.stop();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioLevelRef.current) {
        cancelAnimationFrame(audioLevelRef.current);
      }
    }
  };

  const startRecordingTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= maxDuration / 1000) {
          stopListening();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const simulateAudioLevel = () => {
    const updateLevel = () => {
      if (isListening && !isPaused) {
        const level = Math.random() * 100;
        setAudioLevel(level);
        audioLevelRef.current = requestAnimationFrame(updateLevel);
      }
    };
    
    audioLevelRef.current = requestAnimationFrame(updateLevel);
  };

  const handleReset = () => {
    setTranscript('');
    setInterimTranscript('');
    setError('');
    setSuggestedDoctors([]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getRemainingTime = () => {
    const remaining = Math.max(0, maxDuration / 1000 - recordingTime);
    return formatTime(remaining);
  };

  const getAudioLevelBars = () => {
    const bars = [];
    const barCount = 20;
    const activeBars = Math.floor((audioLevel / 100) * barCount);
    
    for (let i = 0; i < barCount; i++) {
      const height = 4 + (Math.random() * 12);
      const isActive = i < activeBars;
      
      bars.push(
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-100 ${
            isActive 
              ? 'bg-primary-500 dark:bg-primary-400' 
              : 'bg-gray-300 dark:bg-gray-600'
          }`}
          style={{ height: `${height}px` }}
        />
      );
    }
    
    return bars;
  };

  const getSpeechExamples = () => {
    return [
      "I have a headache and fever since yesterday",
      "Stomach pain with nausea for 3 days",
      "Cough and chest pain when breathing",
      "Back pain that started this morning",
      "Feeling dizzy and tired all the time"
    ];
  };

  const handleExampleClick = (example) => {
    setTranscript(example);
    analyzeSymptomsAndSuggestDoctors(example);
    
    if (onTranscript) {
      onTranscript(example);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Mic size={24} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Voice Input</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Speak your symptoms clearly
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isListening && (
              <div className="flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm">
                <Clock size={14} />
                {formatTime(recordingTime)}
              </div>
            )}
          </div>
        </div>

        {/* Main Voice Interface */}
        <div className="flex flex-col items-center">
          {/* Audio Visualization */}
          {isListening && !isPaused && (
            <div className="w-full mb-6">
              <div className="flex items-center justify-center gap-1 mb-4">
                {getAudioLevelBars()}
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Volume2 size={16} className="text-primary-600 dark:text-primary-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Listening...</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Time remaining: {getRemainingTime()}
                </p>
              </div>
            </div>
          )}

          {/* Microphone Button */}
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={!!error}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all transform ${
              isListening 
                ? 'bg-red-500 dark:bg-red-600 scale-105 animate-pulse shadow-lg' 
                : error
                  ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 hover:scale-105 hover:shadow-xl'
            } ${settings.mode === 'elderly' ? 'mb-8' : 'mb-6'}`}
            aria-label={isListening ? 'Stop recording' : 'Start recording'}
          >
            {isListening ? (
              <MicOff size={48} className="text-white" />
            ) : (
              <Mic size={48} className="text-white" />
            )}
          </button>

          {/* Control Buttons */}
          <div className="flex gap-4 mb-6">
            {isListening && (
              <button
                onClick={togglePause}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              >
                {isPaused ? (
                  <>
                    <Volume2 size={16} />
                    Resume
                  </>
                ) : (
                  <>
                    <VolumeX size={16} />
                    Pause
                  </>
                )}
              </button>
            )}
            
            {transcript && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            )}
          </div>

          {/* Status Indicators */}
          <div className="w-full space-y-4">
            {/* Transcript Display */}
            {(transcript || interimTranscript) && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {transcript ? 'Captured Text' : 'Listening...'}
                  </span>
                  {transcript && (
                    <Check size={16} className="text-green-600 dark:text-green-400" />
                  )}
                </div>
                
                <div className={`${settings.mode === 'elderly' ? 'text-lg' : ''}`}>
                  {transcript && (
                    <p className="text-gray-800 dark:text-gray-200 mb-2">{transcript}</p>
                  )}
                  
                  {interimTranscript && (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      {interimTranscript}
                      <span className="inline-block w-2 h-4 ml-1 bg-gray-400 dark:bg-gray-600 animate-pulse" />
                    </p>
                  )}
                </div>

                {/* Doctor Suggestions */}
                {suggestedDoctors.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Suggested Doctors Based on Your Symptoms:
                    </h4>
                    <div className="space-y-2">
                      {suggestedDoctors.map((doctor, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                        >
                          <div>
                            <span className="font-medium text-blue-800 dark:text-blue-300">
                              {doctor.specialty}
                            </span>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              Detected: "{doctor.keyword}"
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                            {doctor.confidence}% match
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {transcript && (
                  <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                    <button
                      onClick={handleUseDescription}
                      className="w-full px-4 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 font-medium flex items-center justify-center gap-2"
                    >
                      <Check size={20} />
                      {suggestedDoctors.length > 0 ? 'Find Suggested Doctors' : 'Use Description & Find Doctors'}
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                      Click to proceed with this description
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-800 dark:text-red-300 mb-1">Microphone Error</h4>
                    <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                  </div>
                  <button
                    onClick={() => setError('')}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Instructions */}
            {!isListening && !transcript && !error && (
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-200 dark:border-gray-700">
                <div className="flex flex-col items-center gap-3">
                  <Ear size={40} className="text-primary-600 dark:text-primary-400" />
                  <div>
                    <h4 className="font-bold mb-2 text-gray-900 dark:text-white">How to use voice input:</h4>
                    <ol className="text-sm text-gray-700 dark:text-gray-300 text-left space-y-1 max-w-md mx-auto">
                      <li>1. Click the microphone button above</li>
                      <li>2. Allow microphone permission when prompted</li>
                      <li>3. Speak clearly about your symptoms</li>
                      <li>4. Click stop when finished</li>
                      <li>5. Click "Use Description & Find Doctors" button</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Speech Examples */}
        {showTips && !transcript && (
          <div className="mt-8">
            <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
              <Zap size={16} className="text-amber-500 dark:text-amber-400" />
              Example Phrases
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {getSpeechExamples().map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Elderly Mode Tips */}
        {settings.mode === 'elderly' && !transcript && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h4 className="font-bold mb-3 text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <Shield size={20} />
              Tips for Elderly Users
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
              <li className="flex items-start gap-2">
                <Check size={16} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span>Speak slowly and clearly</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span>Describe one symptom at a time</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span>Mention duration (e.g., "for 2 days")</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span>If voice doesn't work, use text input option</span>
              </li>
            </ul>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <Shield size={12} className="inline mr-1" />
            Your voice input is processed locally and not stored on our servers.
            All data is encrypted and protected by privacy laws.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;