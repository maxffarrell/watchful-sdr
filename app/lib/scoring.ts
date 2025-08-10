import { BANTScore, MEDDICScore, MetricConfidence } from '@/app/types'

export function calculateLeadScore(
  bantScores: BANTScore,
  meddicScores: MEDDICScore,
  confidenceScores: MetricConfidence[]
): number {
  const BANT_WEIGHT = 0.35
  const MEDDIC_WEIGHT = 0.65
  
  const bantAvg = Object.values(bantScores).reduce((a, b) => a + b, 0) / 4
  const meddicAvg = Object.values(meddicScores).reduce((a, b) => a + b, 0) / 6
  
  const avgConfidence = confidenceScores.reduce((sum, c) => sum + c.confidence, 0) / confidenceScores.length
  const confidenceFactor = Math.pow(avgConfidence, 0.5)
  
  const stageMultiplier = 1.2
  
  const leadScore = (BANT_WEIGHT * bantAvg + MEDDIC_WEIGHT * meddicAvg) * confidenceFactor * stageMultiplier
  
  return Math.round(leadScore)
}

export function identifyLowestConfidenceMetrics(
  confidenceScores: MetricConfidence[],
  count: number = 3
): MetricConfidence[] {
  return confidenceScores
    .sort((a, b) => a.confidence - b.confidence)
    .slice(0, count)
}

export function calculateAccuracy(
  aiScore: number,
  humanScore: number,
  threshold: number = 10
): boolean {
  return Math.abs(aiScore - humanScore) <= threshold
}

export function generateMockScores(): {
  bant: BANTScore
  meddic: MEDDICScore
  confidence: MetricConfidence[]
} {
  const bantMetrics = ['budget', 'authority', 'need', 'timeline']
  const meddicMetrics = ['metrics', 'economicBuyer', 'decisionCriteria', 'decisionProcess', 'identifyPain', 'champion']
  
  const bant: BANTScore = {
    budget: Math.floor(Math.random() * 100),
    authority: Math.floor(Math.random() * 100),
    need: Math.floor(Math.random() * 100),
    timeline: Math.floor(Math.random() * 100),
  }
  
  const meddic: MEDDICScore = {
    metrics: Math.floor(Math.random() * 100),
    economicBuyer: Math.floor(Math.random() * 100),
    decisionCriteria: Math.floor(Math.random() * 100),
    decisionProcess: Math.floor(Math.random() * 100),
    identifyPain: Math.floor(Math.random() * 100),
    champion: Math.floor(Math.random() * 100),
  }
  
  const confidence: MetricConfidence[] = [
    ...bantMetrics.map(metric => ({
      metric,
      score: bant[metric as keyof BANTScore],
      confidence: Math.random(),
      aiGenerated: true,
    })),
    ...meddicMetrics.map(metric => ({
      metric,
      score: meddic[metric as keyof MEDDICScore],
      confidence: Math.random(),
      aiGenerated: true,
    })),
  ]
  
  return { bant, meddic, confidence }
}