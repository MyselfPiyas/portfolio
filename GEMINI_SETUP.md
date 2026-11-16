# Setting Up Google's Gemini AI in Your Portfolio

The voice assistant sends Gemini requests through the server-side `/api/gemini` route. The API key stays on the server and is not sent to visitors' browsers.

## Getting Started with Gemini

### 1. Get Your API Key

1. Visit [Google AI Studio](https://ai.google.dev/) and sign in with your Google account
2. Navigate to the "Get API Key" section
3. Create a new API key. The previous key was exposed and should be revoked.

### 2. Add Your API Key for Local Development

1. Open `.env.local` in the project root (create it if it does not exist).
2. Add your new key without a `NEXT_PUBLIC_` prefix:
   ```
   GEMINI_API_KEY=your_new_key_here
   ```
3. Save the file and restart the development server.

`.env.local` is ignored by Git. Never commit it or share the key in source code.

### 3. Add Your API Key to Vercel

1. Open the project in the [Vercel dashboard](https://vercel.com/dashboard).
2. Go to **Settings → Environment Variables**.
3. Add a variable named `GEMINI_API_KEY` and paste your new key as its value.
4. Select **Production** (and **Preview** if you want Gemini on preview deployments), then save.
5. Redeploy the project so the new variable is available.

### 4. Testing the Integration

1. Open the portfolio in your browser.
2. Use the microphone button or chat interface.
3. Check the debug panel (Ctrl+Alt+D) to see whether Gemini is active.

If the key is missing or Gemini is unavailable, the assistant uses its rule-based fallback responses.

## Customizing Gemini Behavior

You can customize the Gemini AI behavior by modifying the following files:

- `app/components/VoiceNavigation.tsx` - Contains the Gemini initialization and integration logic
  - Look for the `generateAIResponse` function to modify prompt engineering
  - Adjust the safety settings in `initializeGeminiAI` function

## Troubleshooting

If you encounter issues with Gemini integration:

1. **API Key Issues**:
   - Verify `GEMINI_API_KEY` is set in `.env.local` for local development or in Vercel's Environment Variables for deployment.
   - After changing a Vercel variable, redeploy the project.

2. **Fallback Mode**:

   - The system will automatically use fallback mode if Gemini isn't available
   - You can toggle between Gemini and fallback mode in the debug panel

3. **Response Format Issues**:
   - If responses don't contain expected actions, check the prompt in `generateAIResponse`
   - Adjust the temperature and other generation parameters for better JSON formatting

## Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs/gemini_api)
- [Gemini Models Overview](https://ai.google.dev/models/gemini)
- [Google Generative AI SDK for JavaScript](https://www.npmjs.com/package/@google/generative-ai)
