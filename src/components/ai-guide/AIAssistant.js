import React, { useState, useRef, useEffect } from 'react';
import { useAIGuide } from '../../context/AIGuideContext';
import { MessageCircle, X, Send, Sparkles, RotateCcw, Minimize2, Maximize2 } from 'lucide-react';
import './AIAssistant.css';

const AIAssistant = () => {
  const {
    isOpen,
    messages,
    isLoading,
    isInitialized,
    suggestedQuestions,
    toggleChat,
    sendMessage,
    sendSuggestedQuestion,
    clearChat
  } = useAIGuide();

  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleSuggestedQuestionClick = (question) => {
    sendSuggestedQuestion(question);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="ai-assistant-fab"
        aria-label="Open AI Assistant"
        title="Need help? Ask me anything!"
      >
        <Sparkles className="ai-assistant-fab-icon" />
        <MessageCircle className="ai-assistant-fab-icon-secondary" />
      </button>
    );
  }

  return (
    <div className={`ai-assistant-container ${isMinimized ? 'minimized' : ''}`}>
      {/* Header */}
      <div className="ai-assistant-header">
        <div className="ai-assistant-header-left">
          <Sparkles className="ai-assistant-header-icon" />
          <div>
            <h3 className="ai-assistant-title">AI Guide</h3>
            <p className="ai-assistant-subtitle">
              {isInitialized ? 'Ready to help' : 'Not configured'}
            </p>
          </div>
        </div>
        <div className="ai-assistant-header-actions">
          <button
            onClick={toggleMinimize}
            className="ai-assistant-icon-button"
            aria-label={isMinimized ? 'Maximize' : 'Minimize'}
            title={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button
            onClick={clearChat}
            className="ai-assistant-icon-button"
            aria-label="Clear chat"
            title="Clear chat"
            disabled={!isInitialized}
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={toggleChat}
            className="ai-assistant-icon-button"
            aria-label="Close"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Chat Content */}
      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="ai-assistant-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`ai-assistant-message ${msg.role === 'user' ? 'user' : 'assistant'}`}
              >
                <div className="ai-assistant-message-content">
                  {msg.text}
                </div>
                <div className="ai-assistant-message-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="ai-assistant-message assistant">
                <div className="ai-assistant-message-content">
                  <div className="ai-assistant-loading">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {suggestedQuestions.length > 0 && messages.length <= 1 && (
            <div className="ai-assistant-suggestions">
              <p className="ai-assistant-suggestions-title">Suggested questions:</p>
              <div className="ai-assistant-suggestions-list">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestionClick(question)}
                    className="ai-assistant-suggestion-button"
                    disabled={isLoading || !isInitialized}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="ai-assistant-input-form">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isInitialized ? "Ask me anything..." : "API key required"}
              className="ai-assistant-input"
              disabled={isLoading || !isInitialized}
            />
            <button
              type="submit"
              className="ai-assistant-send-button"
              disabled={isLoading || !isInitialized || !inputValue.trim()}
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AIAssistant;
