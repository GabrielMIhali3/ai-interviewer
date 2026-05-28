import { useState } from 'react'
import type { InterviewTranscript, Sentiment } from '../types/interview'
import { downloadTranscript, deleteTranscript } from '../utils/storage'

interface InterviewHistoryProps {
  transcripts: InterviewTranscript[]
  onBack: () => void
  onTranscriptsChange: () => void
}

const sentimentStyles: Record<Sentiment, string> = {
  positive: 'bg-green-500/10 border-green-500/30 text-green-400',
  neutral: 'bg-gray-500/10 border-gray-500/30 text-gray-400',
  negative: 'bg-red-500/10 border-red-500/30 text-red-400',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export default function InterviewHistory({
  transcripts,
  onBack,
  onTranscriptsChange,
}: InterviewHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function handleDelete(id: string) {
    deleteTranscript(id)
    onTranscriptsChange()
    if (expandedId === id) setExpandedId(null)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center p-6 pb-12">
      <div className="w-full max-w-2xl flex flex-col gap-6">

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-white transition-colors duration-200 flex items-center gap-2 cursor-pointer"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-white">Past Interviews</h1>
          <span className="text-sm text-gray-600">{transcripts.length} saved</span>
        </div>

        {transcripts.length === 0 && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-10 text-center">
            <p className="text-gray-500 text-sm">No interviews saved yet.</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {transcripts.map((t) => {
            const isOpen = expandedId === t.id
            const sentimentLabel =
              t.analysis.sentiment.charAt(0).toUpperCase() + t.analysis.sentiment.slice(1)

            return (
              <div
                key={t.id}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden"
              >
                {/* Header row */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : t.id)}
                  className="w-full px-5 py-4 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-[#222] transition-colors duration-150"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-white font-medium truncate">{t.topic}</span>
                    <span className="text-xs text-gray-500">{formatDate(t.startedAt)} · {formatDuration(t.durationSeconds)}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-3 py-1 rounded-full border text-xs font-medium ${sentimentStyles[t.analysis.sentiment]}`}>
                      {sentimentLabel} · {t.analysis.sentimentScore}/100
                    </span>
                    <span className={`text-gray-400 transition-transform duration-200 inline-block ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                  </div>
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div className="border-t border-[#2a2a2a] px-5 pb-5 flex flex-col gap-4 pt-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Summary</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{t.analysis.summary}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {t.analysis.keywords.map((kw) => (
                          <span key={kw} className="px-3 py-1 rounded-full text-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Themes</p>
                      <ol className="flex flex-col gap-1">
                        {t.analysis.themes.map((theme, i) => (
                          <li key={theme} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-indigo-500 font-semibold shrink-0">{i + 1}.</span>
                            {theme}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Transcript</p>
                      <div className="flex flex-col gap-3">
                        {t.exchanges.map((ex) => (
                          <div key={ex.questionNumber} className="flex flex-col gap-1">
                            <p className="text-xs text-gray-500">Q{ex.questionNumber} — {ex.question}</p>
                            <p className="text-sm text-white pl-3 border-l-2 border-indigo-500/40">{ex.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => downloadTranscript(t)}
                        className="flex-1 py-2 rounded-lg text-sm font-medium text-indigo-400 border border-indigo-500/40 hover:bg-indigo-500/10 transition-colors duration-200 cursor-pointer"
                      >
                        Download JSON
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(t.id)}
                        className="flex-1 py-2 rounded-lg text-sm font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors duration-200 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
