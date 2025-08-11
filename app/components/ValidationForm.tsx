'use client'

import { useState } from 'react'
import { MetricConfidence } from '@/app/types'
import MetricTooltip from './MetricTooltip'

interface ValidationFormProps {
  metrics: MetricConfidence[]
  onValidateAll: (validations: Array<{metric: string, score: number, reasoning?: string}>) => void
}

export default function ValidationForm({ metrics, onValidateAll }: ValidationFormProps) {
  const [scores, setScores] = useState<Record<string, number>>({})
  const [reasoning, setReasoning] = useState<Record<string, string>>({})

  const formatMetricName = (name: string) => {
    return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  }

  const handleScoreChange = (metric: string, score: number) => {
    setScores(prev => ({ ...prev, [metric]: score }))
  }

  const handleReasoningChange = (metric: string, value: string) => {
    setReasoning(prev => ({ ...prev, [metric]: value }))
  }

  const handleSubmit = () => {
    const validations = metrics.map(metric => ({
      metric: metric.metric,
      score: scores[metric.metric],
      reasoning: reasoning[metric.metric]
    }))
    
    onValidateAll(validations)
  }

  const allScoresEntered = metrics.every(metric => scores[metric.metric] !== undefined)
  const completedCount = Object.keys(scores).length

  return (
    <div className="console-panel">
      <div className="mb-6">
        <h2 className="section-header mb-4">
          HUMAN VALIDATION REQUIRED [{completedCount}/5]
        </h2>
        <div className="text-xs text-console-gray mb-4 p-3 border border-console-gray bg-console-dark bg-opacity-50 rounded">
          <span className="text-console-light font-medium">Review AI scores</span> for the 5 lowest confidence metrics to improve model accuracy
        </div>
        
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-console-gray mb-2">
            <span>Validation Progress</span>
            <span>{completedCount}/5 Complete</span>
          </div>
          <div className="w-full bg-console-dark border border-console-light h-2">
            <div 
              className="h-full bg-console-light transition-all duration-300"
              style={{ width: `${(completedCount / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* All Validation Items */}
      <div className="space-y-6 mb-6">
        {metrics.map((metric, index) => {
          const isCompleted = scores[metric.metric] !== undefined
          return (
            <div key={metric.metric} className="relative">
              {/* Item Number */}
              <div className="absolute -left-6 top-0 text-console-gray text-sm font-bold">
                {index + 1}.
              </div>
              
              <div className={`border-l-2 pl-4 pb-4 ${
                isCompleted ? 'border-console-light' : 'border-console-gray'
              }`}>
                {/* Header */}
                <div className="mb-3">
                  <h3 className="text-sm uppercase tracking-wider mb-1 text-console-light text-wrap-break">
                    <MetricTooltip metric={metric.metric}>
                      <span className="cursor-help">{formatMetricName(metric.metric)}</span>
                    </MetricTooltip>
                  </h3>
                  <div className="text-console-gray text-xs">
                    AI Score: {isCompleted ? `${metric.score}/10` : '--/10'} | Confidence: {(metric.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                
                {/* Score Selection */}
                <div className="mb-3">
                  <p className="text-xs text-console-gray mb-2">Your Assessment:</p>
                  <div className="grid grid-cols-11 gap-1 mb-2">
                    {Array.from({length: 11}, (_, i) => i).map((value) => (
                      <button
                        key={value}
                        onClick={() => handleScoreChange(metric.metric, value)}
                        className={`px-1 py-2 text-xs border transition-all duration-200 min-w-0 flex-shrink-0 ${
                          scores[metric.metric] === value
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
                
                {/* Optional Reasoning */}
                <div>
                  <input
                    type="text"
                    placeholder="Reasoning (optional)"
                    value={reasoning[metric.metric] || ''}
                    onChange={(e) => handleReasoningChange(metric.metric, e.target.value)}
                    className="console-input text-xs w-full"
                  />
                </div>
                
                {/* Completion Indicator */}
                {isCompleted && (
                  <div className="mt-2 text-xs text-console-light flex items-center gap-1">
                    <span>✓</span>
                    <span>Score: {scores[metric.metric]}/10</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Single Submit Button */}
      <div className="border-t border-console-gray pt-6">
        <div className="flex items-center justify-between">
          <div className="text-xs text-console-gray">
            {allScoresEntered 
              ? "All validations complete - ready to submit" 
              : `${5 - completedCount} validations remaining`
            }
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={!allScoresEntered}
            className={`console-button text-sm px-8 py-3 ${
              !allScoresEntered 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-console-light hover:text-console-dark'
            }`}
          >
            SUBMIT ALL VALIDATIONS
          </button>
        </div>
        
        {!allScoresEntered && (
          <div className="mt-2 text-xs text-console-gray">
            Please complete all {5 - completedCount} remaining validation(s) to submit
          </div>
        )}
      </div>
    </div>
  )
}