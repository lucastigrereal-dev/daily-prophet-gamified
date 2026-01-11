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
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex items-center w-full">
        {FASES_ORDEM.map((fase, i) => (
          <div key={fase} className="flex items-center flex-1">
            <button
              onClick={() => onFaseClick?.(fase)}
              className="flex flex-col items-center"
            >
              <span className="text-2xl">{getStatus(fase)}</span>
              <span className="text-xs mt-1 text-center">
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
