// Componente WorkflowTracker - Visualizacao de 5 Fases
// Daily Prophet - Instituto Rodovansky

'use client';

import { useState } from 'react';
import type { PostPackWorkflow, FaseStatus } from '../types/workflow';
import { FASES_CONFIG } from '../types/workflow';

interface WorkflowTrackerProps {
  workflow: PostPackWorkflow;
  onFaseClick?: (fase: number) => void;
  onAvancar?: (fase: number) => void;
}

const STATUS_COLORS: Record<FaseStatus, string> = {
  pendente: 'bg-gray-200 text-gray-600',
  em_andamento: 'bg-blue-500 text-white',
  concluido: 'bg-green-500 text-white',
  rejeitado: 'bg-red-500 text-white',
};

const STATUS_ICONS: Record<FaseStatus, string> = {
  pendente: '○',
  em_andamento: '◐',
  concluido: '✓',
  rejeitado: '✗',
};

export default function WorkflowTracker({
  workflow,
  onFaseClick,
  onAvancar
}: WorkflowTrackerProps) {
  const [expandedFase, setExpandedFase] = useState<number | null>(null);

  const fases = [
    { num: 1, status: workflow.fase_1_status, completed: workflow.fase_1_completed_at, checklist: workflow.fase_1_checklist },
    { num: 2, status: workflow.fase_2_status, completed: workflow.fase_2_completed_at, checklist: workflow.fase_2_checklist },
    { num: 3, status: workflow.fase_3_status, completed: workflow.fase_3_completed_at, checklist: workflow.fase_3_checklist },
    { num: 4, status: workflow.fase_4_status, completed: workflow.fase_4_completed_at, checklist: workflow.fase_4_checklist },
    { num: 5, status: workflow.fase_5_status, completed: workflow.fase_5_completed_at, checklist: workflow.fase_5_checklist },
  ];

  const getFaseConfig = (num: number) => {
    const key = `fase_${num}` as keyof typeof FASES_CONFIG;
    return FASES_CONFIG[key];
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Workflow do PostPack</h2>
        <p className="text-sm text-gray-500">
          Status atual: <span className="font-semibold">{workflow.status.replace('_', ' ').toUpperCase()}</span>
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Linha conectora */}
        <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200 z-0">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{
              width: `${(fases.filter(f => f.status === 'concluido').length / 5) * 100}%`
            }}
          />
        </div>

        {/* Fases */}
        <div className="relative z-10 flex justify-between">
          {fases.map((fase) => {
            const config = getFaseConfig(fase.num);
            const isExpanded = expandedFase === fase.num;

            return (
              <div
                key={fase.num}
                className="flex flex-col items-center"
              >
                {/* Circulo da fase */}
                <button
                  onClick={() => {
                    setExpandedFase(isExpanded ? null : fase.num);
                    onFaseClick?.(fase.num);
                  }}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    text-lg font-bold transition-all duration-300
                    hover:scale-110 hover:shadow-lg
                    ${STATUS_COLORS[fase.status]}
                  `}
                >
                  {STATUS_ICONS[fase.status]}
                </button>

                {/* Nome da fase */}
                <span className="mt-2 text-sm font-medium text-gray-700">
                  {config.nome}
                </span>

                {/* Data de conclusao */}
                {fase.completed && (
                  <span className="text-xs text-gray-400">
                    {new Date(fase.completed).toLocaleDateString('pt-BR')}
                  </span>
                )}

                {/* Painel expandido */}
                {isExpanded && (
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-64 bg-white rounded-lg shadow-xl p-4 z-20">
                    <h3 className="font-bold text-gray-800 mb-2">{config.nome}</h3>
                    <p className="text-sm text-gray-500 mb-3">{config.descricao}</p>

                    {/* Checklist */}
                    <div className="space-y-2">
                      {Object.entries(config.checklist_padrao).map(([key]) => (
                        <label key={key} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={fase.checklist?.[key] || false}
                            readOnly
                            className="rounded"
                          />
                          <span className="text-gray-600">
                            {key.replace(/_/g, ' ')}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Botao avancar */}
                    {fase.status === 'em_andamento' && onAvancar && (
                      <button
                        onClick={() => onAvancar(fase.num)}
                        className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        Concluir e Avancar
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Metricas (se fase 5 concluida) */}
      {workflow.fase_5_status === 'concluido' && (workflow.metricas_24h || workflow.metricas_7d) && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-3">Metricas</h3>
          <div className="grid grid-cols-2 gap-4">
            {workflow.metricas_24h && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">24 horas</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Object.entries(workflow.metricas_24h).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="text-gray-500">{key}:</span>{' '}
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {workflow.metricas_7d && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">7 dias</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Object.entries(workflow.metricas_7d).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="text-gray-500">{key}:</span>{' '}
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notas */}
      {workflow.notas && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800">Notas:</h4>
          <p className="text-sm text-yellow-700">{workflow.notas}</p>
        </div>
      )}
    </div>
  );
}
