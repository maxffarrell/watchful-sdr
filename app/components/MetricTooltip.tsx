'use client'

import { useState } from 'react'

interface MetricTooltipProps {
  metric: string
  children: React.ReactNode
}

const metricDefinitions: Record<string, string> = {
  budget: "Financial capacity and allocated funds for security technology solutions",
  authority: "Decision-making power and approval process for security purchases",
  need: "Urgency and severity of current security challenges and pain points",
  timeline: "Implementation timeline and urgency for security solution deployment",
  metrics: "Success criteria and measurable outcomes for security improvements",
  economicBuyer: "Budget holder with final purchasing authority for security investments",
  decisionCriteria: "Evaluation criteria and requirements for security technology selection",
  decisionProcess: "Steps and stakeholders involved in security purchasing decisions",
  identifyPain: "Quantified business impact and cost of current security inefficiencies",
  champion: "Internal advocate who supports and promotes the security solution"
}

export default function MetricTooltip({ metric, children }: MetricTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId)
    const id = setTimeout(() => setIsVisible(true), 500) // 0.5s delay
    setTimeoutId(id)
  }

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId)
    setIsVisible(false)
  }

  const definition = metricDefinitions[metric]

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && definition && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-console-darker border border-console-light rounded text-xs text-console-light max-w-64 text-center animate-in fade-in duration-200">
          {definition}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-console-darker border-r border-b border-console-light rotate-45 -mt-1"></div>
        </div>
      )}
    </div>
  )
}