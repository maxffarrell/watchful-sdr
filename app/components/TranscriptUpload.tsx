'use client'

import { useState } from 'react'

interface TranscriptUploadProps {
  onAnalyze: (transcript: string) => void
}

export default function TranscriptUpload({ onAnalyze }: TranscriptUploadProps) {
  const [transcript, setTranscript] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const sampleTranscript = `
    Thanks for taking the time to meet today. I understand you're looking at solutions to improve your sales process.
    
    Yes, we're really struggling with lead qualification. Our team is spending too much time on low-quality leads.
    We need better metrics to measure success. The budget for this quarter is already allocated, about $50,000.
    
    I'll need to discuss this with our VP of Sales, she's the final decision maker on tools like this.
    We're evaluating based on ROI, ease of implementation, and integration with Salesforce.
    
    The pain point is really the inefficiency in our current process. We're wasting hours every week.
    Ideally, we'd like to have something in place by end of Q2. That's our timeline for implementation.
  `

  const handleAnalyze = async () => {
    if (!transcript.trim()) return
    
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      })
      
      const data = await response.json()
      onAnalyze(transcript)
      console.log('Analysis result:', data)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="console-panel">
      <h2 className="text-sm uppercase tracking-wider mb-4 border-b border-console-white pb-2">
        TRANSCRIPT ANALYSIS
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs uppercase text-console-gray">
            Paste Call Transcript
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your call transcript here..."
            className="console-input mt-2 h-32 resize-none font-mono text-xs"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !transcript.trim()}
            className="console-button"
          >
            {isAnalyzing ? 'ANALYZING...' : 'ANALYZE'}
          </button>
          <button
            onClick={() => setTranscript(sampleTranscript)}
            className="console-button"
          >
            LOAD SAMPLE
          </button>
          <button
            onClick={() => setTranscript('')}
            className="console-button"
          >
            CLEAR
          </button>
        </div>
      </div>
    </div>
  )
}