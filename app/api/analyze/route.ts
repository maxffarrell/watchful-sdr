import { NextRequest, NextResponse } from 'next/server'
import { analyzeTranscriptWithGemini } from '@/app/lib/gemini'
import { calculateLeadScore } from '@/app/lib/scoring'

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json()
    
    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      )
    }
    
    const analysis = await analyzeTranscriptWithGemini(transcript)
    const leadScore = calculateLeadScore(
      analysis.bantScores,
      analysis.meddicScores,
      analysis.confidenceScores
    )
    
    return NextResponse.json({
      ...analysis,
      leadScore,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze transcript' },
      { status: 500 }
    )
  }
}