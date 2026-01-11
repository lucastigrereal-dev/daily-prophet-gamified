'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PostpackWorkflow } from '@/types/workflow';
import { workflowService } from '@/lib/workflow-service';
import { PostpackInfo } from '@/components/workflow';

export default function HistoricoPage() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<PostpackWorkflow[]>([]);

  useEffect(() => {
    workflowService.list({ status: ['concluido'] }).then(setWorkflows);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Histórico de Workflows</h1>
      {workflows.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-2">Nenhum workflow concluído</p>
          <p className="text-sm text-gray-400">
            Workflows finalizados aparecerão aqui
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {workflows.map((w) => (
            <div
              key={w.id}
              onClick={() => router.push(`/workflow/${w.id}/relatorio`)}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            >
              {/* Postpack Info Compacta */}
              <div className="p-4 border-b border-gray-100">
                <PostpackInfo
                  postpack={w.postpack}
                  postpackId={w.postpack_id}
                  variant="compact"
                />
              </div>

              {/* Informações de Conclusão */}
              <div className="p-3 bg-green-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-lg">✓</span>
                    <div>
                      <p className="text-xs font-semibold text-green-700 uppercase">
                        Concluído
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(w.completed_at!).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-green-700 text-sm font-medium">
                    Ver relatório →
                  </span>
                </div>
              </div>

              {/* Métricas (se disponíveis) */}
              {w.metricas_24h && (
                <div className="p-3 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    {w.metricas_24h.views && (
                      <div className="flex items-center gap-1">
                        <span>👁️</span>
                        <span>{w.metricas_24h.views.toLocaleString()}</span>
                      </div>
                    )}
                    {w.metricas_24h.likes && (
                      <div className="flex items-center gap-1">
                        <span>❤️</span>
                        <span>{w.metricas_24h.likes.toLocaleString()}</span>
                      </div>
                    )}
                    {w.metricas_24h.shares && (
                      <div className="flex items-center gap-1">
                        <span>🔄</span>
                        <span>{w.metricas_24h.shares.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
