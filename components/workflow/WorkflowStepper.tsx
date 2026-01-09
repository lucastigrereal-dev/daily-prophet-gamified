'use client';

import { FaseNumero, PostpackWorkflow } from '@/types/workflow';
import { FASES_CONFIG, FASES_ORDEM } from '@/config/checklist-config';

interface Props {
  currentFase: FaseNumero;
  workflow: PostpackWorkflow;
  onFaseClick?: (fase: FaseNumero) => void;
}

export function WorkflowStepper({ currentFase, workflow, onFaseClick }: Props) {
  const getStatus = (fase: FaseNumero) => {
    const data = workflow[fase];
    if (data.status === 'concluido') return '✅';
    if (data.status === 'incompleto') return '⚠️';
    if (fase === currentFase) return '🔵';
    return '⚪';
  };

  return (
    <div className="px-1 sm:px-2 py-3 sm:py-4 overflow-x-auto sm:overflow-visible">
      <div className="flex items-center w-full min-w-[420px] sm:min-w-0">
        {FASES_ORDEM.map((fase, i) => (
          <div key={fase} className="flex items-center flex-1">
            <button
              onClick={() => onFaseClick?.(fase)}
              className="flex flex-col items-center px-2 py-2 min-h-[44px]"
            >
              <span className="text-xl sm:text-2xl">{getStatus(fase)}</span>
              <span className="text-[11px] sm:text-xs mt-1 text-center">
                {FASES_CONFIG[fase].nome}
              </span>
            </button>
            {i < 4 && <div className="flex-1 h-0.5 bg-gray-300 mx-1" />}
          </div>
        ))}
      </div>
    </div>
  );
}
