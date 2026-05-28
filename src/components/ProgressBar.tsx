interface ProgressBarProps {
  currentQuestion: number
  totalQuestions: number
}

export default function ProgressBar({ currentQuestion, totalQuestions }: ProgressBarProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const position = i + 1
          const isCompleted = position < currentQuestion
          const isCurrent = position === currentQuestion

          return (
            <div
              key={position}
              className={`h-2 w-10 rounded-full transition-all duration-300
                ${isCompleted ? 'bg-indigo-500' : ''}
                ${isCurrent ? 'bg-indigo-500 animate-pulse' : ''}
                ${!isCompleted && !isCurrent ? 'bg-gray-700' : ''}
              `}
            />
          )
        })}
      </div>
      <span className="text-sm text-gray-400">
        Question {currentQuestion} of {totalQuestions}
      </span>
    </div>
  )
}
