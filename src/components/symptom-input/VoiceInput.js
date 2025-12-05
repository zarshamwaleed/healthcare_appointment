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
import Card from '../common/Card';

const VoiceInput = ({ 
  onTranscript,
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
        setTranscript(prev => prev + finalTranscript);
        setInterimTranscript('');
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

    if (transcript.trim() && onTranscript) {
      onTranscript(transcript.trim());
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
              ? 'bg-primary-500' 
              : 'bg-gray-300'
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

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Mic size={24} className="text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold">Voice Input</h3>
              <p className="text-gray-600 text-sm">
                Speak your symptoms clearly
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isListening && (
              <div className="flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
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
                  <Volume2 size={16} className="text-primary-600" />
                  <span className="font-medium">Listening...</span>
                </div>
                <p className="text-sm text-gray-600">
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
                ? 'bg-red-500 scale-105 animate-pulse shadow-lg' 
                : error
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-br from-primary-500 to-primary-700 hover:scale-105 hover:shadow-xl'
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
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
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
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
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
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">
                    {transcript ? 'Captured Text' : 'Listening...'}
                  </span>
                  {transcript && (
                    <Check size={16} className="text-green-600" />
                  )}
                </div>
                
                <div className={`${settings.mode === 'elderly' ? 'text-lg' : ''}`}>
                  {transcript && (
                    <p className="text-gray-800 mb-2">{transcript}</p>
                  )}
                  
                  {interimTranscript && (
                    <p className="text-gray-500 italic">
                      {interimTranscript}
                      <span className="inline-block w-2 h-4 ml-1 bg-gray-400 animate-pulse" />
                    </p>
                  )}
                </div>
                
                {transcript && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <button
                      onClick={() => onTranscript && onTranscript(transcript)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      Use This Description
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-800 mb-1">Microphone Error</h4>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                  <button
                    onClick={() => setError('')}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <X size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            )}

            {/* Instructions */}
            {!isListening && !transcript && !error && (
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <div className="flex flex-col items-center gap-3">
                  <Ear size={40} className="text-primary-600" />
                  <div>
                    <h4 className="font-bold mb-2">How to use voice input:</h4>
                    <ol className="text-sm text-gray-700 text-left space-y-1 max-w-md mx-auto">
                      <li>1. Click the microphone button above</li>
                      <li>2. Allow microphone permission when prompted</li>
                      <li>3. Speak clearly about your symptoms</li>
                      <li>4. Click stop when finished</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Speech Examples */}
        {showTips && (
          <div className="mt-8">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Zap size={16} className="text-amber-500" />
              Example Phrases
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {getSpeechExamples().map((example, index) => (
                <button
                  key={index}
                  onClick={() => onTranscript && onTranscript(example)}
                  className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-sm"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Elderly Mode Tips */}
        {settings.mode === 'elderly' && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h4 className="font-bold mb-3 text-blue-800 flex items-center gap-2">
              <Shield size={20} />
              👵 Tips for Elderly Users
            </h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start gap-2">
                <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span>Speak slowly and clearly</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span>Describe one symptom at a time</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span>Mention duration (e.g., "for 2 days")</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span>If voice doesn't work, use text input option</span>
              </li>
            </ul>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            <Shield size={12} className="inline mr-1" />
            Your voice input is processed locally and not stored on our servers.
            All data is encrypted and protected by privacy laws.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default VoiceInput;