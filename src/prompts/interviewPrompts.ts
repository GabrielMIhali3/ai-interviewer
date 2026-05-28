import type { Exchange } from '../types/interview'

export function generateQuestionPrompt(
  topic: string,
  questionNumber: number,
  totalQuestions: number,
  previousExchanges: Exchange[]
): string {
  const context =
    previousExchanges.length > 0
      ? previousExchanges
          .map((e) => `Q${e.questionNumber}: ${e.question}\nAnswer: ${e.answer}`)
          .join('\n\n')
      : ''

  if (questionNumber === 1) {
    return `You are conducting a thoughtful one-on-one interview about "${topic}".
This is question ${questionNumber} of ${totalQuestions}.

Ask a broad, open-ended opening question that invites the person to share their perspective on "${topic}".
The question should feel natural and conversational, like a curious human interviewer — not a survey form.
Never ask a yes/no question. Do not number the question. Return only the question text.`
  }

  return `You are conducting a thoughtful one-on-one interview about "${topic}".
This is question ${questionNumber} of ${totalQuestions}.

Here is the conversation so far:
${context}

Based on what the person has shared, ask a focused follow-up question that digs deeper into something specific or interesting they mentioned.
The question should feel like a natural continuation of the conversation — curious, human, and open-ended.
Never ask a yes/no question. Do not number the question. Return only the question text.`
}

// Analyzes all interview exchanges and returns a structured JSON report
export function generateAnalysisPrompt(topic: string, exchanges: Exchange[]): string {
  const transcript = exchanges
    .map((e) => `Q${e.questionNumber}: ${e.question}\nAnswer: ${e.answer}`)
    .join('\n\n')

  return `You are an expert qualitative researcher. You just conducted an interview about "${topic}". Here is the full transcript:

${transcript}

Based on the answers above, return a JSON object with this exact shape — no markdown, no backticks, no explanation, just the raw JSON:
{
  "summary": "YOUR SUMMARY TEXT HERE - must be a quoted string",
  "sentiment": "positive",
  "sentimentScore": 75,
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "themes": ["theme1", "theme2", "theme3"]
}

CRITICAL RULES:
- Every value must be valid JSON
- summary MUST be a quoted string - never raw text
- sentiment MUST be exactly one of: "positive", "neutral", "negative"
- sentimentScore MUST be a number between 0 and 100
- keywords MUST be an array of quoted strings
- themes MUST be an array of quoted strings
- Return ONLY the JSON object, no explanation, no markdown`
}
