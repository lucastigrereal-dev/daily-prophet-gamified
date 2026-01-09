'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PostpackWorkflow } from '@/types/workflow';
import { workflowService } from '@/lib/workflow-service';

export default function HistoricoPage() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<PostpackWorkflow[]>([]);

  useEffect(() => {
    workflowService.list({ status: ['concluido'] }).then(setWorkflows);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Historico</h1>
      {workflows.length === 0 ? (
        <p className="text-gray-500">Nenhum workflow concluido</p>
      ) : (
        workflows.map((w) => (
          <div
            key={w.id}
            onClick={() => router.push(`/workflow/${w.id}/relatorio`)}
            className="bg-white p-4 rounded-lg shadow mb-3 cursor-pointer"
          >
            <p className="font-medium">{w.postpack_id}</p>
            <p className="text-sm text-gray-500">
              Concluido: {new Date(w.completed_at!).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
