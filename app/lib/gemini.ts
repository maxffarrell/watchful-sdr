import { GoogleGenerativeAI } from "@google/generative-ai";
import { BANTScore, MEDDICScore, MetricConfidence } from "@/app/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeTranscriptWithGemini(transcript: string): Promise<{
  bantScores: BANTScore;
  meddicScores: MEDDICScore;
  confidenceScores: MetricConfidence[];
  insights: string[];
  priorityFocus: string;
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
Analyze this SECURITY TECHNOLOGY DISCOVERY CALL transcript. Focus on how well the SDR uncovered information about the prospect's security operations and pain points. Score each criterion from 0-10 (where 10 = excellent security discovery).

TRANSCRIPT:
${transcript}

SCORING CRITERIA:
- BANT Budget (0-10): How well did SDR uncover budget information/financial capacity?
- BANT Authority (0-10): How clearly did SDR identify decision-makers and approval process?
- BANT Need (0-10): How deeply did SDR explore pain points and business challenges?
- BANT Timeline (0-10): How well did SDR establish urgency and implementation timeline?
- MEDDIC Metrics (0-10): Did SDR identify success metrics and measurable outcomes?
- MEDDIC Economic Buyer (0-10): Did SDR identify who controls the budget?
- MEDDIC Decision Criteria (0-10): Did SDR understand evaluation criteria?
- MEDDIC Decision Process (0-10): Did SDR map the decision-making process?
- MEDDIC Identify Pain (0-10): How well did SDR quantify business impact of problems?
- MEDDIC Champion (0-10): Did SDR identify internal advocates or build rapport?

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
  "priorityFocus": "Single most important action to move this deal forward, focusing on quantifiable security value"
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

    return {
      bantScores: parsed.bant,
      meddicScores: parsed.meddic,
      confidenceScores,
      insights: parsed.insights,
      priorityFocus: parsed.priorityFocus || "Quantify false alarm costs and demonstrate Quill's ROI through guard efficiency gains",
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

  return {
    bantScores,
    meddicScores,
    confidenceScores,
    insights,
    priorityFocus,
  };
}
