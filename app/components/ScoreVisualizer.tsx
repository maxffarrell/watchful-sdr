'use client'

import { BANTScore, MEDDICScore } from '@/app/types'
import MetricTooltip from './MetricTooltip'

interface ScoreVisualizerProps {
  bantScores: BANTScore
  meddicScores: MEDDICScore
  overallScore: number
  validationQueue?: string[] // Array of metric names being validated
}

export default function ScoreVisualizer({ bantScores, meddicScores, overallScore, validationQueue = [] }: ScoreVisualizerProps) {
  return (
    <div className="console-panel">
      <div className="mb-6">
        <h2 className="text-sm uppercase tracking-wider mb-4 border-b border-console-light pb-2 text-console-light">
          LEAD SCORE ANALYSIS
        </h2>
        <div className="text-4xl font-medium text-center py-4">
          {overallScore}
          <span className="text-sm text-console-gray ml-2">/ 100</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs uppercase text-console-gray mb-3">BANT METRICS</h3>
          <div className="space-y-2">
            {Object.entries(bantScores).map(([key, value]) => {
              const isBeingValidated = validationQueue.includes(key)
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1">
                    <MetricTooltip metric={key}>
                      <span className="capitalize cursor-help">{key}</span>
                    </MetricTooltip>
                    <span>{isBeingValidated ? '--' : `${value}/10`}</span>
                  </div>
                  <div className="progress-bar h-1">
                    <div 
                      className="progress-fill" 
                      style={{ width: isBeingValidated ? '0%' : `${(value / 10) * 100}%` }} 
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase text-console-gray mb-3">MEDDIC METRICS</h3>
          <div className="space-y-2">
            {Object.entries(meddicScores).map(([key, value]) => {
              const isBeingValidated = validationQueue.includes(key)
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1">
                    <MetricTooltip metric={key}>
                      <span className="capitalize text-xs cursor-help">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </MetricTooltip>
                    <span>{isBeingValidated ? '--' : `${value}/10`}</span>
                  </div>
                  <div className="progress-bar h-1">
                    <div 
                      className="progress-fill" 
                      style={{ width: isBeingValidated ? '0%' : `${(value / 10) * 100}%` }} 
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}