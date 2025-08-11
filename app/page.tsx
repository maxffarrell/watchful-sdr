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
  
  const [callsAnalyzed, setCallsAnalyzed] = useState(47)
  const [weeklyGoal] = useState(50)
  
  // Mock team data for competitive leaderboard (updates with user's actual points/calls)
  const baseTeamData = [
    { name: 'Mike Rodriguez', calls: 52, points: 1240, isCurrentUser: false },
    { name: 'Jessica Kim', calls: 49, points: 1180, isCurrentUser: false },
    { name: 'David Park', calls: 45, points: 1050, isCurrentUser: false },
    { name: 'Amanda Liu', calls: 43, points: 980, isCurrentUser: false },
  ]
  
  const teamLeaderboard = [
    { name: 'Sarah Chen', calls: callsAnalyzed, points: profile.points, isCurrentUser: true },
    ...baseTeamData
  ].sort((a, b) => b.points - a.points).map((person, index) => ({ ...person, rank: index + 1 }))

  useEffect(() => {
    const lowestConfidence = identifyLowestConfidenceMetrics(scores.confidence, 3)
    setValidationQueue(lowestConfidence)
  }, [scores])

  const handleValidation = (metricName: string, score: number, reasoning?: string) => {
    setValidationQueue(prev => prev.filter(m => m.metric !== metricName))
    
    // Activity-based gamification - points for completion, not accuracy
    setProfile(prev => ({
      ...prev,
      points: prev.points + 15, // Standard points for completing validation
      totalValidations: prev.totalValidations + 1,
      correctValidations: prev.correctValidations + 1, // All validations count as "correct"
      accuracy: 100, // Always 100% for activity completion
      streak: prev.streak + 1,
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

  const handleTranscriptAnalyzed = (transcript: string) => {
    const newScores = generateMockScores()
    setScores(newScores)
    setShowUpload(false)
    setCallsAnalyzed(prev => prev + 1)
    
    // Bonus points for analyzing calls
    setProfile(prev => ({
      ...prev,
      points: prev.points + 25,
    }))
  }

  const overallScore = calculateLeadScore(scores.bant, scores.meddic, scores.confidence)

  const insights = [
    'Ask: "What happens if you don\'t solve this problem in the next 6 months?"',
    'Schedule 30-min follow-up with finance stakeholder to discuss budget',
    'Send discovery questionnaire to map current process and pain points',
    'Request introduction to technical team member for implementation planning',
  ]

  return (
    <div className="min-h-screen p-6 bg-console-dark">
      <header className="mb-8 border-b border-console-light pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl tracking-wider text-console-light">WATCHFUL // SDR INTELLIGENCE</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowUpload(!showUpload)} 
              className="console-button text-xs"
            >
              {showUpload ? 'HIDE UPLOAD' : 'NEW TRANSCRIPT'}
            </button>
            <div className="text-sm text-console-gray">
              {profile.name} | Rank #{teamLeaderboard.find(p => p.isCurrentUser)?.rank || 1} • {profile.points} pts
            </div>
          </div>
        </div>
      </header>

      {showUpload && (
        <div className="mb-8">
          <TranscriptUpload onAnalyze={handleTranscriptAnalyzed} />
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column - Validations & Activity */}
        <div className="space-y-6">
          
          {/* Activity Gamification */}
          <div className="console-panel h-fit">
            <h3 className="text-sm uppercase tracking-wider mb-4 text-console-light border-b border-console-light pb-2">
              TEAM LEADERBOARD
            </h3>
            <div className="mb-4">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-console-light">#{teamLeaderboard.find(p => p.isCurrentUser)?.rank || 1}</div>
                <div className="text-xs text-console-gray uppercase">
                  Your Team Rank • {profile.points > 1200 ? '↗' : profile.points > 1000 ? '→' : '↙'} This Week
                </div>
              </div>
              <div className="space-y-2">
                {teamLeaderboard.slice(0, 5).map((person, index) => (
                  <div 
                    key={person.name}
                    className={`flex justify-between items-center p-2 rounded leaderboard-item ${
                      person.isCurrentUser 
                        ? 'bg-console-light bg-opacity-10 border border-console-light' 
                        : 'bg-console-dark bg-opacity-30 hover:bg-console-light'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold w-6 ${person.isCurrentUser ? 'text-console-light' : 'text-console-gray'}`}>
                        #{person.rank}
                      </span>
                      <span className={`text-sm ${person.isCurrentUser ? 'text-console-light font-medium' : 'text-console-gray'}`}>
                        {person.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-console-gray">{person.calls} calls</span>
                      <span className={person.isCurrentUser ? 'text-console-light font-medium' : 'text-console-gray'}>
                        {person.points}pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="text-lg font-medium text-console-light">{callsAnalyzed}</div>
                <div className="text-console-gray uppercase">This Week</div>
              </div>
              <div>
                <div className="text-lg font-medium text-console-light">{profile.streak}</div>
                <div className="text-console-gray uppercase">Day Streak</div>
              </div>
              <div>
                <div className="text-lg font-medium text-console-light capitalize">{profile.level}</div>
                <div className="text-console-gray uppercase">Level</div>
              </div>
            </div>
          </div>

          {/* Validations */}
          <div className="flex-1">
            <h2 className="text-sm uppercase tracking-wider mb-4 text-console-light border-b border-console-light pb-2">
              VALIDATION REQUIRED [{validationQueue.length}]
            </h2>
            {validationQueue.length > 0 ? (
              <div className="space-y-4">
                {validationQueue.map((metric) => (
                  <ValidationCard
                    key={metric.metric}
                    metric={metric}
                    onValidate={(score, reasoning) => handleValidation(metric.metric, score, reasoning)}
                  />
                ))}
              </div>
            ) : (
              <div className="console-panel text-center py-8 text-console-gray">
                <div className="text-lg mb-2">🎉</div>
                <div>All validations complete!</div>
                <div className="text-xs mt-1">+{profile.streak * 5} bonus points for completion</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Analysis & Insights */}
        <div className="space-y-6 h-fit">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-4">
            <MetricCard 
              title="DISCOVERY SCORE" 
              value={overallScore} 
              showProgress 
              progress={overallScore} 
            />
            <MetricCard 
              title="CONFIDENCE AVG" 
              value={`${((scores.confidence.reduce((sum, c) => sum + c.confidence, 0) / scores.confidence.length) * 100).toFixed(0)}%`} 
            />
            <MetricCard 
              title="REVENUE POTENTIAL" 
              value={`$${(profile.revenueImpact / 1000).toFixed(0)}K`} 
            />
          </div>

          {/* Score Analysis */}
          <div className="h-fit">
            <ScoreVisualizer
              bantScores={scores.bant}
              meddicScores={scores.meddic}
              overallScore={overallScore}
            />
          </div>
          
          {/* Discovery Insights */}
          <div className="h-fit">
            <InsightsPanel insights={insights} revenueImpact={45000} />
          </div>
        </div>
      </div>
    </div>
  )
}