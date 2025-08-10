'use client'

import { useState } from 'react'

interface TranscriptUploadProps {
  onAnalyze: (transcript: string) => void
}

export default function TranscriptUpload({ onAnalyze }: TranscriptUploadProps) {
  const [transcript, setTranscript] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const sampleTranscript = `
    SDR: Thanks for joining today! I'd love to learn more about your current sales process. Can you walk me through how your team currently handles lead qualification?
    
    Prospect: Sure. Right now our reps spend about 3-4 hours per day manually researching leads, and honestly, most turn out to be unqualified. It's really inefficient.
    
    SDR: That sounds frustrating. What impact is that having on your team's productivity?
    
    Prospect: Well, our reps are only making about 40 calls per day instead of the 80 we'd like to see. We're missing our pipeline targets by about 30% each quarter.
    
    SDR: 30% is significant. Who typically makes the decision on new sales tools in your organization?
    
    Prospect: That would be our VP of Sales, Sarah. She'd need to see a clear ROI. Our budget for tools this quarter is around $50,000.
    
    SDR: Got it. What would need to happen for you to feel confident recommending a solution to Sarah?
    
    Prospect: I'd need to see how it integrates with our existing Salesforce setup and what kind of time savings we could realistically expect.
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
      
      if (!response.ok) {
        throw new Error('Analysis failed')
      }
      
      const data = await response.json()
      onAnalyze(transcript)
      console.log('Analysis result:', data)
    } catch (error) {
      console.error('Analysis failed:', error)
      // Continue with mock data on error
      onAnalyze(transcript)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="console-panel">
      <h2 className="text-sm uppercase tracking-wider mb-4 border-b border-console-light pb-2 text-console-light">
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