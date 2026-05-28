import type { InterviewTranscript } from '../types/interview'

const STORAGE_KEY = 'ai_interviewer_transcripts'

export function saveTranscript(transcript: InterviewTranscript): void {
  const existing = loadTranscripts()
  const updated = [transcript, ...existing]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function loadTranscripts(): InterviewTranscript[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as InterviewTranscript[]
  } catch {
    return []
  }
}

export function deleteTranscript(id: string): void {
  const updated = loadTranscripts().filter((t) => t.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function downloadTranscript(transcript: InterviewTranscript): void {
  const json = JSON.stringify(transcript, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const slug = transcript.topic.toLowerCase().replace(/\s+/g, '-')
  const timestamp = Math.floor(Date.parse(transcript.startedAt) / 1000)
  const filename = `interview_${slug}_${timestamp}.json`

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()

  URL.revokeObjectURL(url)
}
