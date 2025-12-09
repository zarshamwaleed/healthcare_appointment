import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

let genAI = null;
let model = null;

// Initialize the AI model
export const initializeGemini = () => {
  if (!API_KEY) {
    console.warn("Gemini API key not found. Please add REACT_APP_GEMINI_API_KEY to your .env file");
    return false;
  }
  
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp"
    });
    return true;
  } catch (error) {
    console.error("Error initializing Gemini:", error);
    return false;
  }
};

// System context about the healthcare appointment website
const SYSTEM_CONTEXT = `You are a helpful AI assistant for a healthcare appointment booking website. Your role is to guide users through the process of booking medical appointments.

The website has the following features and pages:
1. **Home Page**: Landing page with introduction
2. **Mode Selection**: Users can choose their interaction mode (Standard, Voice-Assisted, Simplified, High Contrast)
3. **Symptom Input**: Users describe their symptoms using text, voice, or body map
4. **Doctor Selection**: Browse and filter doctors by department and specialization
5. **Appointment Booking**: Select date, time slots with calendar view
6. **Confirmation**: View appointment summary with instructions and map
7. **User Profile**: Manage preferences, view appointment history
8. **Accessibility Settings**: Adjust text size, contrast, voice assistance

Key features:
- Multiple accessibility options for elderly and low-literacy users
- Voice input and text-to-speech capabilities
- Visual symptom selection with body map
- Smart doctor recommendations based on symptoms
- Priority/urgency handling for critical cases
- Multi-language support
- Responsive design for all devices

When helping users:
- Be concise and clear
- Provide step-by-step guidance
- Ask clarifying questions if needed
- Be empathetic and patient
- Highlight accessibility features when relevant
- Keep responses focused on the appointment booking process`;

// Chat history for maintaining context
let chatHistory = [];

/**
 * Send a message to Gemini and get a response
 * @param {string} userMessage - The user's message
 * @param {object} context - Additional context (current page, user preferences, etc.)
 * @returns {Promise<string>} - The AI's response
 */
export const sendMessageToGemini = async (userMessage, context = {}) => {
  if (!model) {
    const initialized = initializeGemini();
    if (!initialized) {
      return "I'm sorry, but the AI assistant is currently unavailable. Please check your API configuration.";
    }
  }

  try {
    // Build context-aware prompt
    let contextInfo = "";
    if (context.currentPage) {
      contextInfo += `\nUser is currently on: ${context.currentPage} page`;
    }
    if (context.userPreferences) {
      contextInfo += `\nUser preferences: ${JSON.stringify(context.userPreferences)}`;
    }
    if (context.appointmentData) {
      contextInfo += `\nCurrent appointment data: ${JSON.stringify(context.appointmentData)}`;
    }

    const fullPrompt = `${SYSTEM_CONTEXT}\n${contextInfo}\n\nUser: ${userMessage}\n\nAssistant:`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Update chat history
    chatHistory.push({
      role: "user",
      message: userMessage,
      timestamp: new Date().toISOString()
    });
    chatHistory.push({
      role: "assistant",
      message: text,
      timestamp: new Date().toISOString()
    });

    // Keep only last 10 exchanges
    if (chatHistory.length > 20) {
      chatHistory = chatHistory.slice(-20);
    }

    return text;
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "I apologize, but I encountered an error. Please try again or contact support if the issue persists.";
  }
};

/**
 * Get suggested questions based on current context
 * @param {string} currentPage - The current page user is on
 * @returns {Array<string>} - Array of suggested questions
 */
export const getSuggestedQuestions = (currentPage) => {
  const suggestions = {
    home: [
      "How do I book an appointment?",
      "What accessibility features are available?",
      "Can I use voice input?",
      "How do I get started?"
    ],
    modeSelection: [
      "Which mode should I choose?",
      "What is voice-assisted mode?",
      "What does high contrast mode do?",
      "Can I change modes later?"
    ],
    symptomInput: [
      "How do I describe my symptoms?",
      "Can I use the body map?",
      "What if I don't know my symptoms?",
      "Can I use voice input here?"
    ],
    doctorSelection: [
      "How do I find the right doctor?",
      "Can I see doctor qualifications?",
      "What do the specializations mean?",
      "How are doctors recommended?"
    ],
    appointmentBooking: [
      "How do I select a time slot?",
      "What if my condition is urgent?",
      "Can I book for someone else?",
      "How do I change my appointment?"
    ],
    confirmation: [
      "What should I bring to my appointment?",
      "How do I get to the clinic?",
      "Can I cancel or reschedule?",
      "Will I receive a reminder?"
    ]
  };

  return suggestions[currentPage] || suggestions.home;
};

/**
 * Clear chat history
 */
export const clearChatHistory = () => {
  chatHistory = [];
};

/**
 * Get chat history
 */
export const getChatHistory = () => {
  return [...chatHistory];
};

/**
 * Generate page-specific guidance
 * @param {string} pageName - The page to generate guidance for
 * @returns {string} - Guidance text
 */
export const getPageGuidance = async (pageName) => {
  const guidancePrompts = {
    home: "Briefly explain what this healthcare appointment booking website does and how to get started.",
    modeSelection: "Explain the different interaction modes available and help the user choose the best one.",
    symptomInput: "Guide the user on how to input their symptoms using text, voice, or the body map.",
    doctorSelection: "Explain how to browse and select a doctor based on their needs.",
    appointmentBooking: "Guide the user through selecting a date and time for their appointment.",
    confirmation: "Explain what to do next after booking an appointment.",
    userProfile: "Explain how to manage profile settings and view appointment history.",
    accessibility: "Describe the accessibility features available on the website."
  };

  const prompt = guidancePrompts[pageName] || "Provide general help for navigating this healthcare appointment website.";
  return await sendMessageToGemini(prompt, { currentPage: pageName });
};

const geminiServiceExports = {
  initializeGemini,
  sendMessageToGemini,
  getSuggestedQuestions,
  clearChatHistory,
  getChatHistory,
  getPageGuidance
};

export default geminiServiceExports;
