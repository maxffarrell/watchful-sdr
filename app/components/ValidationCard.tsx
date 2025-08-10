'use client'

import { useState } from 'react'
import { MetricConfidence } from '@/app/types'

interface ValidationCardProps {
  metric: MetricConfidence
  onValidate: (score: number, reasoning?: string) => void
}

export default function ValidationCard({ metric, onValidate }: ValidationCardProps) {
  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [reasoning, setReasoning] = useState('')

  const handleSubmit = () => {
    if (selectedScore !== null) {
      onValidate(selectedScore, reasoning)
      setReasoning('')
    }
  }

  const formatMetricName = (name: string) => {
    return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  }

  return (
    <div className="console-panel mb-4">
      <div className="mb-4">
        <h3 className="text-sm uppercase tracking-wider mb-1 text-console-light">
          VALIDATE: {formatMetricName(metric.metric)}
        </h3>
        <div className="text-console-gray text-xs mb-3">
          AI Score: {metric.score}/10 | Confidence: {(metric.confidence * 100).toFixed(0)}%
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-xs text-console-gray mb-3">Your Assessment (Required):</p>
        <div className="grid grid-cols-11 gap-1 mb-2">
          {Array.from({length: 11}, (_, i) => i).map((value) => (
            <button
              key={value}
              onClick={() => setSelectedScore(value)}
              className={`px-2 py-2 text-xs border transition-all duration-200 ${
                selectedScore === value
                  ? 'bg-console-light text-console-dark border-console-light shadow-md'
                  : 'border-console-gray text-console-gray hover:border-console-light hover:text-console-light hover:bg-console-light hover:bg-opacity-10'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-console-gray">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Reasoning (optional)"
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          className="console-input text-xs"
        />
      </div>
      
      <div className="flex justify-end">
        <button 
          onClick={handleSubmit} 
          disabled={selectedScore === null}
          className={`console-button text-xs ${
            selectedScore === null 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-console-light hover:text-console-dark'
          }`}
        >
          SUBMIT VALIDATION
        </button>
      </div>
    </div>
  )
}