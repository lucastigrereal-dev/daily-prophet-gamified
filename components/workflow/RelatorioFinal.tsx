'use client';

import { PostpackWorkflow, PostpackResumo } from '@/types/workflow';
import { FASES_CONFIG, FASES_ORDEM } from '@/config/checklist-config';

interface Props {
  workflow: PostpackWorkflow;
  postpack: PostpackResumo;
}

export function RelatorioFinal({ workflow, postpack }: Props) {
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

      {workflow.metricas_24h && (
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h3 className="font-bold mb-2">📈 Métricas 24h</h3>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div>👁️ {workflow.metricas_24h.views || 0}</div>
            <div>❤️ {workflow.metricas_24h.likes || 0}</div>
            <div>💾 {workflow.metricas_24h.saves || 0}</div>
          </div>
        </div>
      )}
    </div>
  );
}
