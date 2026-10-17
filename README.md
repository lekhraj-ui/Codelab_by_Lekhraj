# Lekhraj CodeLab

**Developed by Lekhraj Jangid**

A personal coding-practice and AI-assisted programming platform built for learning, problem solving, and competitive programming practice.

# Lekhraj CodeLab

**Developed by Lekhraj Jangid**


## Efficient AI architecture

Lekhraj CodeLab uses a **preprocessed-first, model-when-needed** approach to reduce unnecessary AI calls.

- Standard problem hints and explanations are stored with each problem in the local knowledge base.
- Repeated tutor requests are served from a local response cache.
- The normal Hint / Explain / Solve flows do not call an external model.
- An online model endpoint is used only for open-ended questions or code-review requests when `AI_API_URL` is configured.
- If the online model is unavailable, the local tutor continues to work offline.
- The same API contract works in offline and online deployments.

This architecture is intended to keep common tutoring fast, predictable, inexpensive, and usable without internet access.

## Optional online AI — Groq

The backend uses Groq through the official OpenAI-compatible chat-completions API. The Groq key stays on the backend and is never exposed to the Vite frontend.

### Configure Groq

1. Copy `backend/.env.example` to `backend/.env`.
2. Set `GROQ_API_KEY` to your Groq key.
3. Keep `AI_PROVIDER=groq`.
4. Use a currently supported model such as `openai/gpt-oss-20b`.
5. Start the backend with `cd backend` then `npm install` and `npm start`.
6. Verify `http://localhost:3000/api/v1/health` and `http://localhost:3000/api/v1/ai/status`.

The frontend calls the local backend at `http://localhost:3000`; the API key is never placed in `frontend/.env`.

### Important security note

If an API key has ever been pasted into a chat, source file, ZIP, Git repository, screenshot, or otherwise exposed, revoke/rotate that key in the provider dashboard and replace it with a new key. Do not commit `backend/.env`.
