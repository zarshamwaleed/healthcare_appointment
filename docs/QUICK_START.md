# Quick Start Guide - AI Guide Integration

## 🎉 Your AI Guide is Ready!

All the files have been created and integrated. Here's what you need to do to get it running:

## Step 1: Get Your API Key (2 minutes)

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key that appears

## Step 2: Add the API Key (30 seconds)

1. Open the `.env` file in your project root
2. Replace `your_gemini_api_key_here` with your actual key:
   ```
   REACT_APP_GEMINI_API_KEY=AIzaSyAbc123YourActualKeyHere
   ```
3. Save the file

## Step 3: Run Your Project (1 minute)

Open terminal and run:
```bash
npm start
```

That's it! Your website will open with the AI assistant ready to use.

## 🎯 How to Use the AI Assistant

### For You (Testing)
1. Look for the **sparkly floating button** (✨) in the bottom-right corner
2. Click it to open the chat
3. Try asking: "How do I book an appointment?"
4. The AI will guide you through the process!

### Suggested Test Questions
- "How do I get started?"
- "What accessibility features do you have?"
- "Can I use voice input?"
- "How do I describe my symptoms?"
- "Help me find a doctor"

## 📁 What Was Created

```
✅ Installed @google/generative-ai package
✅ Created AI service (src/services/geminiService.js)
✅ Created AI context (src/context/AIGuideContext.js)
✅ Created AI component (src/components/ai-guide/AIAssistant.js)
✅ Created styles (src/components/ai-guide/AIAssistant.css)
✅ Created helper hook (src/hooks/useAIGuidePage.js)
✅ Integrated into App.js
✅ Added to HomePage.js (example)
✅ Added to SymptomInputPage.js (example)
✅ Created .env file
✅ Created .env.example template
✅ Created documentation (AI_GUIDE_README.md)
```

## 🔧 Troubleshooting

### "AI Assistant is not configured" message?
→ Make sure you added the API key to `.env` and restarted the server

### Can't see the floating button?
→ Check browser console (F12) for errors
→ Make sure the project is running (`npm start`)

### Button appears but clicking doesn't work?
→ Clear browser cache (Ctrl+Shift+R)
→ Check that the API key is valid

## 🎨 Features

- **Smart Responses**: Context-aware answers about your website
- **Suggested Questions**: Quick-start buttons for common questions
- **Chat History**: Remembers your conversation
- **Mobile Friendly**: Works on all screen sizes
- **Accessible**: Keyboard navigation and screen reader support
- **Beautiful UI**: Smooth animations and gradients

## 📚 Next Steps

1. **Add to Other Pages**: Copy the `useAIGuidePage()` pattern from HomePage.js to your other pages
2. **Customize Responses**: Edit `SYSTEM_CONTEXT` in `geminiService.js`
3. **Change Style**: Modify `AIAssistant.css` to match your brand colors
4. **Add More Questions**: Update `getSuggestedQuestions()` in `geminiService.js`

## 💡 Pro Tips

- The AI knows about all your website pages and features
- Ask it anything about booking appointments
- It's patient and will explain things multiple times
- Works great for elderly users who need extra guidance
- Supports accessibility features you already have

## 📖 Full Documentation

See `AI_GUIDE_README.md` for:
- Advanced customization
- API usage limits
- Security best practices
- Code examples
- Troubleshooting guide

---

**Need Help?** The AI is trained to guide users through your healthcare appointment booking process. Just start chatting!

Enjoy your new AI-powered guide! 🚀
