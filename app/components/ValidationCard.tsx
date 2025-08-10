'use client'

import { useState } from 'react'
import { MetricConfidence } from '@/app/types'

interface ValidationCardProps {
  metric: MetricConfidence
  onValidate: (score: number, reasoning?: string) => void
  onSkip: () => void
}

export default function ValidationCard({ metric, onValidate, onSkip }: ValidationCardProps) {
  const [selectedScore, setSelectedScore] = useState<number>(metric.score)
  const [reasoning, setReasoning] = useState('')

  const handleSubmit = () => {
    onValidate(selectedScore, reasoning)
    setReasoning('')
  }

  return (
    <div className="console-panel mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm uppercase tracking-wider mb-1">{metric.metric}</h3>
          <div className="text-console-gray text-xs">
            AI Score: {metric.score}/100 | Confidence: {metric.confidence}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="console-button text-xs">
            VALIDATE
          </button>
          <button onClick={onSkip} className="console-button text-xs">
            SKIP
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex gap-1 mb-2">
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => (
            <button
              key={value}
              onClick={() => setSelectedScore(value)}
              className={`px-2 py-1 text-xs border ${
                selectedScore === value
                  ? 'bg-console-white text-console-black'
                  : 'border-console-gray text-console-gray hover:border-console-white hover:text-console-white'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <input
          type="text"
          placeholder="Reasoning (optional)"
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          className="console-input text-xs"
        />
      </div>
    </div>
  )
}