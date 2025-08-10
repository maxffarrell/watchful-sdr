'use client'

interface InsightsPanelProps {
  insights: string[]
  revenueImpact?: number
}

export default function InsightsPanel({ insights, revenueImpact }: InsightsPanelProps) {
  return (
    <div className="console-panel">
      <h2 className="text-sm uppercase tracking-wider mb-4 border-b border-console-white pb-2">
        REVENUE OPTIMIZATION INSIGHTS
      </h2>
      
      {revenueImpact && (
        <div className="mb-4 text-lg">
          Potential Impact: <span className="text-console-white">+${(revenueImpact / 1000).toFixed(0)}K</span>
        </div>
      )}
      
      <div className="space-y-3">
        <div>
          <h3 className="text-xs uppercase text-console-gray mb-2">PRIORITY ACTIONS:</h3>
          <ul className="space-y-2">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-console-gray mr-2">•</span>
                <span className="text-sm">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-4 pt-4 border-t border-console-gray">
          <h3 className="text-xs uppercase text-console-gray mb-2">NEXT BEST ACTION:</h3>
          <p className="text-sm">Book demo with decision maker</p>
        </div>
      </div>
    </div>
  )
}