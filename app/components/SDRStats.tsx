'use client'

interface SDRStatsProps {
  talkRatio: number
  questionsAsked: number
  painPointsUncovered: number
  nextStepsClarity: number
  objectionHandling: number
  callsAnalyzed: number
  weeklyGoal: number
  teamLeaderboard: Array<{
    name: string
    calls: number
    points: number
    rank: number
    isCurrentUser: boolean
  }>
}

export default function SDRStats({ 
  talkRatio, 
  questionsAsked, 
  painPointsUncovered, 
  nextStepsClarity, 
  objectionHandling,
  callsAnalyzed,
  weeklyGoal,
  teamLeaderboard
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
    <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left - SDR Performance Metrics */}
      <div className="console-panel">
        <h2 className="section-header mb-4">
          CALL ANALYSIS METRICS
        </h2>
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {/* Talk Ratio */}
          <div className="text-center">
            <div className={`text-2xl font-bold ${getTalkRatioColor(talkRatio)}`}>
              {talkRatio}%
            </div>
            <div className="text-xs text-console-gray uppercase">Talk Ratio</div>
          </div>

          {/* Questions Asked */}
          <div className="text-center">
            <div className="text-2xl font-bold text-console-light">
              {questionsAsked}
            </div>
            <div className="text-xs text-console-gray uppercase">Questions</div>
          </div>

          {/* Pain Points */}
          <div className="text-center">
            <div className={`text-2xl font-bold ${painPointsUncovered >= 3 ? 'text-console-light' : 'text-console-gray'}`}>
              {painPointsUncovered}
            </div>
            <div className="text-xs text-console-gray uppercase">Pain Points</div>
          </div>

          {/* Weekly Progress */}
          <div className="text-center">
            <div className="text-2xl font-bold text-console-light">
              {Math.round((callsAnalyzed / weeklyGoal) * 100)}%
            </div>
            <div className="text-xs text-console-gray uppercase">Week Goal</div>
          </div>
        </div>

        {/* Score Bars */}
        <div className="space-y-3 pt-3 border-t border-console-gray">
          {/* Next Steps Clarity */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs uppercase text-console-gray">Next Steps Clarity</span>
              <span className={`text-xs font-bold ${getScoreColor(nextStepsClarity)}`}>
                {nextStepsClarity}/10
              </span>
            </div>
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 border border-console-light ${
                    i < nextStepsClarity ? 'bg-console-light' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Objection Handling */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs uppercase text-console-gray">Objection Handling</span>
              <span className={`text-xs font-bold ${getScoreColor(objectionHandling)}`}>
                {objectionHandling}/10
              </span>
            </div>
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 border border-console-light ${
                    i < objectionHandling ? 'bg-console-light' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right - Team Leaderboard */}
      <div className="console-panel">
        <h2 className="section-header mb-4">
          TEAM LEADERBOARD
        </h2>
        
        <div className="space-y-2">
          {teamLeaderboard.slice(0, 5).map((person) => (
            <div 
              key={person.name}
              className={`flex items-center justify-between p-2 rounded transition-all ${
                person.isCurrentUser 
                  ? 'bg-console-light bg-opacity-10 border border-console-light' 
                  : 'hover:bg-console-dark hover:bg-opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold w-6 ${
                  person.isCurrentUser ? 'text-console-light' : 'text-console-gray'
                }`}>
                  #{person.rank}
                </span>
                <span className={`text-sm text-truncate ${
                  person.isCurrentUser ? 'text-console-light font-medium' : 'text-console-gray'
                }`}>
                  {person.name}
                  {person.isCurrentUser && <span className="ml-1 text-xs">(You)</span>}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-console-gray">{person.calls} calls</span>
                <span className={`font-medium ${
                  person.isCurrentUser ? 'text-console-light' : 'text-console-gray'
                }`}>
                  {person.points}pts
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Current User Stats if not in top 5 */}
        {!teamLeaderboard.slice(0, 5).find(p => p.isCurrentUser) && (
          <div className="mt-3 pt-3 border-t border-console-gray">
            {teamLeaderboard.find(p => p.isCurrentUser) && (
              <div className="flex items-center justify-between p-2 bg-console-light bg-opacity-10 border border-console-light rounded">
                <span className="text-sm text-console-light">
                  Your Rank: #{teamLeaderboard.find(p => p.isCurrentUser)?.rank}
                </span>
                <span className="text-sm text-console-light font-medium">
                  {teamLeaderboard.find(p => p.isCurrentUser)?.points}pts
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}