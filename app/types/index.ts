export interface BANTScore {
  budget: number
  authority: number
  need: number
  timeline: number
}

export interface MEDDICScore {
  metrics: number
  economicBuyer: number
  decisionCriteria: number
  decisionProcess: number
  identifyPain: number
  champion: number
}

export interface MetricConfidence {
  metric: string
  score: number
  confidence: number
  aiGenerated: boolean
  humanValidated?: boolean
  humanScore?: number
}

export interface CallTranscript {
  id: string
  sdrId: string
  sdrName: string
  callDate: Date
  duration: number
  transcript: string
  processedAt?: Date
}

export interface CallAnalysis {
  id: string
  transcriptId: string
  bantScores: BANTScore
  meddicScores: MEDDICScore
  confidenceScores: MetricConfidence[]
  overallLeadScore: number
  createdAt: Date
  updatedAt: Date
}

export interface ValidationRequest {
  id: string
  analysisId: string
  metric: string
  aiScore: number
  confidence: number
  status: 'pending' | 'completed' | 'skipped'
  humanScore?: number
  reasoning?: string
  validatedAt?: Date
}

export interface SDRProfile {
  id: string
  name: string
  email: string
  points: number
  accuracy: number
  streak: number
  rank: number
  level: 'bronze' | 'silver' | 'gold' | 'platinum'
  totalValidations: number
  correctValidations: number
  revenueImpact: number
}

export interface ActionableInsight {
  id: string
  analysisId: string
  priority: 'high' | 'medium' | 'low'
  action: string
  impact: number
  talkTrack?: string
  nextBestAction?: string
}

export interface GameAchievement {
  id: string
  name: string
  description: string
  points: number
  icon: string
  unlockedAt?: Date
}