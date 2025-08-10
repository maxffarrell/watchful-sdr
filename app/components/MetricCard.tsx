'use client'

interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  showProgress?: boolean
  progress?: number
}

export default function MetricCard({ title, value, unit, showProgress, progress }: MetricCardProps) {
  return (
    <div className="metric-box">
      <div className="text-console-gray text-xs uppercase tracking-wider mb-2">{title}</div>
      <div className="text-2xl font-medium">
        {value}
        {unit && <span className="text-sm text-console-gray ml-1">{unit}</span>}
      </div>
      {showProgress && progress !== undefined && (
        <div className="mt-2">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}