'use client'

interface SDRStatsProps {
  talkRatio: number
  questionsAsked: number
  painPointsUncovered: number
  nextStepsClarity: number
  objectionHandling: number
  callsAnalyzed: number
  weeklyGoal: number
}

export default function SDRStats({ 
  talkRatio, 
  questionsAsked, 
  painPointsUncovered, 
  nextStepsClarity, 
  objectionHandling,
  callsAnalyzed,
  weeklyGoal
}: SDRStatsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-console-light'
    if (score >= 5) return 'text-console-gray'
    return 'text-red-400'
  }

  const getTalkRatioColor = (ratio: number) => {
    if (ratio >= 30 && ratio <= 40) return 'text-console-light'
    if (ratio >= 25 && ratio <= 50) return 'text-console-gray'
    return 'text-red-400'
  }

  return (
    <div className="console-panel mb-6">
      <h2 className="text-sm uppercase tracking-wider mb-4 border-b border-console-light pb-2 text-console-light">
        SDR PERFORMANCE METRICS
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Talk Ratio */}
        <div className="text-center">
          <div className={`text-2xl font-bold ${getTalkRatioColor(talkRatio)}`}>
            {talkRatio}%
          </div>
          <div className="text-xs text-console-gray uppercase mt-1">Talk Ratio</div>
          <div className="text-xs text-console-gray mt-1">Target: 30-40%</div>
        </div>

        {/* Questions Asked */}
        <div className="text-center">
          <div className="text-2xl font-bold text-console-light">
            {questionsAsked}
          </div>
          <div className="text-xs text-console-gray uppercase mt-1">Questions</div>
          <div className="text-xs text-console-gray mt-1">Discovery Qs</div>
        </div>

        {/* Pain Points */}
        <div className="text-center">
          <div className={`text-2xl font-bold ${painPointsUncovered >= 3 ? 'text-console-light' : 'text-console-gray'}`}>
            {painPointsUncovered}
          </div>
          <div className="text-xs text-console-gray uppercase mt-1">Pain Points</div>
          <div className="text-xs text-console-gray mt-1">Uncovered</div>
        </div>

        {/* Weekly Progress */}
        <div className="text-center">
          <div className="text-2xl font-bold text-console-light">
            {callsAnalyzed}/{weeklyGoal}
          </div>
          <div className="text-xs text-console-gray uppercase mt-1">Weekly Calls</div>
          <div className="text-xs text-console-gray mt-1">
            {Math.round((callsAnalyzed / weeklyGoal) * 100)}% Complete
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-console-gray">
        {/* Next Steps Clarity */}
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase text-console-gray">Next Steps Clarity</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-4 border border-console-light ${
                    i < nextStepsClarity ? 'bg-console-light' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
            <span className={`text-sm font-bold ${getScoreColor(nextStepsClarity)}`}>
              {nextStepsClarity}/10
            </span>
          </div>
        </div>

        {/* Objection Handling */}
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase text-console-gray">Objection Handling</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-4 border border-console-light ${
                    i < objectionHandling ? 'bg-console-light' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
            <span className={`text-sm font-bold ${getScoreColor(objectionHandling)}`}>
              {objectionHandling}/10
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}