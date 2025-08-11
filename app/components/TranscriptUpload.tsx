'use client'

import { useState } from 'react'

interface TranscriptUploadProps {
  onAnalyze: (transcript: string) => void
}

export default function TranscriptUpload({ onAnalyze }: TranscriptUploadProps) {
  const [transcript, setTranscript] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const sampleTranscript = `
    SDR: Thanks for taking the time today! I understand you're responsible for security operations at your facilities. Can you tell me about your current camera monitoring setup?
    
    Prospect: Sure. We have about 150 cameras across three locations, but honestly, we're drowning in false alarms. Our guards are constantly responding to motion from trees, shadows, small animals - it's exhausting.
    
    SDR: That sounds incredibly frustrating. How many false alarms would you estimate you get per day?
    
    Prospect: Easily 200-300 false alerts daily. Our team spends 80% of their time just dismissing false positives. We're missing real security events because of all the noise.
    
    SDR: Wow, so you're essentially paying guards to watch false alarms instead of actual threats. What's the impact on your operations?
    
    Prospect: Huge. Guard burnout is through the roof. We can barely staff two guards per shift to monitor all those cameras. Response time to real incidents has doubled because they're so overwhelmed.
    
    SDR: Who typically evaluates new security technology in your organization?
    
    Prospect: That would be me and our Head of Security, Marcus. Any solution over $100K needs board approval, but we have some flexibility under that threshold.
    
    SDR: Got it. If you could eliminate 87% of those false alarms while ensuring you never miss a real threat, what would that mean for your team?
    
    Prospect: Game changer. We could actually focus on real security work instead of chasing shadows. But I'd need to see proof it actually works and integrates with our existing Milestone system.
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