import { BANTScore, MEDDICScore, MetricConfidence } from '@/app/types'

export function calculateLeadScore(
  bantScores: BANTScore,
  meddicScores: MEDDICScore,
  confidenceScores: MetricConfidence[]
): number {
  const BANT_WEIGHT = 0.35
  const MEDDIC_WEIGHT = 0.65
  
  // Convert 0-10 scores to percentages for calculation
  const bantAvg = Object.values(bantScores).reduce((a, b) => a + b, 0) / 4 * 10
  const meddicAvg = Object.values(meddicScores).reduce((a, b) => a + b, 0) / 6 * 10
  
  const avgConfidence = confidenceScores.reduce((sum, c) => sum + c.confidence, 0) / confidenceScores.length
  const confidenceFactor = Math.pow(avgConfidence, 0.5)
  
  const stageMultiplier = 1.0
  
  const leadScore = (BANT_WEIGHT * bantAvg + MEDDIC_WEIGHT * meddicAvg) * confidenceFactor * stageMultiplier
  
  return Math.round(Math.min(100, leadScore))
}

export function identifyLowestConfidenceMetrics(
  confidenceScores: MetricConfidence[],
  count: number = 5
): MetricConfidence[] {
  const sorted = confidenceScores.sort((a, b) => a.confidence - b.confidence)
  
  // Ensure we always have exactly the requested count
  if (sorted.length >= count) {
    return sorted.slice(0, count)
  }
  
  // If we have fewer items than requested, return all available
  return sorted
}

export function calculateAccuracy(
  aiScore: number,
  humanScore: number,
  threshold: number = 2
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
    budget: Math.floor(Math.random() * 11), // 0-10
    authority: Math.floor(Math.random() * 11),
    need: Math.floor(Math.random() * 11),
    timeline: Math.floor(Math.random() * 11),
  }
  
  const meddic: MEDDICScore = {
    metrics: Math.floor(Math.random() * 11), // 0-10
    economicBuyer: Math.floor(Math.random() * 11),
    decisionCriteria: Math.floor(Math.random() * 11),
    decisionProcess: Math.floor(Math.random() * 11),
    identifyPain: Math.floor(Math.random() * 11),
    champion: Math.floor(Math.random() * 11),
  }
  
  const confidence: MetricConfidence[] = [
    ...bantMetrics.map(metric => {
      const score = bant[metric as keyof BANTScore]
      // Generate confidence based on score clarity, not score value
      // Low scores (0-3) can have high confidence if clearly absent
      // High scores (7-10) can have low confidence if ambiguous
      let confidenceRange = Math.random() * 0.6 + 0.2 // 0.2 to 0.8 base range
      
      // Extreme scores (0-2 or 8-10) might have higher confidence due to clarity
      if (score <= 2 || score >= 8) {
        confidenceRange = Math.random() * 0.3 + 0.5 // 0.5 to 0.8 for extreme scores
      }
      
      return {
        metric,
        score,
        confidence: confidenceRange,
        aiGenerated: true,
      }
    }),
    ...meddicMetrics.map(metric => {
      const score = meddic[metric as keyof MEDDICScore]
      let confidenceRange = Math.random() * 0.6 + 0.2
      
      if (score <= 2 || score >= 8) {
        confidenceRange = Math.random() * 0.3 + 0.5
      }
      
      return {
        metric,
        score,
        confidence: confidenceRange,
        aiGenerated: true,
      }
    }),
  ]
  
  return { bant, meddic, confidence }
}