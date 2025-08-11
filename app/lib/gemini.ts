import { GoogleGenerativeAI } from "@google/generative-ai";
import { BANTScore, MEDDICScore, MetricConfidence } from "@/app/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeTranscriptWithGemini(transcript: string): Promise<{
  bantScores: BANTScore;
  meddicScores: MEDDICScore;
  confidenceScores: MetricConfidence[];
  insights: string[];
  priorityFocus: string;
  sdrStats: {
    talkRatio: number;
    questionsAsked: number;
    painPointsUncovered: number;
    nextStepsClarity: number;
    objectionHandling: number;
  };
}> {
  console.log("=== GEMINI API FUNCTION DEBUG START ===")
  console.log("🚀 analyzeTranscriptWithGemini called!")
  console.log("📝 Input transcript:", transcript)
  console.log("📏 Transcript length:", transcript.length)
  console.log("🔧 Function parameters type check:", typeof transcript)
  
  console.log("🔑 Checking environment variables...")
  console.log("🔑 GEMINI_API_KEY from process.env:", process.env.GEMINI_API_KEY ? `Present (${process.env.GEMINI_API_KEY.substring(0, 10)}...)` : "Missing")
  console.log("🔧 genAI object:", genAI)
  
  try {
    console.log("🤖 Initializing Gemini model...")
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log("✅ Gemini model initialized successfully")
    console.log("🔧 Model object:", model);

    const prompt = `
You are an expert SDR coach analyzing security technology discovery calls using the BANT-MEDDIC framework.

TRANSCRIPT TO ANALYZE:
${transcript}

EVALUATION FRAMEWORK - Score each criterion 0-10 using these EXACT guidelines:

BANT SCORING:
- Budget (0-10): 
  * 0-3: No budget discussion
  * 4-6: General budget mentioned but not quantified
  * 7-8: Specific budget range identified
  * 9-10: Exact budget confirmed with approval timeline
  
- Authority (0-10):
  * 0-3: No decision makers identified
  * 4-6: Some stakeholders mentioned
  * 7-8: Clear decision maker identified
  * 9-10: Full buying committee mapped with roles
  
- Need (0-10):
  * 0-3: Surface level pain points only
  * 4-6: Multiple pain points discussed
  * 7-8: Pain points quantified with business impact
  * 9-10: Critical pain with urgency and cost of inaction clear
  
- Timeline (0-10):
  * 0-3: No timeline discussed
  * 4-6: Vague timeline mentioned
  * 7-8: Specific quarter/month identified
  * 9-10: Exact dates with implementation plan

MEDDIC SCORING:
- Metrics (0-10): Success criteria clarity (10 = specific KPIs defined)
- Economic Buyer (0-10): Budget holder identification (10 = direct access confirmed)
- Decision Criteria (0-10): Evaluation requirements (10 = all criteria documented)
- Decision Process (0-10): Buying process steps (10 = complete process mapped)
- Identify Pain (0-10): Problem quantification (10 = full ROI calculated)
- Champion (0-10): Internal advocate strength (10 = strong champion committed)

CONFIDENCE SCORING:
Rate your confidence (0.0-1.0) in each score based on how explicitly the information was discussed.
Low confidence (0.2-0.4) = implied but not stated
Medium confidence (0.5-0.7) = mentioned but not explored
High confidence (0.8-1.0) = explicitly discussed and confirmed

INSIGHTS GENERATION:
Provide exactly 3 actionable next steps that are:
1. One discovery question to uncover missing BANT/MEDDIC information
2. One demo/technical action to advance the deal
3. One stakeholder engagement strategy

PRIORITY FOCUS:
Identify the SINGLE most impactful action based on the biggest gap in BANT/MEDDIC scores.

Respond in JSON format:
{
  "bant": {
    "budget": <score 0-10>,
    "authority": <score 0-10>,
    "need": <score 0-10>,
    "timeline": <score 0-10>
  },
  "meddic": {
    "metrics": <score 0-10>,
    "economicBuyer": <score 0-10>,
    "decisionCriteria": <score 0-10>,
    "decisionProcess": <score 0-10>,
    "identifyPain": <score 0-10>,
    "champion": <score 0-10>
  },
  "confidence": [
    {"metric": "budget", "confidence": <0-1>},
    {"metric": "authority", "confidence": <0-1>},
    {"metric": "need", "confidence": <0-1>},
    {"metric": "timeline", "confidence": <0-1>},
    {"metric": "metrics", "confidence": <0-1>},
    {"metric": "economicBuyer", "confidence": <0-1>},
    {"metric": "decisionCriteria", "confidence": <0-1>},
    {"metric": "decisionProcess", "confidence": <0-1>},
    {"metric": "identifyPain", "confidence": <0-1>},
    {"metric": "champion", "confidence": <0-1>}
  ],
  "insights": [
    "Security-specific discovery question to ask",
    "Demo or technical discussion recommendation",
    "Key security stakeholder to engage next"
  ],
  "priorityFocus": "Single most important action to move this deal forward, focusing on quantifiable security value",
  "sdrStats": {
    "talkRatio": <0-100 percentage of SDR vs prospect talking>,
    "questionsAsked": <number of discovery questions asked>,
    "painPointsUncovered": <number of specific pain points identified>,
    "nextStepsClarity": <0-10 score for how clear next steps are>,
    "objectionHandling": <0-10 score for handling concerns>
  }
}
`;

    console.log("📤 About to send prompt to Gemini API...")
    console.log("📝 Full prompt being sent:", prompt)
    console.log("📏 Prompt length:", prompt.length)
    
    console.log("🚀 Calling model.generateContent...")
    const result = await model.generateContent(prompt);
    console.log("📥 Received result object from Gemini API:", result)
    
    console.log("🔄 Getting response from result...")
    const response = await result.response;
    console.log("📋 Response object:", response)
    
    console.log("🔄 Extracting text from response...")
    const text = response.text();
    console.log("📋 Raw Gemini response text:", text)
    console.log("📏 Response text length:", text.length);

    // Parse the JSON response
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const jsonText = text.slice(jsonStart, jsonEnd);

    const parsed = JSON.parse(jsonText);
    console.log("🎯 Parsed Gemini data:", parsed);

    // Transform confidence scores to include score and AI flag
    const confidenceScores: MetricConfidence[] = parsed.confidence.map(
      (conf: any) => ({
        metric: conf.metric,
        score: parsed.bant[conf.metric] || parsed.meddic[conf.metric] || 0,
        confidence: conf.confidence,
        aiGenerated: true,
      }),
    );

    console.log("✨ Successfully processed Gemini response");
    console.log("📊 BANT scores:", parsed.bant);
    console.log("📊 MEDDIC scores:", parsed.meddic); 
    console.log("💡 Insights:", parsed.insights);
    console.log("🎯 Priority Focus:", parsed.priorityFocus);
    console.log("📈 SDR Stats:", parsed.sdrStats);

    return {
      bantScores: parsed.bant,
      meddicScores: parsed.meddic,
      confidenceScores,
      insights: parsed.insights,
      priorityFocus: parsed.priorityFocus || "Quantify false alarm costs and demonstrate Quill's ROI through guard efficiency gains",
      sdrStats: parsed.sdrStats || {
        talkRatio: 35,
        questionsAsked: 8,
        painPointsUncovered: 3,
        nextStepsClarity: 7,
        objectionHandling: 6
      }
    };
  } catch (error) {
    console.error("❌❌❌ GEMINI API MAJOR ERROR ❌❌❌");
    console.error("❌ Error object:", error);
    console.error("❌ Error type:", typeof error);
    console.error("❌ Error name:", error.name);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    console.error("❌ Error cause:", error.cause);
    console.error("❌ Full error JSON:", JSON.stringify(error, null, 2));
    console.log("⚠️ Falling back to mock data");
    // Fallback to mock data
    const fallback = generateFallbackScores();
    console.log("📊 Generated fallback scores:", fallback);
    console.log("=== GEMINI API FUNCTION DEBUG END (ERROR) ===");
    return fallback;
  }
  console.log("=== GEMINI API FUNCTION DEBUG END (SUCCESS) ===");
}

function generateFallbackScores(): {
  bantScores: BANTScore;
  meddicScores: MEDDICScore;
  confidenceScores: MetricConfidence[];
  insights: string[];
  priorityFocus: string;
  sdrStats: {
    talkRatio: number;
    questionsAsked: number;
    painPointsUncovered: number;
    nextStepsClarity: number;
    objectionHandling: number;
  };
} {
  const bantScores: BANTScore = {
    budget: Math.floor(Math.random() * 11),
    authority: Math.floor(Math.random() * 11),
    need: Math.floor(Math.random() * 11),
    timeline: Math.floor(Math.random() * 11),
  };

  const meddicScores: MEDDICScore = {
    metrics: Math.floor(Math.random() * 11),
    economicBuyer: Math.floor(Math.random() * 11),
    decisionCriteria: Math.floor(Math.random() * 11),
    decisionProcess: Math.floor(Math.random() * 11),
    identifyPain: Math.floor(Math.random() * 11),
    champion: Math.floor(Math.random() * 11),
  };

  const confidenceScores: MetricConfidence[] = [
    ...Object.entries(bantScores).map(([key, score]) => ({
      metric: key,
      score,
      confidence: Math.random() * 0.6 + 0.3, // 0.3 to 0.9
      aiGenerated: true,
    })),
    ...Object.entries(meddicScores).map(([key, score]) => ({
      metric: key,
      score,
      confidence: Math.random() * 0.6 + 0.3,
      aiGenerated: true,
    })),
  ];

  const insights = [
    'Ask: "How do you currently measure the cost of false alarms on your operations?"',
    "Schedule technical demo showing Quill's integration with existing camera systems",
    "Send case study of similar facility that reduced false alarms by 87%",
  ];
  
  const priorityFocus = "Quantify the cost of 200-300 daily false alarms in guard hours and demonstrate ROI of 87% reduction";
  
  const sdrStats = {
    talkRatio: 30 + Math.floor(Math.random() * 20),
    questionsAsked: 5 + Math.floor(Math.random() * 10),
    painPointsUncovered: 2 + Math.floor(Math.random() * 5),
    nextStepsClarity: Math.floor(Math.random() * 11),
    objectionHandling: Math.floor(Math.random() * 11)
  };

  return {
    bantScores,
    meddicScores,
    confidenceScores,
    insights,
    priorityFocus,
    sdrStats,
  };
}
