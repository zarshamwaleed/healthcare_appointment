import React, { useState, useRef, useEffect } from 'react';
import { 
  Type, 
  Send, 
  Mic, 
  Smile,
  Image,
  Paperclip,
  Eraser,
  Clock,
  AlertCircle,
  CheckCircle,
  Zap,
  Search,
  X
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import Card from '../common/Card';

const TextInput = ({
  onSubmit,
  placeholder = "Type your symptoms here...",
  initialValue = "",
  showAIHelp = true,
  maxLength = 500,
  showCharacterCount = true
}) => {
  const { settings } = useAccessibility();
  const [text, setText] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [typingStarted, setTypingStarted] = useState(false);
  const [lastTypedTime, setLastTypedTime] = useState(null);
  const textareaRef = useRef(null);
  const timeoutRef = useRef(null);

  const aiPromptTemplates = [
    "I have a headache and fever",
    "Stomach pain with nausea for 2 days",
    "Back pain that gets worse with movement",
    "Cough and shortness of breath",
    "Skin rash with itching",
    "Dizziness and fatigue",
    "Joint pain and swelling",
    "Chest pain when breathing deeply"
  ];

  const symptomKeywords = {
    emergency: ['chest pain', 'difficulty breathing', 'severe bleeding', 'unconscious'],
    urgent: ['high fever', 'severe pain', 'uncontrolled vomiting', 'sudden weakness'],
    common: ['headache', 'cough', 'fever', 'fatigue', 'dizziness', 'nausea']
  };

  useEffect(() => {
    if (text.length > 10 && lastTypedTime) {
      const timeSinceLastType = Date.now() - lastTypedTime;
      if (timeSinceLastType > 1000) {
        analyzeText();
      }
    }
  }, [text, lastTypedTime]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const analyzeText = () => {
    const lowerText = text.toLowerCase();
    const suggestions = [];

    // Check for emergency keywords
    if (symptomKeywords.emergency.some(keyword => lowerText.includes(keyword))) {
      suggestions.push({
        type: 'emergency',
        text: '⚠️ Emergency symptom detected. Consider seeking immediate care.',
        icon: AlertCircle
      });
    }

    // Check for urgent keywords
    if (symptomKeywords.urgent.some(keyword => lowerText.includes(keyword))) {
      suggestions.push({
        type: 'urgent',
        text: 'Urgent symptoms detected. Schedule appointment within 24 hours.',
        icon: Clock
      });
    }

    // Suggest adding details
    if (text.length < 50 && text.length > 10) {
      suggestions.push({
        type: 'info',
        text: 'Add more details like duration, severity, or triggers for better recommendations.',
        icon: Type
      });
    }

    // Check for incomplete sentences
    if (text.endsWith(' and') || text.endsWith(' with')) {
      suggestions.push({
        type: 'suggestion',
        text: 'Complete your thought. Example: "headache and fever for 2 days"',
        icon: CheckCircle
      });
    }

    setAiSuggestions(suggestions.slice(0, 3));
    setShowSuggestions(suggestions.length > 0);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setText(value);
      setTypingStarted(true);
      setLastTypedTime(Date.now());

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        analyzeText();
      }, 500);
    }
  };

  const handleSubmit = () => {
    if (text.trim() && onSubmit) {
      onSubmit(text.trim());
      setText('');
      setAiSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  const insertTemplate = (template) => {
    setText(template);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const clearText = () => {
    setText('');
    setAiSuggestions([]);
    setShowSuggestions(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleVoiceInput = () => {
    // This would integrate with VoiceInput component
    alert('Voice input would open here. Integration with VoiceInput component needed.');
  };

  const getSeverityLevel = () => {
    const lowerText = text.toLowerCase();
    if (symptomKeywords.emergency.some(keyword => lowerText.includes(keyword))) {
      return 'emergency';
    }
    if (symptomKeywords.urgent.some(keyword => lowerText.includes(keyword))) {
      return 'urgent';
    }
    if (symptomKeywords.common.some(keyword => lowerText.includes(keyword))) {
      return 'normal';
    }
    return 'unknown';
  };

  const severityColors = {
    emergency: 'bg-red-100 text-red-800 border-red-300',
    urgent: 'bg-amber-100 text-amber-800 border-amber-300',
    normal: 'bg-green-100 text-green-800 border-green-300',
    unknown: 'bg-gray-100 text-gray-800 border-gray-300'
  };

  const severityLabels = {
    emergency: 'Emergency',
    urgent: 'Urgent',
    normal: 'Normal',
    unknown: 'Unknown Severity'
  };

  const severity = getSeverityLevel();

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Type size={24} className="text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold">Text Input</h3>
              <p className="text-gray-600 text-sm">
                Type or paste your symptoms in detail
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={clearText}
              className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100"
              aria-label="Clear text"
            >
              <Eraser size={20} />
            </button>
            <button
              onClick={handleVoiceInput}
              className="p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-gray-100"
              aria-label="Switch to voice input"
            >
              <Mic size={20} />
            </button>
          </div>
        </div>

        {/* Severity Indicator */}
        <div className={`mb-4 p-3 rounded-lg border ${severityColors[severity]}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} />
              <span className="font-medium">{severityLabels[severity]}</span>
            </div>
            {severity === 'emergency' && (
              <span className="text-sm font-bold">⚠️ SEEK IMMEDIATE CARE</span>
            )}
          </div>
        </div>

        {/* Text Area */}
        <div className={`relative mb-4 border-2 rounded-xl transition-all ${
          isFocused 
            ? 'border-primary-500 ring-2 ring-primary-100' 
            : 'border-gray-300 hover:border-gray-400'
        }`}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            rows={6}
            className={`w-full p-4 rounded-xl resize-none focus:outline-none ${
              settings.mode === 'elderly' ? 'text-lg' : ''
            }`}
            aria-label="Symptom description"
          />
          
          {/* Character Count */}
          {showCharacterCount && (
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-white rounded text-sm text-gray-500">
              {text.length}/{maxLength}
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleVoiceInput}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Mic size={16} />
              <span className="text-sm">Voice Input</span>
            </button>
            
            <button
              onClick={() => insertTemplate(aiPromptTemplates[0])}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Zap size={16} />
              <span className="text-sm">Use Template</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {showSuggestions && (
              <button
                onClick={() => setShowSuggestions(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Hide suggestions"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* AI Suggestions */}
        {showSuggestions && aiSuggestions.length > 0 && (
          <div className="mb-6 space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Zap size={16} className="text-amber-500" />
              AI Suggestions
            </h4>
            
            {aiSuggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    suggestion.type === 'emergency' 
                      ? 'bg-red-50 border-red-200' 
                      : suggestion.type === 'urgent'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon size={18} className={`
                      ${suggestion.type === 'emergency' ? 'text-red-600' : ''}
                      ${suggestion.type === 'urgent' ? 'text-amber-600' : ''}
                      ${suggestion.type === 'info' ? 'text-blue-600' : ''}
                      mt-0.5
                    `} />
                    <span className="text-sm">{suggestion.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Templates */}
        {showAIHelp && (
          <div className="mb-6">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Search size={16} className="text-gray-500" />
              Quick Templates
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {aiPromptTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => insertTemplate(template)}
                  className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-sm"
                >
                  "{template}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submit Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {typingStarted ? (
              <span>Press Ctrl+Enter to submit, or click the button below</span>
            ) : (
              <span>Describe symptoms in as much detail as possible</span>
            )}
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              text.trim()
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } ${settings.mode === 'elderly' ? 'text-lg px-8 py-4' : ''}`}
          >
            <Send size={20} />
            Analyze Symptoms
          </button>
        </div>

        {/* Tips */}
        <div className={`mt-6 p-4 rounded-lg ${
          settings.mode === 'elderly' 
            ? 'bg-blue-50 border border-blue-200' 
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <h4 className="font-medium mb-2">📝 Writing Tips:</h4>
          <ul className={`space-y-1 ${
            settings.mode === 'elderly' ? 'text-lg' : 'text-sm'
          } text-gray-700`}>
            <li>• Include duration (e.g., "for 2 days")</li>
            <li>• Mention severity (e.g., "mild headache", "severe pain")</li>
            <li>• Describe triggers or patterns (e.g., "worse in morning")</li>
            <li>• List all symptoms even if they seem unrelated</li>
            {settings.mode === 'elderly' && (
              <li className="text-blue-700">• Speak clearly into voice input for easier typing</li>
            )}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default TextInput;