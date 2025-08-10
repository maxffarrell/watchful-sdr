'use client'

import { useState, useEffect } from 'react'
import MetricCard from './components/MetricCard'
import ValidationCard from './components/ValidationCard'
import InsightsPanel from './components/InsightsPanel'
import GamificationBar from './components/GamificationBar'
import ScoreVisualizer from './components/ScoreVisualizer'
import TranscriptUpload from './components/TranscriptUpload'
import { MetricConfidence, SDRProfile } from './types'
import { generateMockScores, calculateLeadScore, identifyLowestConfidenceMetrics } from './lib/scoring'

export default function Dashboard() {
  const [scores, setScores] = useState(generateMockScores())
  const [validationQueue, setValidationQueue] = useState<MetricConfidence[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [profile, setProfile] = useState<SDRProfile>({
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    points: 875,
    accuracy: 92,
    streak: 5,
    rank: 3,
    level: 'silver',
    totalValidations: 124,
    correctValidations: 114,
    revenueImpact: 245000,
  })

  useEffect(() => {
    const lowestConfidence = identifyLowestConfidenceMetrics(scores.confidence, 3)
    setValidationQueue(lowestConfidence)
  }, [scores])

  const handleValidation = (metricName: string, score: number, reasoning?: string) => {
    setValidationQueue(prev => prev.filter(m => m.metric !== metricName))
    
    setProfile(prev => ({
      ...prev,
      points: prev.points + 10,
      totalValidations: prev.totalValidations + 1,
      correctValidations: prev.correctValidations + (Math.random() > 0.3 ? 1 : 0),
    }))

    setScores(prev => ({
      ...prev,
      confidence: prev.confidence.map(m => 
        m.metric === metricName 
          ? { ...m, humanValidated: true, humanScore: score }
          : m
      ),
    }))
  }

  const handleSkip = (metricName: string) => {
    setValidationQueue(prev => prev.filter(m => m.metric !== metricName))
  }

  const handleTranscriptAnalyzed = (transcript: string) => {
    const newScores = generateMockScores()
    setScores(newScores)
    setShowUpload(false)
  }

  const overallScore = calculateLeadScore(scores.bant, scores.meddic, scores.confidence)

  const insights = [
    'Schedule executive alignment call (Impact: +$15K)',
    'Share ROI calculator (Impact: +$8K)',
    'Identify technical champion (Impact: +$12K)',
  ]

  return (
    <div className="min-h-screen p-6">
      <header className="mb-8 border-b border-console-white pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl tracking-wider">WATCHFUL // SDR INTELLIGENCE</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowUpload(!showUpload)} 
              className="console-button text-xs"
            >
              {showUpload ? 'HIDE UPLOAD' : 'NEW TRANSCRIPT'}
            </button>
            <div className="text-sm text-console-gray">
              {profile.name} | {profile.points} PTS
            </div>
          </div>
        </div>
      </header>

      {showUpload && (
        <div className="mb-6">
          <TranscriptUpload onAnalyze={handleTranscriptAnalyzed} />
        </div>
      )}

      <div className="mb-6">
        <GamificationBar
          points={profile.points}
          rank={profile.rank}
          streak={profile.streak}
          accuracy={profile.accuracy}
          level={profile.level}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard 
          title="LEAD SCORE" 
          value={overallScore} 
          showProgress 
          progress={overallScore} 
        />
        <MetricCard 
          title="CONFIDENCE" 
          value={(scores.confidence.reduce((sum, c) => sum + c.confidence, 0) / scores.confidence.length).toFixed(2)} 
        />
        <MetricCard 
          title="REVENUE IMPACT" 
          value={`+$${(profile.revenueImpact / 1000).toFixed(0)}K`} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-sm uppercase tracking-wider mb-4 text-console-gray">
            PENDING VALIDATIONS [{validationQueue.length}]
          </h2>
          {validationQueue.length > 0 ? (
            validationQueue.map((metric) => (
              <ValidationCard
                key={metric.metric}
                metric={metric}
                onValidate={(score, reasoning) => handleValidation(metric.metric, score, reasoning)}
                onSkip={() => handleSkip(metric.metric)}
              />
            ))
          ) : (
            <div className="console-panel text-center py-8 text-console-gray">
              All validations complete
            </div>
          )}
        </div>

        <div className="space-y-6">
          <ScoreVisualizer
            bantScores={scores.bant}
            meddicScores={scores.meddic}
            overallScore={overallScore}
          />
          <InsightsPanel insights={insights} revenueImpact={45000} />
        </div>
      </div>
    </div>
  )
}