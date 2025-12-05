// src/services/voiceService.js

/**
 * Voice Service for Smart Health Appointment System
 * Handles speech recognition and speech synthesis
 */

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// Check browser support
export const isSpeechRecognitionSupported = () => {
  return !!SpeechRecognition;
};

export const isSpeechSynthesisSupported = () => {
  return 'speechSynthesis' in window;
};

// Available voices cache
let availableVoices = [];

// Voice service configuration
const defaultConfig = {
  recognition: {
    continuous: false,
    interimResults: true,
    lang: 'en-US',
    maxAlternatives: 1
  },
  synthesis: {
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    voice: null
  }
};

// Main voice service
class VoiceService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.config = { ...defaultConfig };
    this.onResultCallback = null;
    this.onErrorCallback = null;
    this.onEndCallback = null;
    this.utteranceQueue = [];
    this.isSpeaking = false;
    
    this.initialize();
  }
  
  /**
   * Initialize voice service
   */
  initialize() {
    if (isSpeechRecognitionSupported()) {
      this.recognition = new SpeechRecognition();
      this.applyRecognitionConfig();
      
      // Set up event handlers
      this.recognition.onresult = this.handleRecognitionResult.bind(this);
      this.recognition.onerror = this.handleRecognitionError.bind(this);
      this.recognition.onend = this.handleRecognitionEnd.bind(this);
    }
    
    if (isSpeechSynthesisSupported()) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }
  
  /**
   * Load available voices
   */
  loadVoices() {
    if (isSpeechSynthesisSupported()) {
      availableVoices = window.speechSynthesis.getVoices();
      
      // Try to set a preferred voice
      const preferredVoices = [
        'Microsoft David - English (United States)',
        'Google US English',
        'English (United States)'
      ];
      
      const preferredVoice = availableVoices.find(voice => 
        preferredVoices.some(pref => voice.name.includes(pref))
      );
      
      if (preferredVoice) {
        this.config.synthesis.voice = preferredVoice;
      } else if (availableVoices.length > 0) {
        this.config.synthesis.voice = availableVoices[0];
      }
    }
  }
  
  /**
   * Apply recognition configuration
   */
  applyRecognitionConfig() {
    if (this.recognition) {
      Object.entries(this.config.recognition).forEach(([key, value]) => {
        if (key in this.recognition) {
          this.recognition[key] = value;
        }
      });
    }
  }
  
  /**
   * Apply synthesis configuration
   */
  applySynthesisConfig() {
    // Configuration is applied per utterance
  }
  
  /**
   * Update configuration
   * @param {object} newConfig - New configuration
   */
  updateConfig(newConfig) {
    this.config = {
      ...this.config,
      ...newConfig
    };
    
    if (newConfig.recognition) {
      this.config.recognition = {
        ...this.config.recognition,
        ...newConfig.recognition
      };
      this.applyRecognitionConfig();
    }
    
    if (newConfig.synthesis) {
      this.config.synthesis = {
        ...this.config.synthesis,
        ...newConfig.synthesis
      };
    }
  }
  
  /**
   * Set language for speech recognition
   * @param {string} lang - Language code (e.g., 'en-US', 'es-ES')
   */
  setLanguage(lang) {
    this.updateConfig({
      recognition: { lang }
    });
  }
  
  /**
   * Set speech rate
   * @param {number} rate - Speech rate (0.1 to 10)
   */
  setRate(rate) {
    this.updateConfig({
      synthesis: { rate: Math.max(0.1, Math.min(10, rate)) }
    });
  }
  
  /**
   * Set speech pitch
   * @param {number} pitch - Speech pitch (0 to 2)
   */
  setPitch(pitch) {
    this.updateConfig({
      synthesis: { pitch: Math.max(0, Math.min(2, pitch)) }
    });
  }
  
  /**
   * Set speech volume
   * @param {number} volume - Speech volume (0 to 1)
   */
  setVolume(volume) {
    this.updateConfig({
      synthesis: { volume: Math.max(0, Math.min(1, volume)) }
    });
  }
  
  /**
   * Start speech recognition
   * @param {function} onResult - Callback for recognition results
   * @param {function} onError - Callback for errors
   * @param {function} onEnd - Callback when recognition ends
   * @returns {boolean} Success status
   */
  startListening(onResult, onError, onEnd) {
    if (!this.recognition) {
      console.error('Speech recognition not supported');
      if (onError) onError('Speech recognition not supported');
      return false;
    }
    
    if (this.isListening) {
      console.warn('Already listening');
      return false;
    }
    
    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.onEndCallback = onEnd;
    
    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      if (onError) onError(error.message);
      return false;
    }
  }
  
  /**
   * Stop speech recognition
   */
  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
      this.isListening = false;
    }
  }
  
  /**
   * Handle recognition result
   * @param {SpeechRecognitionEvent} event - Recognition event
   */
  handleRecognitionResult(event) {
    if (!event.results || event.results.length === 0) {
      return;
    }
    
    const result = event.results[event.resultIndex];
    const transcript = result[0].transcript;
    const isFinal = result.isFinal;
    
    if (this.onResultCallback) {
      this.onResultCallback({
        transcript,
        isFinal,
        confidence: result[0].confidence,
        alternatives: Array.from(result).map(alt => ({
          transcript: alt.transcript,
          confidence: alt.confidence
        }))
      });
    }
  }
  
  /**
   * Handle recognition error
   * @param {SpeechRecognitionError} error - Recognition error
   */
  handleRecognitionError(error) {
    console.error('Speech recognition error:', error);
    
    this.isListening = false;
    
    if (this.onErrorCallback) {
      this.onErrorCallback({
        error: error.error,
        message: this.getErrorMessage(error.error)
      });
    }
  }
  
  /**
   * Handle recognition end
   */
  handleRecognitionEnd() {
    this.isListening = false;
    
    if (this.onEndCallback) {
      this.onEndCallback();
    }
  }
  
  /**
   * Get user-friendly error message
   * @param {string} errorCode - Error code
   * @returns {string} Error message
   */
  getErrorMessage(errorCode) {
    const errorMessages = {
      'no-speech': 'No speech was detected. Please try again.',
      'audio-capture': 'No microphone was found or access was denied.',
      'not-allowed': 'Microphone access was denied. Please allow microphone access in your browser settings.',
      'aborted': 'Speech recognition was aborted.',
      'network': 'Network error occurred. Please check your connection.',
      'service-not-allowed': 'Speech recognition service is not allowed.',
      'bad-grammar': 'Speech grammar error.',
      'language-not-supported': 'Language is not supported.'
    };
    
    return errorMessages[errorCode] || 'An unknown error occurred.';
  }
  
  /**
   * Speak text
   * @param {string} text - Text to speak
   * @param {object} options - Additional options
   * @returns {Promise} Promise that resolves when speech is complete
   */
  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!isSpeechSynthesisSupported()) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }
      
      if (!text || text.trim() === '') {
        resolve();
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply configuration
      Object.entries(this.config.synthesis).forEach(([key, value]) => {
        if (key === 'voice' && value) {
          utterance.voice = value;
        } else if (key in utterance) {
          utterance[key] = value;
        }
      });
      
      // Apply custom options
      Object.entries(options).forEach(([key, value]) => {
        if (key in utterance) {
          utterance[key] = value;
        }
      });
      
      utterance.onend = () => {
        this.isSpeaking = false;
        this.processQueue();
        resolve();
      };
      
      utterance.onerror = (event) => {
        this.isSpeaking = false;
        this.processQueue();
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };
      
      if (this.isSpeaking) {
        this.utteranceQueue.push({ utterance, resolve, reject });
      } else {
        this.isSpeaking = true;
        window.speechSynthesis.speak(utterance);
      }
    });
  }
  
  /**
   * Process speech queue
   */
  processQueue() {
    if (this.utteranceQueue.length > 0 && !this.isSpeaking) {
      const next = this.utteranceQueue.shift();
      this.isSpeaking = true;
      window.speechSynthesis.speak(next.utterance);
      
      next.utterance.onend = () => {
        this.isSpeaking = false;
        next.resolve();
        this.processQueue();
      };
      
      next.utterance.onerror = (event) => {
        this.isSpeaking = false;
        next.reject(new Error(`Speech synthesis error: ${event.error}`));
        this.processQueue();
      };
    }
  }
  
  /**
   * Stop speaking
   */
  stopSpeaking() {
    if (isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.utteranceQueue = [];
    }
  }
  
  /**
   * Pause speaking
   */
  pauseSpeaking() {
    if (isSpeechSynthesisSupported()) {
      window.speechSynthesis.pause();
    }
  }
  
  /**
   * Resume speaking
   */
  resumeSpeaking() {
    if (isSpeechSynthesisSupported()) {
      window.speechSynthesis.resume();
    }
  }
  
  /**
   * Check if currently speaking
   * @returns {boolean} Speaking status
   */
  isSpeakingNow() {
    return this.isSpeaking;
  }
  
  /**
   * Get available voices
   * @returns {Array} Available voices
   */
  getVoices() {
    return [...availableVoices];
  }
  
  /**
   * Set voice by name
   * @param {string} voiceName - Voice name
   * @returns {boolean} Success status
   */
  setVoiceByName(voiceName) {
    const voice = availableVoices.find(v => v.name === voiceName);
    if (voice) {
      this.config.synthesis.voice = voice;
      return true;
    }
    return false;
  }
  
  /**
   * Speak symptoms for selection
   * @param {Array} symptoms - Array of symptoms
   * @param {number} delay - Delay between symptoms in ms
   */
  speakSymptoms(symptoms, delay = 1000) {
    if (!symptoms || symptoms.length === 0) return;
    
    let index = 0;
    
    const speakNext = () => {
      if (index < symptoms.length) {
        const symptom = symptoms[index];
        this.speak(`Symptom ${index + 1}: ${symptom.name}`)
          .then(() => {
            index++;
            setTimeout(speakNext, delay);
          })
          .catch(console.error);
      }
    };
    
    speakNext();
  }
  
  /**
   * Speak appointment details
   * @param {object} appointment - Appointment object
   */
  speakAppointmentDetails(appointment) {
    if (!appointment) return;
    
    const message = `
      Your appointment is with Doctor ${appointment.doctorName} 
      on ${this.formatDateForSpeech(appointment.date)} 
      at ${this.formatTimeForSpeech(appointment.time)}.
      ${appointment.location ? `Location: ${appointment.location}` : ''}
      ${appointment.notes ? `Notes: ${appointment.notes}` : ''}
    `;
    
    this.speak(message);
  }
  
  /**
   * Format date for speech
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   */
  formatDateForSpeech(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  
  /**
   * Format time for speech
   * @param {string} timeString - Time string
   * @returns {string} Formatted time
   */
  formatTimeForSpeech(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    if (minute === 0) {
      return `${hour12} ${period}`;
    } else if (minute < 10) {
      return `${hour12} oh ${minute} ${period}`;
    } else {
      return `${hour12} ${minute} ${period}`;
    }
  }
  
  /**
   * Speak instructions
   * @param {Array} instructions - Array of instruction strings
   */
  speakInstructions(instructions) {
    if (!instructions || instructions.length === 0) return;
    
    let index = 0;
    
    const speakNext = () => {
      if (index < instructions.length) {
        this.speak(`Step ${index + 1}: ${instructions[index]}`)
          .then(() => {
            index++;
            setTimeout(speakNext, 1500);
          })
          .catch(console.error);
      }
    };
    
    speakNext();
  }
  
  /**
   * Speak error message
   * @param {string} error - Error message
   */
  speakError(error) {
    const errorMessage = `Error: ${error}. Please try again.`;
    this.speak(errorMessage, { rate: 0.9 });
  }
  
  /**
   * Speak success message
   * @param {string} message - Success message
   */
  speakSuccess(message) {
    this.speak(`Success! ${message}`, { rate: 1.1, pitch: 1.1 });
  }
  
  /**
   * Speak welcome message
   * @param {string} userName - User's name
   */
  speakWelcome(userName) {
    const hour = new Date().getHours();
    let greeting = 'Good day';
    
    if (hour < 12) {
      greeting = 'Good morning';
    } else if (hour < 18) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }
    
    const message = `${greeting}${userName ? ` ${userName}` : ''}. Welcome to Smart Health Appointment System. How can I help you today?`;
    this.speak(message);
  }
  
  /**
   * Speak confirmation
   * @param {string} action - Action to confirm
   */
  speakConfirmation(action) {
    const message = `I heard you say ${action}. Is that correct?`;
    this.speak(message);
  }
  
  /**
   * Clean up resources
   */
  cleanup() {
    this.stopListening();
    this.stopSpeaking();
    
    if (this.recognition) {
      this.recognition.onresult = null;
      this.recognition.onerror = null;
      this.recognition.onend = null;
      this.recognition = null;
    }
    
    this.onResultCallback = null;
    this.onErrorCallback = null;
    this.onEndCallback = null;
    this.utteranceQueue = [];
    this.isSpeaking = false;
    this.isListening = false;
  }
}

// Create singleton instance
const voiceServiceInstance = new VoiceService();

// Export singleton and utility functions
export const voiceService = voiceServiceInstance;

export default voiceService;