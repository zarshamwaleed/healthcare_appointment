// src/hooks/useVoiceInput.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { voiceService } from '../services/voiceService';

export const useVoiceInput = (options = {}) => {
  const {
    autoStart = false,
    language = 'en-US',
    continuous = false,
    onResult,
    onError,
    onStart,
    onStop,
    commands = []
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(true);

  const commandsRef = useRef(commands);
  const lastCommandTimeRef = useRef(0);

  // Update commands ref
  useEffect(() => {
    commandsRef.current = commands;
  }, [commands]);

  // Check support and set language on mount
  useEffect(() => {
    const checkSupport = () => {
      const hasRecognition = !!voiceService.recognition;
      const hasSynthesis = 'speechSynthesis' in window;
      setSupported(hasRecognition && hasSynthesis);
      
      if (!hasRecognition) {
        setError('Speech recognition not supported in this browser');
      }
    };
    
    checkSupport();
    voiceService.setLanguage(language);
    
    // Auto-start if enabled
    if (autoStart && supported) {
      startListening();
    }
    
    // Cleanup
    return () => {
      stopListening();
      voiceService.stopSpeaking();
    };
  }, [autoStart, language, supported]);

  // Process voice commands
  const processCommands = useCallback((text) => {
    const now = Date.now();
    const lowerText = text.toLowerCase().trim();
    
    // Avoid processing same command too quickly
    if (now - lastCommandTimeRef.current < 1000) {
      return false;
    }
    
    for (const command of commandsRef.current) {
      if (command.pattern.test(lowerText)) {
        lastCommandTimeRef.current = now;
        
        // Execute command action
        if (command.action) {
          command.action(text);
        }
        
        // Speak response if provided
        if (command.response) {
          speak(command.response);
        }
        
        // Clear transcript if command matched
        if (command.clearTranscript) {
          setTranscript('');
        }
        
        return true;
      }
    }
    
    return false;
  }, []);

  // Start listening
  const startListening = useCallback(() => {
    if (!supported) {
      setError('Voice input not supported');
      return false;
    }
    
    setError(null);
    
    const success = voiceService.startListening(
      // onResult
      (result) => {
        if (result.isFinal) {
          const finalTranscript = result.transcript;
          setTranscript(prev => prev + ' ' + finalTranscript);
          setInterimTranscript('');
          
          // Process commands
          const isCommand = processCommands(finalTranscript);
          
          // Call onResult callback if not a command
          if (onResult && !isCommand) {
            onResult(finalTranscript, result);
          }
        } else {
          setInterimTranscript(result.transcript);
        }
      },
      // onError
      (error) => {
        setError(error.message);
        setIsListening(false);
        if (onError) onError(error);
      },
      // onEnd
      () => {
        setIsListening(false);
        if (onStop) onStop();
      }
    );
    
    if (success) {
      setIsListening(true);
      if (onStart) onStart();
    }
    
    return success;
  }, [supported, onResult, onError, onStart, onStop, processCommands]);

  // Stop listening
  const stopListening = useCallback(() => {
    voiceService.stopListening();
    setIsListening(false);
  }, []);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Speak text
  const speak = useCallback(async (text, options = {}) => {
    if (!text || !supported) return;
    
    try {
      setIsSpeaking(true);
      await voiceService.speak(text, options);
    } catch (error) {
      setError(`Speech error: ${error.message}`);
    } finally {
      setIsSpeaking(false);
    }
  }, [supported]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
  }, []);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  // Add a voice command
  const addCommand = useCallback((pattern, action, options = {}) => {
    const command = {
      pattern: typeof pattern === 'string' ? new RegExp(`^${pattern}$`, 'i') : pattern,
      action,
      response: options.response,
      clearTranscript: options.clearTranscript || false
    };
    
    commandsRef.current = [...commandsRef.current, command];
  }, []);

  // Remove a voice command
  const removeCommand = useCallback((pattern) => {
    commandsRef.current = commandsRef.current.filter(
      cmd => cmd.pattern.toString() !== pattern.toString()
    );
  }, []);

  // Common health-related voice commands
  const addHealthCommands = useCallback(() => {
    const healthCommands = [
      {
        pattern: /^(book|schedule) appointment$/i,
        action: () => console.log('Booking appointment'),
        response: 'I can help you book an appointment. Please describe your symptoms.'
      },
      {
        pattern: /^(show|list) symptoms$/i,
        action: () => console.log('Listing symptoms'),
        response: 'Here are common symptoms: headache, fever, cough, fatigue, nausea.'
      },
      {
        pattern: /^emergency$/i,
        action: () => {
          console.log('Emergency mode');
          speak('Emergency detected. Calling for help.', { rate: 1.5, volume: 1 });
        },
        response: 'Emergency mode activated. Please stay calm.'
      },
      {
        pattern: /^repeat$/i,
        action: () => speak(transcript || 'Nothing to repeat'),
        clearTranscript: false
      },
      {
        pattern: /^clear$/i,
        action: clearTranscript,
        response: 'Transcript cleared.'
      },
      {
        pattern: /^help$/i,
        action: () => {
          const helpText = 'You can say: book appointment, list symptoms, emergency, repeat, clear, or help.';
          speak(helpText);
        }
      }
    ];
    
    healthCommands.forEach(cmd => addCommand(cmd.pattern, cmd.action, {
      response: cmd.response,
      clearTranscript: cmd.clearTranscript
    }));
  }, [addCommand, speak, transcript, clearTranscript]);

  // Speak symptoms for selection
  const speakSymptoms = useCallback((symptoms, delay = 1000) => {
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) return;
    
    let index = 0;
    
    const speakNext = () => {
      if (index < symptoms.length) {
        const symptom = symptoms[index];
        speak(`Symptom ${index + 1}: ${symptom.name || symptom}`)
          .then(() => {
            index++;
            setTimeout(speakNext, delay);
          })
          .catch(console.error);
      }
    };
    
    speakNext();
  }, [speak]);

  // Dictate text with pauses
  const dictate = useCallback(async (text, wordDelay = 100) => {
    if (!text) return;
    
    const words = text.split(' ');
    let index = 0;
    
    const speakNextWord = async () => {
      if (index < words.length) {
        try {
          await speak(words[index], { rate: 0.8 });
          index++;
          setTimeout(speakNextWord, wordDelay);
        } catch (error) {
          console.error('Dictation error:', error);
        }
      }
    };
    
    await speakNextWord();
  }, [speak]);

  // Get voice recognition status
  const getStatus = useCallback(() => {
    if (!supported) return 'unsupported';
    if (isListening) return 'listening';
    if (isSpeaking) return 'speaking';
    return 'ready';
  }, [supported, isListening, isSpeaking]);

  // Check if voice input is available
  const isAvailable = useCallback(() => {
    return supported && voiceService.recognition;
  }, [supported]);

  return {
    // State
    isListening,
    isSpeaking,
    transcript,
    interimTranscript,
    error,
    supported,
    
    // Actions
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
    clearTranscript,
    addCommand,
    removeCommand,
    addHealthCommands,
    speakSymptoms,
    dictate,
    
    // Getters
    getStatus,
    isAvailable
  };
};

export default useVoiceInput;