'use client'

import { useState } from 'react'

interface AutomationInsight {
  task: string
  currentTime: number
  automatedTime: number
  impact: 'high' | 'medium' | 'low'
  implementation: string
}

interface AutomationInsightsProps {
  callsAnalyzed: number
  teamSize?: number
}

export default function AutomationInsights({ callsAnalyzed, teamSize = 4 }: AutomationInsightsProps) {
  const [showDetails, setShowDetails] = useState(false)
  
  const insights: AutomationInsight[] = [
    {
      task: 'Lead Research & Enrichment',
      currentTime: 15,
      automatedTime: 0.5,
      impact: 'high',
      implementation: 'AI-powered data enrichment via APIs'
    },
    {
      task: 'Call Scheduling & Follow-ups',
      currentTime: 10,
      automatedTime: 0,
      impact: 'high',
      implementation: 'Automated cadence sequences'
    },
    {
      task: 'Call Notes & CRM Updates',
      currentTime: 8,
      automatedTime: 0.2,
      impact: 'high',
      implementation: 'AI transcription + auto-logging to CRM'
    },
    {
      task: 'Lead Scoring & Prioritization',
      currentTime: 5,
      automatedTime: 0,
      impact: 'medium',
      implementation: 'ML model analyzing buying signals'
    },
    {
      task: 'Email Personalization',
      currentTime: 12,
      automatedTime: 2,
      impact: 'medium',
      implementation: 'AI-powered dynamic templates'
    }
  ]
  
  const totalCurrentTime = insights.reduce((sum, i) => sum + i.currentTime, 0)
  const totalAutomatedTime = insights.reduce((sum, i) => sum + i.automatedTime, 0)
  const timeSaved = totalCurrentTime - totalAutomatedTime
  const efficiencyGain = ((timeSaved / totalCurrentTime) * 100).toFixed(0)
  
  const scalingFactor = Math.floor(totalCurrentTime / totalAutomatedTime)
  
  return (
    <div className="console-panel">
      <h2 className="section-header mb-4">
        AUTOMATION IMPACT ANALYSIS
      </h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 border border-console-light">
          <div className="text-3xl font-bold text-console-accent mb-1">
            Xx
          </div>
          <div className="text-xs text-console-gray uppercase">
            Productivity Multiplier
          </div>
        </div>
        
        <div className="text-center p-4 border border-console-light">
          <div className="text-3xl font-bold text-console-light mb-1">
            X%
          </div>
          <div className="text-xs text-console-gray uppercase">
            Time Saved Per Call
          </div>
        </div>
        
        <div className="text-center p-4 border border-console-light">
          <div className="text-3xl font-bold text-green-400 mb-1">
            $XM
          </div>
          <div className="text-xs text-console-gray uppercase">
            Monthly Revenue Impact
          </div>
        </div>
      </div>
      
      <div className="mb-4 p-4 bg-console-light bg-opacity-5 border border-console-light">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-console-gray">Current Team Capacity</span>
          <span className="text-sm font-bold text-console-light">X SDRs → X calls/month</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-console-accent">With Automation</span>
          <span className="text-sm font-bold text-console-accent">X SDRs → XX,XXX calls/month</span>
        </div>
      </div>
      
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="console-button w-full mb-4 text-xs"
      >
        {showDetails ? 'HIDE' : 'SHOW'} AUTOMATION BREAKDOWN
      </button>
      
      {showDetails && (
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <div key={index} className="border border-console-gray p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="text-sm font-medium text-console-light mb-1">
                    {insight.task}
                  </div>
                  <div className="text-xs text-console-gray">
                    {insight.implementation}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-xs text-console-gray">
                    X min → X min
                  </div>
                  <div className={`text-xs font-bold mt-1 ${
                    insight.impact === 'high' ? 'text-green-400' : 
                    insight.impact === 'medium' ? 'text-yellow-400' : 'text-console-gray'
                  }`}>
                    X% REDUCED
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 p-3 bg-yellow-500 bg-opacity-10 border border-yellow-500 text-xs">
        <div className="font-bold text-yellow-400 mb-1">KEY INSIGHT</div>
        <div className="text-console-light">
          Your X SDRs could handle the workload of XX SDRs with proper automation,
          generating significant additional pipeline.
        </div>
      </div>
    </div>
  )
}