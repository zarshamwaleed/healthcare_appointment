import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initializeGemini,
  sendMessageToGemini,
  getSuggestedQuestions,
  clearChatHistory,
  getChatHistory,
  getPageGuidance
} from '../services/geminiService';

const AIGuideContext = createContext();

export const useAIGuide = () => {
  const context = useContext(AIGuideContext);
  if (!context) {
    throw new Error('useAIGuide must be used within an AIGuideProvider');
  }
  return context;
};

export const AIGuideProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);

  // Initialize Gemini on mount
  useEffect(() => {
    const initialized = initializeGemini();
    setIsInitialized(initialized);
    
    if (initialized) {
      // Add welcome message
      setMessages([{
        role: 'assistant',
        text: "👋 Hello! I'm your AI guide. I'm here to help you book your healthcare appointment. How can I assist you today?",
        timestamp: new Date().toISOString()
      }]);
    } else {
      setMessages([{
        role: 'assistant',
        text: "⚠️ AI Assistant is not configured. Please add your Gemini API key to use this feature.",
        timestamp: new Date().toISOString()
      }]);
    }
  }, []);

  // Update suggested questions when page changes
  useEffect(() => {
    const questions = getSuggestedQuestions(currentPage);
    setSuggestedQuestions(questions);
  }, [currentPage]);

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Send a message to the AI
  const sendMessage = async (userMessage, context = {}) => {
    if (!isInitialized || !userMessage.trim()) return;

    // Add user message to chat
    const userMsg = {
      role: 'user',
      text: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Include current page and any additional context
      const fullContext = {
        currentPage,
        ...context
      };

      // Get AI response
      const aiResponse = await sendMessageToGemini(userMessage, fullContext);

      // Add AI response to chat
      const aiMsg = {
        role: 'assistant',
        text: aiResponse,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg = {
        role: 'assistant',
        text: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Send a suggested question
  const sendSuggestedQuestion = (question) => {
    sendMessage(question);
  };

  // Get guidance for current page
  const requestPageGuidance = async () => {
    if (!isInitialized) return;

    setIsLoading(true);
    try {
      const guidance = await getPageGuidance(currentPage);
      const guidanceMsg = {
        role: 'assistant',
        text: guidance,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, guidanceMsg]);
      setIsOpen(true); // Open chat to show guidance
    } catch (error) {
      console.error('Error getting page guidance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat
  const clearChat = () => {
    clearChatHistory();
    setMessages([{
      role: 'assistant',
      text: "Chat cleared. How can I help you?",
      timestamp: new Date().toISOString()
    }]);
  };

  // Update current page (should be called when route changes)
  const updateCurrentPage = (pageName) => {
    setCurrentPage(pageName);
  };

  const value = {
    isOpen,
    messages,
    isLoading,
    isInitialized,
    currentPage,
    suggestedQuestions,
    toggleChat,
    sendMessage,
    sendSuggestedQuestion,
    requestPageGuidance,
    clearChat,
    updateCurrentPage
  };

  return (
    <AIGuideContext.Provider value={value}>
      {children}
    </AIGuideContext.Provider>
  );
};

export default AIGuideContext;
