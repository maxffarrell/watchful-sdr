'use client'

import { useState, useEffect } from 'react'
import MetricCard from './components/MetricCard'
import ValidationForm from './components/ValidationForm'
import InsightsPanel from './components/InsightsPanel'
import GamificationBar from './components/GamificationBar'
import ScoreVisualizer from './components/ScoreVisualizer'
import TranscriptUpload from './components/TranscriptUpload'
import SDRStats from './components/SDRStats'
import AutomationInsights from './components/AutomationInsights'
import ROICalculator from './components/ROICalculator'
import WorkflowAutomation from './components/WorkflowAutomation'
import LeadRouting from './components/LeadRouting'
import IntegrationArchitecture from './components/IntegrationArchitecture'
import { MetricConfidence, SDRProfile } from './types'
import { generateMockScores, calculateLeadScore, identifyLowestConfidenceMetrics } from './lib/scoring'
import { logError, getErrorMessage } from './lib/error-utils'

export default function Dashboard() {
  
  const [scores, setScores] = useState(generateMockScores())
  const [validationQueue, setValidationQueue] = useState<MetricConfidence[]>([])
  const [showUpload, setShowUpload] = useState(true)
  const [activeTab, setActiveTab] = useState<'analysis' | 'automation'>('analysis')
  const [insights, setInsights] = useState<string[]>([
    'Ask: "What would happen if a real security incident occurred during a shift overwhelmed by false alarms?"',
    'Schedule demo with Head of Security Marcus to show Quill\'s 87% false alarm reduction',
    'Send ROI calculator showing guard time savings and incident response improvement',
    'Arrange technical discussion about Milestone integration and deployment timeline',
  ])
  const [priorityFocus, setPriorityFocus] = useState<string>("Quantify false alarm costs and demonstrate Quill's ROI through guard efficiency gains")
  const [sdrStats, setSdrStats] = useState({
    talkRatio: 35,
    questionsAsked: 8,
    painPointsUncovered: 3,
    nextStepsClarity: 7,
    objectionHandling: 6
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
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
    const lowestConfidence = identifyLowestConfidenceMetrics(scores.confidence, 5)
    setValidationQueue(lowestConfidence)
  }, [scores])

  const handleValidateAll = (validations: Array<{metric: string, score: number, reasoning?: string}>) => {
    
    // Clear validation queue
    setValidationQueue([])
    
    // Activity-based gamification - points for completion, not accuracy
    setProfile(prev => ({
      ...prev,
      points: prev.points + (15 * validations.length), // 15 points per validation
      totalValidations: prev.totalValidations + validations.length,
      correctValidations: prev.correctValidations + validations.length, // All validations count as "correct"
      accuracy: 100, // Always 100% for activity completion
      streak: prev.streak + validations.length,
    }))

    // Update scores with human validations
    setScores(prev => ({
      ...prev,
      confidence: prev.confidence.map(m => {
        const validation = validations.find(v => v.metric === m.metric)
        return validation 
          ? { ...m, humanValidated: true, humanScore: validation.score }
          : m
      }),
    }))
    
  }

  const handleTranscriptAnalyzed = async (transcript: string) => {
    setIsAnalyzing(true)
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      })
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`)
      }
      
      const analysis = await response.json()
      
      setScores({
        bant: analysis.bantScores,
        meddic: analysis.meddicScores,
        confidence: analysis.confidenceScores
      })
      
      setInsights(analysis.insights)
      setPriorityFocus(analysis.priorityFocus || "Focus on key pain points and demonstrate clear ROI")
      
      if (analysis.sdrStats) {
        setSdrStats(analysis.sdrStats)
      }
      
    } catch (error) {
      logError('TRANSCRIPT_ANALYSIS', error)
      
      const newScores = generateMockScores()
      setScores(newScores)
    }
    
    setShowUpload(false)
    setCallsAnalyzed(prev => prev + 1)
    setIsAnalyzing(false)
    
    setProfile(prev => ({
      ...prev,
      points: prev.points + 25,
    }))
  }

  const overallScore = calculateLeadScore(scores.bant, scores.meddic, scores.confidence)

  return (
    <div className="min-h-screen p-6 bg-console-dark">
      <header className="mb-8 border-b border-console-light pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl tracking-wider text-console-light">WATCHFUL // SALES AUTOMATION PLATFORM</h1>
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
          <TranscriptUpload onAnalyze={handleTranscriptAnalyzed} isAnalyzing={isAnalyzing} />
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('analysis')}
          className={`px-4 py-2 text-sm border transition-all ${
            activeTab === 'analysis'
              ? 'border-console-accent bg-console-accent bg-opacity-20 text-console-accent'
              : 'border-console-gray text-console-gray hover:border-console-light'
          }`}
        >
          CALL ANALYSIS
        </button>
        <button
          onClick={() => setActiveTab('automation')}
          className={`px-4 py-2 text-sm border transition-all ${
            activeTab === 'automation'
              ? 'border-console-accent bg-console-accent bg-opacity-20 text-console-accent'
              : 'border-console-gray text-console-gray hover:border-console-light'
          }`}
        >
          AUTOMATION & SCALING
        </button>
      </div>

      {/* Top Section - SDR Stats Left, Leaderboard Right */}
      <SDRStats 
        {...sdrStats}
        callsAnalyzed={callsAnalyzed}
        weeklyGoal={weeklyGoal}
        teamLeaderboard={teamLeaderboard}
      />

      {/* Conditional Content Based on Active Tab */}
      {activeTab === 'analysis' ? (
        /* Two Column Layout - Lead Score/Insights Left, Validations Right */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Column - Lead Score, Analysis & Insights */}
        <div className="space-y-6">
          
          {/* Discovery Score Card */}
          <div className="console-panel">
            <h2 className="section-header mb-4">
              LEAD QUALIFICATION SCORE
            </h2>
            <div className="text-center py-6">
              <div className="text-5xl font-bold text-console-light mb-2">
                {overallScore}
              </div>
              <div className="text-sm text-console-gray uppercase">Overall Discovery Score</div>
              <div className="w-full mt-4 bg-console-dark border border-console-light h-4 relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-console-light transition-all duration-500"
                  style={{ width: `${overallScore}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-console-gray">
              <div className="text-center">
                <div className="text-lg font-bold text-console-light">
                  {((scores.confidence.reduce((sum, c) => sum + c.confidence, 0) / scores.confidence.length) * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-console-gray uppercase">Confidence Avg</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-console-light">
                  ${(45 + Math.floor(overallScore / 10) * 5)}K
                </div>
                <div className="text-xs text-console-gray uppercase">Deal Potential</div>
              </div>
            </div>
          </div>

          {/* BANT/MEDDIC Score Visualizer */}
          <ScoreVisualizer
            bantScores={scores.bant}
            meddicScores={scores.meddic}
            overallScore={overallScore}
            validationQueue={validationQueue.map(m => m.metric)}
          />
          
          {/* Discovery Insights */}
          <InsightsPanel 
            insights={insights} 
            revenueImpact={45000} 
            priorityFocus={priorityFocus} 
          />
          
        </div>

        {/* Right Column - Validations */}
        <div className="space-y-6">
          {validationQueue.length > 0 ? (
            <ValidationForm
              metrics={validationQueue}
              onValidateAll={handleValidateAll}
            />
          ) : (
            <div className="console-panel text-center py-12 text-console-gray border-2 border-dashed border-console-light bg-console-light bg-opacity-5">
              <div className="text-3xl mb-3 text-console-light">✓</div>
              <div className="text-console-light text-base font-medium mb-2">All validations complete!</div>
              <div className="text-xs mb-4 text-console-gray">+75 points earned • Model accuracy improved</div>
              <button 
                onClick={() => setShowUpload(true)}
                className="console-button text-xs px-6 py-3"
              >
                ANALYZE NEXT CALL
              </button>
            </div>
          )}
        </div>
      </div>
      ) : (
        /* Automation Tab Content */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AutomationInsights callsAnalyzed={callsAnalyzed} teamSize={4} />
            <ROICalculator />
          </div>
          
          <WorkflowAutomation />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LeadRouting />
            <IntegrationArchitecture />
          </div>
        </div>
      )}
    </div>
  )
}