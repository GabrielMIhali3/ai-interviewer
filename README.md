# AI Interviewer

A web application inspired by the Anthropic Interviewer tool that
conducts short AI-powered interviews on topics chosen by the user.

## Features

- 6 preset topics + custom topic input
- 4 adaptive AI-generated questions per interview
- Each question builds on the user's previous answers
- Real-time chat-style interface
- AI-generated analysis at the end:
  - Summary
  - Sentiment score (0–100) with colored badge
  - Keyword extraction
  - Key themes identification
- Download full transcript as JSON
- Automatic transcript storage in localStorage after each interview
- Past Interviews history page:
  - Browse all past interviews
  - Expand any entry to see summary, keywords, themes, and full transcript
  - Download individual transcripts as JSON
  - Delete interviews from history

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- Groq API (llama-3.3-70b-versatile)

## Project Structure

```
src/
├── types/interview.ts          # TypeScript interfaces
├── prompts/interviewPrompts.ts # All AI prompts (centralized)
├── services/groqService.ts     # Groq API calls
├── utils/storage.ts            # localStorage save/load + JSON download
├── components/
│   ├── TopicSelector.tsx       # Step 1: topic selection screen
│   ├── InterviewChat.tsx       # Step 2: Q&A chat interface
│   ├── AnalysisReport.tsx      # Step 3: results and analysis
│   ├── InterviewHistory.tsx    # Past interviews browser
│   └── ProgressBar.tsx         # Question progress indicator
└── App.tsx                     # Stage manager and state machine
```

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd ai-interviewer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get a free Groq API key

- Go to https://console.groq.com
- Sign up for a free account
- Navigate to **API Keys → Create API Key**
- Copy your key

### 4. Configure environment variables

Create a `.env` file in the root of the project:

```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### 5. Start the development server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## How It Works

1. User selects a topic (preset or custom)
2. AI generates the first broad open-ended question
3. User answers → AI generates adaptive follow-up question
4. After 4 questions → AI analyzes all answers
5. Results displayed: summary, sentiment, keywords, themes
6. Transcript is automatically saved to localStorage
7. User can download the full transcript as JSON
8. All past interviews are accessible via the **Past Interviews** page

## Prompt Engineering

All prompts are centralized in `src/prompts/interviewPrompts.ts`:

- **`generateQuestionPrompt`** — generates adaptive questions based on previous answers. Question 1 is broad; Q2–Q4 dig deeper into what the user said.
- **`generateAnalysisPrompt`** — analyzes all answers and returns structured JSON with summary, sentiment score, keywords, and themes.

## Storage

Transcripts are automatically saved to `localStorage` under the key `ai_interviewer_transcripts` at the end of each interview. No backend or database is required.

Users can also download individual transcripts as named JSON files:

```
interview_future-of-education_1748123456.json
```

## Example Transcript (JSON output)

```json
{
  "id": "interview_1748123456789",
  "topic": "Future of Education",
  "startedAt": "2026-05-27T10:30:00.000Z",
  "completedAt": "2026-05-27T10:34:22.000Z",
  "durationSeconds": 262,
  "exchanges": [
    {
      "questionNumber": 1,
      "question": "What changes do you envision...",
      "answer": "I believe personalized learning...",
      "timestamp": "2026-05-27T10:30:45.000Z"
    }
  ],
  "analysis": {
    "summary": "The interviewee believes...",
    "sentiment": "positive",
    "sentimentScore": 80,
    "keywords": ["personalized learning", "AI", "teachers"],
    "themes": ["education reform", "technology integration"]
  }
}
```
