# QUILL // SDR Intelligence Platform

AI-powered security sales call analysis and discovery optimization platform for SDRs selling Quill's security intelligence solutions.

## Features

- **BANT & MEDDIC Scoring**: Automatic analysis of call transcripts with confidence ratings
- **Human-in-the-Loop Feedback**: SDRs validate low-confidence scores to improve AI accuracy
- **Gamification**: Points, streaks, and leaderboards to drive engagement
- **Revenue Optimization**: Actionable insights with revenue impact estimates
- **Monochrome Console UI**: Clean, focused interface inspired by technical consoles

## Tech Stack

- Next.js 14 with TypeScript
- Tailwind CSS for styling
- AI-powered transcript analysis
- Real-time validation system

## Getting Started

### Prerequisites
- Node.js 18+
- Google Gemini API Key (get from https://aistudio.google.com/app/apikey)

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Gemini API key

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3002](http://localhost:3002) with your browser to see the application.

## Usage

1. Click "NEW TRANSCRIPT" to upload a security sales call transcript
2. Review AI-generated BANT & MEDDIC scores for security discovery (0-10 scale)
3. Complete required validations for low-confidence security metrics
4. View security-focused actionable insights and ROI estimates
5. Compete with team members through leaderboard rankings

### Key Features
- **Security-Focused Analysis**: Specialized for security technology sales calls
- **Required Validations**: System identifies 3 lowest confidence scores for human validation
- **0-10 Scoring**: All metrics use intuitive 0-10 scale optimized for security discovery
- **Gemini Integration**: Real AI analysis using Google's Gemini API with security-specific prompts
- **Competitive Gamification**: Team leaderboard with live rankings and activity tracking
- **Geist Mono Typography**: Clean, professional monospace font from Google Fonts

## Scoring Formula

```
Lead Score = (0.35 × BANT_Avg + 0.65 × MEDDIC_Avg) × Confidence_Factor × Stage_Multiplier
```

## Architecture

- **Frontend**: Interactive dashboard with real-time updates
- **Scoring Engine**: AI-powered analysis with confidence ratings
- **Feedback Loop**: Continuous learning from SDR validations
- **Gamification**: Achievement system tied to revenue outcomes