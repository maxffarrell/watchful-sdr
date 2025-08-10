# WATCHFUL // SDR Intelligence Platform

AI-powered call analysis and revenue optimization platform for Sales Development Representatives.

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

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Usage

1. Click "NEW TRANSCRIPT" to upload a call transcript
2. Review AI-generated BANT & MEDDIC scores
3. Validate low-confidence metrics when prompted
4. View actionable insights and revenue impact
5. Track progress through gamification features

## Scoring Formula

```
Lead Score = (0.35 × BANT_Avg + 0.65 × MEDDIC_Avg) × Confidence_Factor × Stage_Multiplier
```

## Architecture

- **Frontend**: Interactive dashboard with real-time updates
- **Scoring Engine**: AI-powered analysis with confidence ratings
- **Feedback Loop**: Continuous learning from SDR validations
- **Gamification**: Achievement system tied to revenue outcomes