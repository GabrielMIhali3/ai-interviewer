import { useState } from 'react'
import type { InterviewStage, Exchange, InterviewTranscript } from './types/interview'
import { generateQuestion, generateAnalysis } from './services/groqService'
import { saveTranscript, loadTranscripts, downloadTranscript } from './utils/storage'
import TopicSelector from './components/TopicSelector'
import InterviewChat from './components/InterviewChat'
import AnalysisReport from './components/AnalysisReport'
import InterviewHistory from './components/InterviewHistory'

const TOTAL_QUESTIONS = 4

export default function App() {
  const [stage, setStage] = useState<InterviewStage>('topic')
  const [topic, setTopic] = useState('')
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [questionNumber, setQuestionNumber] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [startedAt, setStartedAt] = useState('')
  const [transcript, setTranscript] = useState<InterviewTranscript | null>(null)
  const [savedTranscripts, setSavedTranscripts] = useState(loadTranscripts)

  async function fetchQuestion(
    t: string,
    qNum: number,
    previousExchanges: Exchange[]
  ): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const question = await generateQuestion(t, qNum, TOTAL_QUESTIONS, previousExchanges)
      setCurrentQuestion(question)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate question.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleStart(selectedTopic: string): void {
    const now = new Date().toISOString()
    setTopic(selectedTopic)
    setStartedAt(now)
    setStage('interview')
    void fetchQuestion(selectedTopic, 1, [])
  }

  async function handleFinish(finalExchanges: Exchange[]): Promise<void> {
    setIsLoading(true)
    try {
      const analysis = await generateAnalysis(topic, finalExchanges)
      const completedAt = new Date().toISOString()
      const built: InterviewTranscript = {
        id: 'interview_' + Date.now(),
        topic,
        startedAt,
        completedAt,
        durationSeconds: Math.floor((Date.now() - Date.parse(startedAt)) / 1000),
        exchanges: finalExchanges,
        analysis,
      }
      saveTranscript(built)
      setSavedTranscripts(loadTranscripts())
      setTranscript(built)
      setStage('analysis')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate analysis.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleAnswer(answer: string): void {
    if (answer === '__retry__') {
      void fetchQuestion(topic, questionNumber, exchanges)
      return
    }

    const newExchange: Exchange = {
      questionNumber,
      question: currentQuestion,
      answer,
      timestamp: new Date().toISOString(),
    }
    const updatedExchanges = [...exchanges, newExchange]
    setExchanges(updatedExchanges)

    if (questionNumber === TOTAL_QUESTIONS) {
      void handleFinish(updatedExchanges)
    } else {
      const next = questionNumber + 1
      setQuestionNumber(next)
      void fetchQuestion(topic, next, updatedExchanges)
    }
  }

  function handleRestart(): void {
    setStage('topic')
    setTopic('')
    setExchanges([])
    setCurrentQuestion('')
    setQuestionNumber(1)
    setIsLoading(false)
    setError(null)
    setStartedAt('')
    setTranscript(null)
  }

  function handleDownload(): void {
    if (transcript) downloadTranscript(transcript)
  }

  function handleGoToHistory(): void {
    setSavedTranscripts(loadTranscripts())
    setStage('history')
  }

  function handleHistoryChange(): void {
    setSavedTranscripts(loadTranscripts())
  }

  if (stage === 'topic') {
    return <TopicSelector onStart={handleStart} onHistory={handleGoToHistory} />
  }

  if (stage === 'interview') {
    return (
      <InterviewChat
        topic={topic}
        exchanges={exchanges}
        currentQuestion={currentQuestion}
        questionNumber={questionNumber}
        totalQuestions={TOTAL_QUESTIONS}
        isLoading={isLoading}
        error={error}
        onAnswer={handleAnswer}
      />
    )
  }

  if (stage === 'analysis' && transcript) {
    return (
      <AnalysisReport
        transcript={transcript}
        onRestart={handleRestart}
        onDownload={handleDownload}
      />
    )
  }

  if (stage === 'history') {
    return (
      <InterviewHistory
        transcripts={savedTranscripts}
        onBack={handleRestart}
        onTranscriptsChange={handleHistoryChange}
      />
    )
  }

  return null
}
