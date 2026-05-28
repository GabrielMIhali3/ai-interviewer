export type InterviewStage = 'topic' | 'interview' | 'analysis' | 'history'
export type Sentiment = 'positive' | 'neutral' | 'negative'

export interface Exchange {
  questionNumber: number
  question: string
  answer: string
  timestamp: string
}

export interface Analysis {
  summary: string
  sentiment: Sentiment
  sentimentScore: number
  keywords: string[]
  themes: string[]
}

export interface InterviewTranscript {
  id: string
  topic: string
  startedAt: string
  completedAt: string
  durationSeconds: number
  exchanges: Exchange[]
  analysis: Analysis
}
