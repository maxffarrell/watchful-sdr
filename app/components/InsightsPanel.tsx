'use client'

interface InsightsPanelProps {
  insights: string[]
  revenueImpact?: number
  priorityFocus?: string
}

export default function InsightsPanel({ insights, revenueImpact, priorityFocus }: InsightsPanelProps) {
  return (
    <div className="console-panel">
      <h2 className="text-sm uppercase tracking-wider mb-4 border-b border-console-light pb-2 text-console-light">
        SECURITY DISCOVERY NEXT STEPS
      </h2>
      
      {revenueImpact && (
        <div className="mb-4 text-lg">
          Potential Impact: <span className="text-console-light">+${(revenueImpact / 1000).toFixed(0)}K</span>
        </div>
      )}
      
      <div className="space-y-3">
        <div>
          <h3 className="text-xs uppercase text-console-gray mb-2">RECOMMENDED ACTIONS:</h3>
          <ul className="space-y-3">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-console-light mr-3 text-lg flex-shrink-0">→</span>
                <span className="text-sm text-wrap-break">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-4 pt-4 border-t border-console-gray">
          <h3 className="text-xs uppercase text-console-gray mb-2">PRIORITY FOCUS:</h3>
          <p className="text-sm text-wrap-break">{priorityFocus || "Quantify false alarm costs and demonstrate Watchful's ROI through guard efficiency gains"}</p>
        </div>
      </div>
    </div>
  )
}