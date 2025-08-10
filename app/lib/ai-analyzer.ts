import { BANTScore, MEDDICScore, MetricConfidence } from '@/app/types'

const BANT_KEYWORDS = {
  budget: ['budget', 'cost', 'price', 'investment', 'spend', 'allocate', 'finance', 'funding'],
  authority: ['decision', 'approve', 'stakeholder', 'manager', 'director', 'executive', 'sign off'],
  need: ['problem', 'challenge', 'issue', 'pain', 'requirement', 'solution', 'improve', 'optimize'],
  timeline: ['when', 'timeline', 'deadline', 'quarter', 'month', 'asap', 'urgent', 'schedule'],
}

const MEDDIC_KEYWORDS = {
  metrics: ['measure', 'kpi', 'metric', 'benchmark', 'target', 'goal', 'success', 'roi'],
  economicBuyer: ['budget holder', 'cfo', 'vp', 'executive', 'final decision', 'sign contract'],
  decisionCriteria: ['criteria', 'evaluate', 'compare', 'requirements', 'must have', 'priority'],
  decisionProcess: ['process', 'steps', 'approval', 'procurement', 'legal', 'review', 'committee'],
  identifyPain: ['pain point', 'struggle', 'frustration', 'bottleneck', 'inefficient', 'waste'],
  champion: ['advocate', 'support', 'champion', 'sponsor', 'enthusiastic', 'push', 'promote'],
}

export async function analyzeTranscript(transcript: string): Promise<{
  bantScores: BANTScore
  meddicScores: MEDDICScore
  confidenceScores: MetricConfidence[]
  insights: string[]
}> {
  const lowerTranscript = transcript.toLowerCase()
  
  const bantScores = calculateBANTScores(lowerTranscript)
  const meddicScores = calculateMEDDICScores(lowerTranscript)
  const confidenceScores = generateConfidenceScores(bantScores, meddicScores, lowerTranscript)
  const insights = generateInsights(bantScores, meddicScores)
  
  return {
    bantScores,
    meddicScores,
    confidenceScores,
    insights,
  }
}

function calculateBANTScores(transcript: string): BANTScore {
  const scores: BANTScore = {
    budget: 0,
    authority: 0,
    need: 0,
    timeline: 0,
  }
  
  for (const [metric, keywords] of Object.entries(BANT_KEYWORDS)) {
    let score = 0
    let mentions = 0
    
    for (const keyword of keywords) {
      const regex = new RegExp(keyword, 'gi')
      const matches = transcript.match(regex)
      if (matches) {
        mentions += matches.length
      }
    }
    
    score = Math.min(100, mentions * 15)
    scores[metric as keyof BANTScore] = score
  }
  
  return scores
}

function calculateMEDDICScores(transcript: string): MEDDICScore {
  const scores: MEDDICScore = {
    metrics: 0,
    economicBuyer: 0,
    decisionCriteria: 0,
    decisionProcess: 0,
    identifyPain: 0,
    champion: 0,
  }
  
  for (const [metric, keywords] of Object.entries(MEDDIC_KEYWORDS)) {
    let score = 0
    let mentions = 0
    
    for (const keyword of keywords) {
      const regex = new RegExp(keyword, 'gi')
      const matches = transcript.match(regex)
      if (matches) {
        mentions += matches.length
      }
    }
    
    score = Math.min(100, mentions * 12)
    scores[metric as keyof MEDDICScore] = score
  }
  
  return scores
}

function generateConfidenceScores(
  bantScores: BANTScore,
  meddicScores: MEDDICScore,
  transcript: string
): MetricConfidence[] {
  const confidenceScores: MetricConfidence[] = []
  
  for (const [metric, score] of Object.entries(bantScores)) {
    const keywords = BANT_KEYWORDS[metric as keyof typeof BANT_KEYWORDS]
    let keywordCount = 0
    
    for (const keyword of keywords) {
      if (transcript.includes(keyword)) {
        keywordCount++
      }
    }
    
    const confidence = Math.min(1, keywordCount / keywords.length + 0.3)
    
    confidenceScores.push({
      metric,
      score,
      confidence: Number(confidence.toFixed(2)),
      aiGenerated: true,
    })
  }
  
  for (const [metric, score] of Object.entries(meddicScores)) {
    const keywords = MEDDIC_KEYWORDS[metric as keyof typeof MEDDIC_KEYWORDS]
    let keywordCount = 0
    
    for (const keyword of keywords) {
      if (transcript.includes(keyword)) {
        keywordCount++
      }
    }
    
    const confidence = Math.min(1, keywordCount / keywords.length + 0.25)
    
    confidenceScores.push({
      metric,
      score,
      confidence: Number(confidence.toFixed(2)),
      aiGenerated: true,
    })
  }
  
  return confidenceScores
}

function generateInsights(bantScores: BANTScore, meddicScores: MEDDICScore): string[] {
  const insights: string[] = []
  
  if (bantScores.budget < 50) {
    insights.push('Schedule a budget discussion with the finance team')
  }
  
  if (bantScores.authority < 50) {
    insights.push('Identify and engage the decision-maker')
  }
  
  if (meddicScores.champion < 50) {
    insights.push('Build a stronger relationship with an internal champion')
  }
  
  if (meddicScores.metrics < 50) {
    insights.push('Share ROI calculator and success metrics from similar clients')
  }
  
  if (bantScores.timeline < 50) {
    insights.push('Clarify implementation timeline and urgency')
  }
  
  return insights
}