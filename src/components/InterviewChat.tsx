import { useState, useEffect, useRef } from 'react'
import type { Exchange } from '../types/interview'
import ProgressBar from './ProgressBar'

interface InterviewChatProps {
  topic: string
  exchanges: Exchange[]
  currentQuestion: string
  questionNumber: number
  totalQuestions: number
  isLoading: boolean
  error: string | null
  onAnswer: (answer: string) => void
}

export default function InterviewChat({
  topic,
  exchanges,
  currentQuestion,
  questionNumber,
  totalQuestions,
  isLoading,
  error,
  onAnswer,
}: InterviewChatProps) {
  const [answer, setAnswer] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [exchanges, currentQuestion, isLoading])

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length
  const canSubmit = wordCount >= 3
  const buttonLabel = questionNumber === totalQuestions ? 'Finish Interview' : 'Next Question'

  function handleSubmit() {
    if (!canSubmit) return
    onAnswer(answer)
    setAnswer('')
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center p-6">
      <div className="w-full max-w-2xl flex flex-col gap-6">

        <div className="pt-4">
          <p className="text-center text-gray-500 text-sm mb-4">{topic}</p>
          <ProgressBar currentQuestion={questionNumber} totalQuestions={totalQuestions} />
        </div>

        <div className="flex flex-col gap-6">
          {exchanges.map((exchange) => (
            <div key={exchange.questionNumber} className="flex flex-col gap-3">
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500 mb-1 ml-1">Interviewer</span>
                <div className="bg-[#1a1a1a] rounded-2xl px-4 py-3 max-w-[85%] text-gray-400 text-sm">
                  {exchange.question}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500 mb-1 mr-1">You</span>
                <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-2xl px-4 py-3 max-w-[85%] text-white text-sm">
                  {exchange.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="flex items-center gap-3 text-gray-400">
            <div className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col gap-3">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              type="button"
              onClick={() => onAnswer('__retry__')}
              className="self-start px-4 py-2 text-sm rounded-lg bg-[#1a1a1a] border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors duration-200 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && currentQuestion && (
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-500 mb-1 ml-1">Interviewer</span>
            <div className="bg-[#1a1a1a] border-l-4 border-indigo-500 rounded-r-2xl px-4 py-3 w-full text-gray-200">
              {currentQuestion}
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex flex-col gap-3">
            <textarea
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors duration-200 resize-none"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 cursor-pointer bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#2a2a2a] disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {buttonLabel}
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
