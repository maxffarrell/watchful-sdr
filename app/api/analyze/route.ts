import { NextRequest, NextResponse } from 'next/server'
import { analyzeTranscriptWithGemini } from '@/app/lib/gemini'
import { calculateLeadScore } from '@/app/lib/scoring'

export async function POST(request: NextRequest) {
  console.log("🌐 API ROUTE /api/analyze called!")
  
  try {
    const body = await request.json()
    console.log("📥 API received body:", body)
    const { transcript } = body
    console.log("📝 API extracted transcript length:", transcript?.length)
    
    if (!transcript) {
      console.log("❌ API: No transcript provided")
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      )
    }
    
    console.log("🤖 API: Calling analyzeTranscriptWithGemini...")
    const analysis = await analyzeTranscriptWithGemini(transcript)
    console.log("✅ API: Received analysis from Gemini:", analysis)
    const leadScore = calculateLeadScore(
      analysis.bantScores,
      analysis.meddicScores,
      analysis.confidenceScores
    )
    
    console.log("✅ API: Sending response back to client")
    return NextResponse.json({
      ...analysis,
      leadScore,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ API Analysis error:', error)
    console.error('❌ API Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Failed to analyze transcript' },
      { status: 500 }
    )
  }
}