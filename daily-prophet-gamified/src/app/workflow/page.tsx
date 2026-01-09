'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PostpackWorkflow } from '@/types/workflow';
import { workflowService } from '@/lib/workflow-service';
import { WorkflowStepper, PostpackInfo } from '@/components/workflow';

export default function WorkflowListPage() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<PostpackWorkflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workflowService
      .list({ status: ['fase_1', 'fase_2', 'fase_3', 'fase_4', 'fase_5'] })
      .then(setWorkflows)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Workflows em Andamento</h1>
        <button
          onClick={() => router.push('/workflow/novo')}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mb-6 font-medium transition-colors"
        >
          + Novo PostPack
        </button>
        {workflows.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-2">Nenhum workflow em andamento</p>
            <p className="text-sm text-gray-400">
              Clique em "Novo PostPack" para começar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {workflows.map((w) => (
              <div
                key={w.id}
                onClick={() => router.push(`/workflow/${w.id}`)}
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

                {/* Status do Workflow */}
                <div className="p-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        Fase Atual:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {w.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <span className="text-blue-600 text-sm font-medium">
                      Ver detalhes →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
