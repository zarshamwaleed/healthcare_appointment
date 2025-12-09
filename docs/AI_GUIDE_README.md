# AI Guide Integration - Setup Instructions

## Overview
Your healthcare appointment website now has an AI-powered guide using Google's Gemini API to help users navigate and book appointments.

## Features
- 🤖 **Intelligent Chat Assistant**: Answers questions about booking appointments
- 💬 **Contextual Help**: Provides guidance based on the current page
- 🎯 **Suggested Questions**: Quick-start questions for each page
- ♿ **Accessibility**: Works with screen readers and keyboard navigation
- 📱 **Responsive Design**: Works on mobile, tablet, and desktop
- 🎨 **Beautiful UI**: Floating chat bubble with smooth animations

## Setup Instructions

### Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Configure the API Key

1. Open the `.env` file in the root of your project
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```
   REACT_APP_GEMINI_API_KEY=YOUR_ACTUAL_API_KEY_HERE
   ```
3. Save the file

### Step 3: Run the Application

```bash
npm start
```

The AI assistant will appear as a floating button in the bottom-right corner of your website.

## How to Use

### For Users
1. Click the sparkle icon (✨) in the bottom-right corner
2. Type your question or click a suggested question
3. Get instant help about booking appointments
4. The assistant remembers your conversation context

### Suggested Questions by Page
- **Home**: "How do I book an appointment?"
- **Symptoms**: "How do I describe my symptoms?"
- **Doctors**: "How do I find the right doctor?"
- **Booking**: "How do I select a time slot?"

## Files Created

```
src/
├── components/
│   └── ai-guide/
│       ├── AIAssistant.js        # Main chat component
│       └── AIAssistant.css       # Styling
├── context/
│   └── AIGuideContext.js         # State management
└── services/
    └── geminiService.js          # API integration

.env                               # API key configuration
.env.example                       # Template for API keys
```

## Customization

### Modify System Context
Edit `src/services/geminiService.js` and update the `SYSTEM_CONTEXT` variable to customize how the AI responds.

### Change Suggested Questions
Modify the `getSuggestedQuestions()` function in `geminiService.js` to add/remove suggested questions for each page.

### Update Page Context
In your page components, you can provide additional context to the AI:

```javascript
import { useAIGuide } from '../context/AIGuideContext';

const MyPage = () => {
  const { updateCurrentPage } = useAIGuide();
  
  useEffect(() => {
    updateCurrentPage('myPage'); // Tell AI which page user is on
  }, []);
  
  return <div>...</div>;
};
```

### Styling
Edit `src/components/ai-guide/AIAssistant.css` to customize:
- Colors and gradients
- Positioning
- Animations
- Button sizes
- Chat window dimensions

## API Usage & Costs

- **Free Tier**: 60 requests per minute
- **Cost**: Check [Google AI Pricing](https://ai.google.dev/pricing)
- The app caches recent conversations to minimize API calls

## Troubleshooting

### "AI Assistant is not configured" message
- Check that your API key is correctly set in `.env`
- Ensure the file name is exactly `.env` (not `.env.txt`)
- Restart the development server after adding the API key

### API Key Not Working
- Verify the key is correct (no extra spaces)
- Check that the API key has the necessary permissions
- Ensure you haven't exceeded the rate limit

### Component Not Showing
- Check browser console for errors
- Verify all files were created correctly
- Clear browser cache and reload

## Security Notes

⚠️ **Important Security Information**:
- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- For production, use environment variables through your hosting platform
- Rotate API keys periodically
- Monitor API usage in Google Cloud Console

## Advanced Features

### Manual API Calls
```javascript
import { sendMessageToGemini } from '../services/geminiService';

const response = await sendMessageToGemini(
  "How do I book an appointment?",
  { currentPage: 'home', userPreferences: {...} }
);
```

### Custom Page Guidance
```javascript
import { getPageGuidance } from '../services/geminiService';

const guidance = await getPageGuidance('myCustomPage');
```

## Support

For issues or questions:
1. Check the console for error messages
2. Verify API key configuration
3. Review the [Gemini API Documentation](https://ai.google.dev/docs)

## Next Steps

Consider adding:
- Voice input/output for the AI assistant
- Multi-language support
- Conversation history export
- User feedback collection
- Analytics tracking for common questions
