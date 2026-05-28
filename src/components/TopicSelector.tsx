import { useState } from 'react'
import { loadTranscripts } from '../utils/storage'

interface TopicSelectorProps {
  onStart: (topic: string) => void
  onHistory: () => void
}

const PRESETS = [
  'AI in the Workplace',
  'Future of Education',
  'Climate & Technology',
  'Mental Health & Apps',
  'Productivity Tools',
  'Scientific Research',
]

export default function TopicSelector({ onStart, onHistory }: TopicSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [customTopic, setCustomTopic] = useState('')

  const activeTopic = customTopic.trim() || selectedPreset || ''
  const savedCount = loadTranscripts().length

  function handlePresetClick(preset: string) {
    setSelectedPreset(preset)
    setCustomTopic('')
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCustomTopic(e.target.value)
    setSelectedPreset(null)
  }

  function handleStart() {
    if (activeTopic) onStart(activeTopic)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">AI Interviewer</h1>
          <p className="text-lg text-gray-400">Choose a topic and share your perspective</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className={`p-4 rounded-lg border text-sm font-medium text-left transition-all duration-200 cursor-pointer
                ${selectedPreset === preset
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                  : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 hover:border-indigo-500/50 hover:text-white'
                }`}
            >
              {preset}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[#2a2a2a]" />
          <span className="text-sm text-gray-500 whitespace-nowrap">or enter your own topic</span>
          <div className="flex-1 h-px bg-[#2a2a2a]" />
        </div>

        <input
          type="text"
          value={customTopic}
          onChange={handleInputChange}
          placeholder="e.g. Remote work culture"
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors duration-200 mb-4"
        />

        <button
          type="button"
          onClick={handleStart}
          disabled={!activeTopic}
          className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 cursor-pointer bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#2a2a2a] disabled:text-gray-500 disabled:cursor-not-allowed mb-3"
        >
          Start Interview
        </button>

        {savedCount > 0 && (
          <button
            type="button"
            onClick={onHistory}
            className="w-full py-3 rounded-lg font-medium text-sm text-gray-400 border border-[#2a2a2a] hover:border-indigo-500/40 hover:text-white transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Past Interviews</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-semibold">{savedCount}</span>
          </button>
        )}

      </div>
    </div>
  )
}
