'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PostpackWorkflow } from '@/types/workflow';
import { workflowService } from '@/lib/workflow-service';
import { WorkflowStepper } from '@/components/workflow';

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
        <h1 className="text-2xl font-bold mb-4">Workflows</h1>
        <button
          onClick={() => router.push('/workflow/novo')}
          className="w-full py-3 bg-blue-500 text-white rounded-lg mb-4"
        >
          + Novo PostPack
        </button>
        {workflows.length === 0 ? (
          <p className="text-gray-500">Nenhum workflow em andamento</p>
        ) : (
          workflows.map((w) => (
            <div
              key={w.id}
              onClick={() => router.push(`/workflow/${w.id}`)}
              className="bg-white p-4 rounded-lg shadow mb-3 cursor-pointer"
            >
              <p className="font-medium">{w.postpack_id}</p>
              <p className="text-sm text-gray-500">Fase: {w.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
