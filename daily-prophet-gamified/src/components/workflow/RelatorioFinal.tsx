'use client';

import { useState } from 'react';
import { PostpackWorkflow, PostpackResumo, Metricas24h } from '@/types/workflow';
import { FASES_CONFIG, FASES_ORDEM } from '@/config/checklist-config';
import { workflowService } from '@/lib/workflow-service';
import { MetricsForm, MetricsDisplay } from './index';

interface Props {
  workflow: PostpackWorkflow;
  postpack: PostpackResumo;
}

export function RelatorioFinal({ workflow: initialWorkflow, postpack }: Props) {
  const [workflow, setWorkflow] = useState<PostpackWorkflow>(initialWorkflow);
  const [editingMetrics, setEditingMetrics] = useState(false);
  const [savingMetrics, setSavingMetrics] = useState(false);

  const handleSaveMetrics = async (metricas24h: Metricas24h, metricas7d: Metricas24h) => {
    setSavingMetrics(true);
    try {
      const updated = await workflowService.updateMetrics(workflow.id, metricas24h, metricas7d);
      setWorkflow(updated);
      setEditingMetrics(false);
    } finally {
      setSavingMetrics(false);
    }
  };
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">📊 Relatório</h1>
      <p className="text-gray-600 mb-4">{postpack.title}</p>

      {workflow.published_url && (
        <a href={workflow.published_url} className="text-blue-500 text-sm">
          🔗 Ver no Instagram
        </a>
      )}

      <div className="mt-4 space-y-2">
        {FASES_ORDEM.map((fase) => {
          const config = FASES_CONFIG[fase];
          const data = workflow[fase];
          const total = config.items.length;
          const done = config.items.filter(
            (i) =>
              data.checklist[i.id]?.status === 'concluido' ||
              data.checklist[i.id]?.status === 'pulado'
          ).length;

          return (
            <div key={fase} className="flex justify-between p-2 bg-gray-50 rounded">
              <span>
                {config.icone} {config.nome}
              </span>
              <span>
                {done}/{total}
              </span>
            </div>
          );
        })}
      </div>

      {/* Métricas */}
      <div className="mt-6">
        {!editingMetrics && (workflow.metricas_24h || workflow.metricas_7d) ? (
          <MetricsDisplay
            metricas24h={workflow.metricas_24h}
            metricas7d={workflow.metricas_7d}
            onEdit={() => setEditingMetrics(true)}
            updatedAt={workflow.updated_at}
          />
        ) : !editingMetrics ? (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-gray-600 mb-3">Nenhuma métrica registrada ainda</p>
            <button
              onClick={() => setEditingMetrics(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors"
            >
              ➕ Adicionar Métricas
            </button>
          </div>
        ) : null}

        {editingMetrics && (
          <MetricsForm
            workflowId={workflow.id}
            onSave={handleSaveMetrics}
            initialMetricas24h={workflow.metricas_24h}
            initialMetricas7d={workflow.metricas_7d}
          />
        )}

        {editingMetrics && (
          <button
            onClick={() => setEditingMetrics(false)}
            className="mt-3 w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded font-semibold transition-colors"
          >
            ✕ Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
