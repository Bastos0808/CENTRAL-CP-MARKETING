
import { cn } from "@/lib/utils";

interface ScoreIndicatorProps {
  score: number;
}

export function ScoreIndicator({ score }: ScoreIndicatorProps) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  const circumference = 2 * Math.PI * 45; // 2 * pi * radius
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  const getScoreColor = (value: number) => {
    if (value < 40) return 'text-red-500';
    if (value < 75) return 'text-yellow-500';
    return 'text-green-500';
  };
  
  const getTrackColor = (value: number) => {
    if (value < 40) return 'stroke-red-500';
    if (value < 75) return 'stroke-yellow-500';
    return 'stroke-green-500';
  }


  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="text-secondary"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        {/* Progress circle */}
        <circle
          className={cn("transform -rotate-90 origin-center transition-all duration-500", getTrackColor(safeScore))}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
      </svg>
      <span className={cn("absolute text-5xl font-bold", getScoreColor(safeScore))}>
        {safeScore}
      </span>
    </div>
  );
}
