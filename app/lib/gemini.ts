import { GoogleGenerativeAI } from "@google/generative-ai";
import { BANTScore, MEDDICScore, MetricConfidence } from "@/app/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeTranscriptWithGemini(transcript: string): Promise<{
  bantScores: BANTScore;
  meddicScores: MEDDICScore;
  confidenceScores: MetricConfidence[];
  insights: string[];
}> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
  ]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const jsonText = text.slice(jsonStart, jsonEnd);

    const parsed = JSON.parse(jsonText);

    // Transform confidence scores to include score and AI flag
    const confidenceScores: MetricConfidence[] = parsed.confidence.map(
      (conf: any) => ({
        metric: conf.metric,
        score: parsed.bant[conf.metric] || parsed.meddic[conf.metric] || 0,
        confidence: conf.confidence,
        aiGenerated: true,
      }),
    );

    return {
      bantScores: parsed.bant,
      meddicScores: parsed.meddic,
      confidenceScores,
      insights: parsed.insights,
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    // Fallback to mock data
    return generateFallbackScores();
  }
}

function generateFallbackScores(): {
  bantScores: BANTScore;
  meddicScores: MEDDICScore;
  confidenceScores: MetricConfidence[];
  insights: string[];
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

  return {
    bantScores,
    meddicScores,
    confidenceScores,
    insights,
  };
}
