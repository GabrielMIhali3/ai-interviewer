import { useState } from 'react'
import type { InterviewTranscript, Sentiment } from '../types/interview'

interface AnalysisReportProps {
  transcript: InterviewTranscript
  onRestart: () => void
  onDownload: () => void
}

const sentimentStyles: Record<Sentiment, string> = {
  positive: 'bg-green-500/10 border-green-500/30 text-green-400',
  neutral: 'bg-gray-500/10 border-gray-500/30 text-gray-400',
  negative: 'bg-red-500/10 border-red-500/30 text-red-400',
}

function formatDuration(startedAt: string, completedAt: string): string {
  const secs = Math.floor(
    (new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000
  )
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export default function AnalysisReport({ transcript, onRestart, onDownload }: AnalysisReportProps) {
  const [showTranscript, setShowTranscript] = useState(false)
  const { analysis } = transcript
  const duration = formatDuration(transcript.startedAt, transcript.completedAt)
  const sentimentLabel = analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center p-6 pb-12">
      <div className="w-full max-w-2xl flex flex-col gap-5">

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-1">Interview Complete</h1>
          <p className="text-indigo-400 font-medium mb-2">{transcript.topic}</p>
          <p className="text-sm text-gray-500">Completed in {duration}</p>
        </div>

        <div className="flex justify-center">
          <span className={`px-4 py-1.5 rounded-full border text-sm font-medium ${sentimentStyles[analysis.sentiment]}`}>
            {sentimentLabel} · {analysis.sentimentScore}/100
          </span>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Summary</p>
          <p className="text-sm text-gray-300 leading-relaxed">{analysis.summary}</p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Keywords</p>
          <div className="flex flex-wrap gap-2">
            {analysis.keywords.map((kw) => (
              <span key={kw} className="px-3 py-1 rounded-full text-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Key Themes</p>
          <ol className="flex flex-col gap-2">
            {analysis.themes.map((theme, i) => (
              <li key={theme} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="text-indigo-500 font-semibold shrink-0">{i + 1}.</span>
                {theme}
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full px-5 py-4 text-left text-sm text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer flex items-center justify-between"
          >
            <span>{showTranscript ? 'Hide Transcript' : 'View Full Transcript'}</span>
            <span className={`transition-transform duration-200 inline-block ${showTranscript ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {showTranscript && (
            <div className="px-5 pb-5 flex flex-col gap-4 border-t border-[#2a2a2a]">
              {transcript.exchanges.map((exchange) => (
                <div key={exchange.questionNumber} className="flex flex-col gap-1 pt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Q{exchange.questionNumber}</p>
                  <p className="text-sm text-gray-400">{exchange.question}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mt-2">Answer</p>
                  <p className="text-sm text-white">{exchange.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onDownload}
            className="flex-1 py-3 rounded-lg font-semibold text-sm text-indigo-400 border border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-200 cursor-pointer"
          >
            Download Transcript
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 py-3 rounded-lg font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 cursor-pointer"
          >
            Start New Interview
          </button>
        </div>

      </div>
    </div>
  )
}
