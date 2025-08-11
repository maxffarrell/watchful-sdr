'use client'

import { useState } from 'react'

interface TranscriptUploadProps {
  onAnalyze: (transcript: string) => Promise<void>
  isAnalyzing?: boolean
}

export default function TranscriptUpload({ onAnalyze, isAnalyzing: externalAnalyzing = false }: TranscriptUploadProps) {
  const [transcript, setTranscript] = useState('')
  const isAnalyzing = externalAnalyzing

  const sampleTranscript = `
    SDR: Thanks for taking the time today! I understand you're responsible for security operations at your facilities. Can you tell me about your current monitoring setup?
    
    Prospect: Sure. We have about XXX cameras across multiple locations, but honestly, we're drowning in false alarms. Our guards are constantly responding to motion from trees, shadows, small animals - it's exhausting.
    
    SDR: That sounds incredibly frustrating. How many false alarms would you estimate you get per day?
    
    Prospect: Easily XXX-XXX false alerts daily. Our team spends XX% of their time just dismissing false positives. We're missing real security events because of all the noise.
    
    SDR: Wow, so you're essentially paying guards to watch false alarms instead of actual threats. What's the impact on your operations?
    
    Prospect: Huge. Guard burnout is through the roof. We can barely staff X guards per shift to monitor all those cameras. Response time to real incidents has doubled because they're so overwhelmed.
    
    SDR: Who typically evaluates new security technology in your organization?
    
    Prospect: That would be me and our Head of Security. Any solution over $XXXk needs board approval, but we have some flexibility under that threshold.
    
    SDR: Got it. If you could eliminate XX% of those false alarms while ensuring you never miss a real threat, what would that mean for your team?
    
    Prospect: Game changer. We could actually focus on real security work instead of chasing shadows. But I'd need to see proof it actually works and integrates with our existing systems.
    
    SDR: Absolutely. Let me show you how our AI integrates directly with existing systems and reduces false alarms significantly. When would be a good time for a technical demo?
  `

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      return
    }
    
    try {
      await onAnalyze(transcript)
    } catch (error) {
      const err = error as Error
      console.error('Analysis failed:', err)
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
            className={`console-button ${
              isAnalyzing ? 'animate-fade-pulse' : ''
            }`}
          >
            {isAnalyzing ? 'ANALYZING...' : 'ANALYZE'}
          </button>
          
          <style jsx>{`
            @keyframes fade-pulse {
              0%, 100% { 
                opacity: 0.3;
              }
              50% { 
                opacity: 1;
              }
            }
            
            .animate-fade-pulse {
              animation: fade-pulse 1.5s ease-in-out infinite;
            }
          `}</style>
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