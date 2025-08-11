import { NextRequest, NextResponse } from 'next/server'
import { calculateAccuracy } from '@/app/lib/scoring'

export async function POST(request: NextRequest) {
  try {
    const { metricName, aiScore, humanScore, reasoning } = await request.json()
    
    if (!metricName || aiScore === undefined || humanScore === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const isAccurate = calculateAccuracy(aiScore, humanScore)
    const points = isAccurate ? 10 : 5
    
    const feedbackData = {
      metricName,
      aiScore,
      humanScore,
      reasoning,
      isAccurate,
      pointsAwarded: points,
      timestamp: new Date().toISOString(),
    }
    
    return NextResponse.json({
      success: true,
      feedback: feedbackData,
      message: isAccurate 
        ? 'Great job! Your assessment aligns with the AI.'
        : 'Thank you for the correction. This helps improve our model.',
    })
  } catch (error) {
    const err = error as Error
    console.error('Validation error:', err)
    return NextResponse.json(
      { error: 'Failed to process validation' },
      { status: 500 }
    )
  }
}