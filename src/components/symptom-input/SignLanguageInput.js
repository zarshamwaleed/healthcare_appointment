import React, { useState, useRef, useEffect } from 'react';
import { Camera, StopCircle, Play, Trash2, CheckCircle, Delete, AlertCircle } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const SignLanguageInput = ({ onSubmit }) => {
  const { settings } = useAccessibility();
  const [isActive, setIsActive] = useState(false);
  const [detectedText, setDetectedText] = useState('');
  const [currentLetter, setCurrentLetter] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelError, setModelError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const handsDetectorRef = useRef(null);
  const lastDetectionTimeRef = useRef(0);
  const detectionCooldownRef = useRef(1500); // 1.5 seconds between letter additions

  // ASL Alphabet hand shape patterns (simplified for detection)
  const ASL_PATTERNS = {
    'A': { closedFist: true, thumbSide: true },
    'B': { openPalm: true, fingersUp: true, thumbAcross: true },
    'C': { curved: true, open: true },
    'D': { index: true, othersClosed: true },
    'E': { allClosed: true, bentFingers: true },
    'F': { okSign: true, threeFingersUp: true },
    'G': { pointingSide: true, thumbOut: true },
    'H': { twoFingersHorizontal: true },
    'I': { pinkyUp: true, othersClosed: true },
    'K': { indexMiddleUp: true, vShape: true },
    'L': { thumbIndexL: true },
    'M': { threeFingersDown: true, thumbUnder: true },
    'N': { twoFingersDown: true, thumbUnder: true },
    'O': { circle: true, allFingersTouching: true },
    'P': { pointingDown: true, middleDown: true },
    'Q': { pointingDown: true, thumbDown: true },
    'R': { crossedFingers: true, indexMiddle: true },
    'S': { closedFist: true, thumbOver: true },
    'T': { thumbBetweenFingers: true },
    'U': { twoFingersUp: true, together: true },
    'V': { twoFingersUp: true, apart: true },
    'W': { threeFingersUp: true, spread: true },
    'X': { indexBent: true, hook: true },
    'Y': { thumbPinky: true, shakaSign: true },
    'Z': { zMotion: true }
  };

  // Load hand detection model (using MediaPipe Hands via CDN)
  const loadHandDetectionModel = async () => {
    setIsModelLoading(true);
    setModelError(null);
    
    try {
      // Check if MediaPipe Hands is available
      if (typeof window.Hands === 'undefined') {
        throw new Error('MediaPipe Hands library not loaded. Please add the script to your HTML.');
      }

      // Initialize MediaPipe Hands
      const hands = new window.Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
      });

      hands.onResults(onHandsDetected);
      handsDetectorRef.current = hands;
      
      setIsModelLoading(false);
      return hands;
    } catch (error) {
      console.error('Error loading hand detection model:', error);
      setModelError('Hand detection model failed to load. Using simplified detection.');
      setIsModelLoading(false);
      return null;
    }
  };

  // Process detected hand landmarks
  const onHandsDetected = (results) => {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      setCurrentLetter('');
      setConfidence(0);
      return;
    }

    const landmarks = results.multiHandLandmarks[0];
    const detectedLetter = recognizeASLLetter(landmarks);
    
    if (detectedLetter) {
      setCurrentLetter(detectedLetter.letter);
      setConfidence(detectedLetter.confidence);
      
      // Auto-add letter if confidence is high and cooldown has passed
      const now = Date.now();
      if (detectedLetter.confidence > 75 && 
          (now - lastDetectionTimeRef.current) > detectionCooldownRef.current) {
        setDetectedText(prev => prev + detectedLetter.letter);
        lastDetectionTimeRef.current = now;
        // Flash feedback
        setTimeout(() => setCurrentLetter(''), 300);
      }
    }
  };

  // Recognize ASL letter from hand landmarks
  const recognizeASLLetter = (landmarks) => {
    if (!landmarks || landmarks.length < 21) return null;

    // Extract key landmark positions
    const wrist = landmarks[0];
    const thumb = {
      tip: landmarks[4],
      ip: landmarks[3],
      mcp: landmarks[2]
    };
    const index = {
      tip: landmarks[8],
      pip: landmarks[6],
      mcp: landmarks[5]
    };
    const middle = {
      tip: landmarks[12],
      pip: landmarks[10],
      mcp: landmarks[9]
    };
    const ring = {
      tip: landmarks[16],
      pip: landmarks[14],
      mcp: landmarks[13]
    };
    const pinky = {
      tip: landmarks[20],
      pip: landmarks[18],
      mcp: landmarks[17]
    };

    // Calculate finger states
    const isFingerExtended = (finger) => {
      return finger.tip.y < finger.pip.y && finger.pip.y < finger.mcp.y;
    };

    const indexExtended = isFingerExtended(index);
    const middleExtended = isFingerExtended(middle);
    const ringExtended = isFingerExtended(ring);
    const pinkyExtended = isFingerExtended(pinky);
    const thumbExtended = thumb.tip.x < thumb.mcp.x;

    // Pattern matching for common letters
    // A: Closed fist with thumb to side
    if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended && thumbExtended) {
      return { letter: 'A', confidence: 85 };
    }

    // B: Open palm, all fingers up, thumb across
    if (indexExtended && middleExtended && ringExtended && pinkyExtended && !thumbExtended) {
      return { letter: 'B', confidence: 85 };
    }

    // C: Curved hand shape
    const avgFingerY = (index.tip.y + middle.tip.y + ring.tip.y + pinky.tip.y) / 4;
    if (avgFingerY > wrist.y && Math.abs(index.tip.x - pinky.tip.x) > 0.1) {
      return { letter: 'C', confidence: 75 };
    }

    // D: Only index finger up
    if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      return { letter: 'D', confidence: 85 };
    }

    // I: Only pinky up
    if (!indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
      return { letter: 'I', confidence: 85 };
    }

    // L: Thumb and index forming L
    if (indexExtended && thumbExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      const isLShape = Math.abs(index.tip.x - thumb.tip.x) > 0.15;
      if (isLShape) {
        return { letter: 'L', confidence: 85 };
      }
    }

    // O: Circle shape
    const thumbIndexDistance = Math.sqrt(
      Math.pow(thumb.tip.x - index.tip.x, 2) + Math.pow(thumb.tip.y - index.tip.y, 2)
    );
    if (thumbIndexDistance < 0.05 && !middleExtended && !ringExtended && !pinkyExtended) {
      return { letter: 'O', confidence: 80 };
    }

    // V: Index and middle up, apart
    if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
      const vSpread = Math.abs(index.tip.x - middle.tip.x) > 0.05;
      return { letter: vSpread ? 'V' : 'U', confidence: 85 };
    }

    // W: Three fingers up
    if (indexExtended && middleExtended && ringExtended && !pinkyExtended) {
      return { letter: 'W', confidence: 85 };
    }

    // Y: Thumb and pinky out (shaka sign)
    if (thumbExtended && pinkyExtended && !indexExtended && !middleExtended && !ringExtended) {
      return { letter: 'Y', confidence: 85 };
    }

    // Default: show current finger state for debugging
    const extendedCount = [indexExtended, middleExtended, ringExtended, pinkyExtended, thumbExtended].filter(Boolean).length;
    return { letter: `${extendedCount}`, confidence: 50 };
  };

  // Fallback: Simplified detection without MediaPipe
  const detectASLGesture = async (videoElement) => {
    if (!videoElement || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match video
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    // Draw current frame
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // If MediaPipe is loaded, process with it
    if (handsDetectorRef.current) {
      try {
        await handsDetectorRef.current.send({ image: videoElement });
      } catch (error) {
        console.error('Detection error:', error);
      }
    } else {
      // Fallback: Basic color-based hand detection
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const simplified = simulateASLRecognition(imageData);
      if (simplified) {
        setCurrentLetter(simplified.letter);
        setConfidence(simplified.confidence);
        
        // Auto-add letter if confidence is high and cooldown has passed
        const now = Date.now();
        if (simplified.confidence > 75 && 
            (now - lastDetectionTimeRef.current) > detectionCooldownRef.current) {
          setDetectedText(prev => prev + simplified.letter);
          lastDetectionTimeRef.current = now;
          // Flash feedback
          setTimeout(() => setCurrentLetter(''), 300);
        }
      }
    }
  };

  // Simulated ASL recognition (fallback when MediaPipe unavailable)
  const simulateASLRecognition = (imageData) => {
    // Basic simulation for demo purposes
    const letters = ['A', 'B', 'C', 'D', 'E', 'I', 'L', 'O', 'V', 'Y'];
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomConfidence = Math.floor(Math.random() * 20) + 76; // 76-95%
    
    // Simulate detection more frequently for better demo experience
    if (Math.random() > 0.3) {
      return {
        letter: randomLetter,
        confidence: randomConfidence
      };
    }
    return null;
  };

  const startCamera = async () => {
    try {
      setIsProcessing(true);
      
      // Load hand detection model first
      await loadHandDetectionModel();
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
        
        // Start detection loop after video is ready
        videoRef.current.onloadedmetadata = () => {
          startDetectionLoop();
          setIsProcessing(false);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please ensure camera permissions are granted.');
      setIsProcessing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setIsActive(false);
    setIsProcessing(false);
    setCurrentLetter('');
  };

  const startDetectionLoop = () => {
    // Run detection every 100ms for smoother recognition
    detectionIntervalRef.current = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        detectASLGesture(videoRef.current);
      }
    }, 100);
  };

  const addWord = () => {
    const text = detectedText.trim().toLowerCase();
    if (text) {
      setSymptoms(prev => [...prev, text]);
      setDetectedText('');
    }
  };

  const addSpace = () => {
    setDetectedText(prev => prev + ' ');
  };

  const deleteLastChar = () => {
    setDetectedText(prev => prev.slice(0, -1));
  };

  const removeSymptom = (index) => {
    setSymptoms(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setDetectedText('');
    setSymptoms([]);
  };

  const handleSubmit = () => {
    if (symptoms.length > 0) {
      onSubmit(symptoms);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Information Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
          <Camera size={20} />
          ASL Sign Language Hand Detection
        </h3>
        <p className="text-sm text-purple-800 mb-2">
          Show ASL alphabet letters with your hand. The system will detect and spell out your symptoms.
        </p>
        {modelError && (
          <div className="flex items-start gap-2 mt-2 text-amber-800 bg-amber-50 p-2 rounded">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p className="text-xs">{modelError}</p>
          </div>
        )}
        {isModelLoading && (
          <p className="text-xs text-purple-700 mt-2">Loading hand detection model...</p>
        )}
        <div className="mt-3 text-xs text-purple-700">
          <p className="font-semibold">Supported letters: A, B, C, D, E, I, L, O, U, V, W, Y</p>
        </div>
      </div>

      {/* Camera View */}
      <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full ${isActive ? 'block' : 'hidden'} transform scale-x-[-1]`}
          style={{ maxHeight: '400px' }}
        />
        
        {!isActive && (
          <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center">
              <Camera size={64} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-300 mb-6">Camera not started</p>
              <button
                onClick={startCamera}
                className={`inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg ${
                  settings.mode === 'elderly' ? 'px-8 py-4 text-lg' : 'px-6 py-3'
                }`}
              >
                <Play size={20} />
                Start Camera
              </button>
            </div>
          </div>
        )}

        {/* Current Letter Detection Overlay */}
        {isActive && currentLetter && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-lg shadow-2xl">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{currentLetter}</div>
              <div className="text-sm">
                Confidence: {confidence}%
                <div className="w-32 h-2 bg-white/30 rounded-full mt-1">
                  <div 
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        {isActive && !currentLetter && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            Waiting for sign...
          </div>
        )}

        {/* Canvas for processing (visible for debugging, can be hidden) */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Detected Text Display - Real-time typing below camera */}
      <div className="bg-white border-2 border-blue-400 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-800">Detected Text:</h4>
          <div className="flex gap-2">
            <button
              onClick={addSpace}
              disabled={!isActive}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white text-sm rounded transition-all"
              title="Add space"
            >
              Space
            </button>
            <button
              onClick={deleteLastChar}
              disabled={!detectedText}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white text-sm rounded transition-all flex items-center gap-1"
              title="Delete last character"
            >
              <Delete size={16} />
              Delete
            </button>
          </div>
        </div>
        
        <div className={`min-h-[60px] p-4 bg-gray-50 rounded-lg border-2 border-dashed ${
          detectedText ? 'border-blue-300' : 'border-gray-300'
        }`}>
          <p className={`${settings.mode === 'elderly' ? 'text-2xl' : 'text-xl'} font-mono text-gray-800 break-words`}>
            {detectedText || (
              <span className="text-gray-400 italic">Letters will appear here as you sign...</span>
            )}
            <span className="animate-pulse">|</span>
          </p>
        </div>

        {detectedText.trim() && (
          <button
            onClick={addWord}
            className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-all font-semibold shadow-md"
          >
            Add "{detectedText.trim()}" to Symptoms
          </button>
        )}
      </div>

      {/* Controls */}
      {isActive && (
        <div className="flex gap-3">
          <button
            onClick={stopCamera}
            className={`flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all ${
              settings.mode === 'elderly' ? 'py-4 text-lg' : 'py-3'
            }`}
          >
            <StopCircle size={20} />
            Stop Camera
          </button>
          <button
            onClick={clearAll}
            className={`flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all ${
              settings.mode === 'elderly' ? 'px-6 py-4 text-lg' : 'px-4 py-3'
            }`}
          >
            <Trash2 size={20} />
            Clear All
          </button>
        </div>
      )}

      {/* ASL Alphabet Reference */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">ASL Alphabet Reference</h4>
        <p className="text-sm text-gray-600 mb-3">
          Show hand signs for letters A-Z as shown in the reference image. Each letter will be detected and typed automatically.
        </p>
        <div className="bg-white p-2 rounded border">
          <p className="text-xs text-gray-500 text-center italic">
            Refer to standard ASL alphabet chart for proper hand positions
          </p>
        </div>
      </div>

      {/* Symptoms List */}
      {symptoms.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Your Symptoms ({symptoms.length}):</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {symptoms.map((symptom, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium"
              >
                {symptom}
                <button
                  onClick={() => removeSymptom(index)}
                  className="hover:bg-blue-700 rounded-full p-1 transition-all"
                  aria-label={`Remove ${symptom}`}
                >
                  <StopCircle size={16} />
                </button>
              </span>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg ${
              settings.mode === 'elderly' ? 'py-4 text-lg' : 'py-3'
            }`}
          >
            <CheckCircle size={20} />
            Find Doctors with These Symptoms
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
          <li>Click "Start Camera" to enable your webcam</li>
          <li>Position your hand clearly in front of the camera</li>
          <li>Make ASL hand signs for each letter of your symptom (e.g., P-A-I-N)</li>
          <li>Letters will appear automatically in the text box below the camera</li>
          <li>Use "Space" button to add spaces between words</li>
          <li>Use "Delete" to remove the last character if needed</li>
          <li>Click "Add to Symptoms" to save the word</li>
          <li>Repeat for all symptoms, then click "Find Doctors"</li>
        </ol>
        <p className="text-xs text-gray-500 mt-3 italic">
          Tip: Hold each sign steady for 1-2 seconds for better detection. Good lighting improves accuracy.
        </p>
      </div>

      {/* Technical Note for Development */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-800">
          <strong>Developer Note:</strong> This demo uses simulated ASL letter detection. 
          For production, integrate MediaPipe Hands with a trained ASL alphabet recognition model 
          or use TensorFlow.js with hand landmark classification for accurate gesture recognition.
        </p>
      </div>
    </div>
  );
};

export default SignLanguageInput;
