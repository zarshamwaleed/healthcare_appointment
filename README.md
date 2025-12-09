# Healthcare Appointment System

An intelligent, inclusive healthcare appointment booking platform designed for everyone. This application provides multiple accessibility modes including voice commands, visual guides, large text mode, and sign language support to ensure healthcare is accessible to all users.

## 🌟 Features

- **Multiple Accessibility Modes**: Elderly care, low-literacy visual mode, voice-enabled, sign language, and standard access
- **High Contrast Mode**: Dark theme optimized for visual accessibility
- **AI-Powered Assistance**: Integrated Gemini AI guide for personalized help
- **Smart Doctor Recommendations**: AI-based specialist matching based on symptoms
- **Voice & Sign Language Input**: Hands-free and camera-based symptom input
- **Body Map Interface**: Visual symptom selection for better communication
- **Priority-Based Scheduling**: Intelligent appointment booking considering urgency

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   Create a `.env` file in the root directory:
   ```
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

4. **Build for Production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
healthcare_appointment/
├── docs/                          # Documentation files
│   ├── AI_GUIDE_README.md        # AI integration guide
│   ├── AI_INTEGRATION_SUMMARY.md # AI implementation details
│   ├── PROJECT_PROPOSAL.md       # Original project proposal
│   ├── QUICK_START.md            # Detailed setup guide
│   └── WHERE_IS_THE_AI.txt       # AI features location guide
├── public/                        # Static public assets
├── src/
│   ├── components/               # Reusable React components
│   │   ├── accessibility/       # Accessibility-specific components
│   │   ├── ai-guide/            # AI assistant components
│   │   ├── appointment-booking/ # Booking interface components
│   │   ├── common/              # Shared UI components
│   │   ├── confirmation/        # Appointment confirmation components
│   │   ├── doctor-selection/    # Doctor browsing & selection
│   │   ├── layout/              # Layout wrappers
│   │   ├── mode-selection/      # Accessibility mode selection
│   │   ├── symptom-input/       # Symptom input interfaces
│   │   └── user-profile/        # User preferences & history
│   ├── context/                  # React Context providers
│   │   ├── AccessibilityContext.js
│   │   ├── AIGuideContext.js
│   │   ├── AppointmentContext.js
│   │   ├── UIContext.js
│   │   └── UserContext.js
│   ├── hooks/                    # Custom React hooks
│   ├── pages/                    # Main application pages
│   ├── services/                 # API and external services
│   │   ├── geminiService.js     # Google Gemini AI integration
│   │   ├── mockDataService.js   # Mock data for development
│   │   ├── storageService.js    # LocalStorage utilities
│   │   └── voiceService.js      # Web Speech API wrapper
│   ├── styles/                   # Global styles and themes
│   │   ├── globals.css          # Global CSS including high contrast
│   │   └── themes/              # Theme-specific CSS
│   ├── utils/                    # Utility functions
│   ├── App.js                   # Main application component
│   ├── routes.jsx               # Application routing
│   └── index.js                 # Application entry point
├── .env                          # Environment variables (create this)
├── package.json                 # Dependencies and scripts
└── tailwind.config.js           # Tailwind CSS configuration
```

## 🎨 Accessibility Modes

1. **Elderly Care Mode**: Large text, simplified navigation, clear buttons
2. **Visual/Low-Literacy Mode**: Icon-based interface, minimal text
3. **Voice-Enabled Mode**: Complete voice control for hands-free operation
4. **Sign Language Mode**: Camera-based ASL alphabet input
5. **Standard Mode**: Full-featured interface with all capabilities

## 🤖 AI Integration

The application uses Google's Gemini AI for:
- Contextual assistance throughout the booking process
- Symptom analysis and doctor recommendations
- Natural language query handling
- Personalized guidance based on user mode

See `docs/AI_GUIDE_README.md` for detailed AI integration information.

## 🛠️ Technologies Used

- **React 19** - Frontend framework
- **React Router v7** - Navigation
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **Lucide React** - Icon library
- **Google Gemini AI** - AI assistance
- **Web Speech API** - Voice recognition
- **date-fns** - Date utilities

## 📚 Documentation

- **[AI Guide](docs/AI_GUIDE_README.md)** - How AI assistance works
- **[Quick Start Guide](docs/QUICK_START.md)** - Detailed setup instructions
- **[Project Proposal](docs/PROJECT_PROPOSAL.md)** - Original project vision
- **[AI Feature Locations](docs/WHERE_IS_THE_AI.txt)** - Where to find AI code

## 🧪 Testing

```bash
npm test
```

Launches the test runner in interactive watch mode.

## 📝 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (one-way operation)

## 🤝 Contributing

This is an educational project demonstrating accessible healthcare interfaces with AI integration.

## 📄 License

This project is for educational purposes.

---

Built with ❤️ for accessibility and inclusive healthcare

