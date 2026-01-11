'use client';

interface Props {
  currentPhase: 1 | 2 | 3 | 4 | 5;
}

const PHASES = [
  { num: 1, label: 'Criação', icon: '🎨' },
  { num: 2, label: 'Revisão', icon: '✅' },
  { num: 3, label: 'Produção', icon: '🎬' },
  { num: 4, label: 'Publicação', icon: '📤' },
  { num: 5, label: 'Métricas', icon: '📊' }
]

export default function ProgressBar({ currentPhase }: Props) {
  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        {PHASES.map((phase, idx) => {
          const isActive = phase.num === currentPhase
          const isCompleted = phase.num < currentPhase

          return (
            <div key={phase.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold
                  ${isActive ? 'bg-blue-600 text-white scale-110 shadow-lg' : ''}
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500' : ''}
                  transition-all duration-300
                `}>
                  {phase.icon}
                </div>
                <span className={`
                  mt-2 text-xs font-medium
                  ${isActive ? 'text-blue-600' : ''}
                  ${isCompleted ? 'text-green-600' : ''}
                  ${!isActive && !isCompleted ? 'text-gray-400' : ''}
                `}>
                  {phase.label}
                </span>
              </div>

              {idx < PHASES.length - 1 && (
                <div className={`
                  flex-1 h-1 mx-4
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                  transition-colors duration-300
                `} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
