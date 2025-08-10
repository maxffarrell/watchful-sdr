'use client'

interface GamificationBarProps {
  points: number
  rank: number
  streak: number
  accuracy: number
  level: 'bronze' | 'silver' | 'gold' | 'platinum'
}

export default function GamificationBar({ points, rank, streak, accuracy, level }: GamificationBarProps) {
  const levelColors = {
    bronze: 'text-orange-500',
    silver: 'text-gray-400',
    gold: 'text-yellow-500',
    platinum: 'text-purple-400',
  }

  const nextLevelPoints = {
    bronze: 500,
    silver: 1000,
    gold: 2000,
    platinum: 5000,
  }

  const progress = (points / nextLevelPoints[level]) * 100

  return (
    <div className="console-panel">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs uppercase text-console-gray">Points</span>
            <div className="text-xl font-medium">{points}</div>
          </div>
          <div>
            <span className="text-xs uppercase text-console-gray">Rank</span>
            <div className="text-xl font-medium">#{rank}</div>
          </div>
          <div>
            <span className="text-xs uppercase text-console-gray">Streak</span>
            <div className="text-xl font-medium">{streak}</div>
          </div>
          <div>
            <span className="text-xs uppercase text-console-gray">Accuracy</span>
            <div className="text-xl font-medium">{accuracy}%</div>
          </div>
        </div>
        <div className={`text-2xl uppercase ${levelColors[level]}`}>
          {level}
        </div>
      </div>
      
      <div>
        <div className="flex justify-between text-xs text-console-gray mb-1">
          <span>Progress to next level</span>
          <span>{points} / {nextLevelPoints[level]}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.min(100, progress)}%` }} />
        </div>
      </div>
    </div>
  )
}