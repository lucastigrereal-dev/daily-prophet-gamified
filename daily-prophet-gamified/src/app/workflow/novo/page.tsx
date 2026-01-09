'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { workflowService } from '@/lib/workflow-service';
import { createClient } from '@/lib/supabase/client';

export default function NovoWorkflowPage() {
  const router = useRouter();
  const [postpacks, setPostpacks] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    createClient()
      .from('postpacks')
      .select('*')
      .in('status', ['draft', 'pending_approval'])
      .then(({ data }) => setPostpacks(data || []));
  }, []);

  const handleCreate = async () => {
    if (!selected) return;
    setLoading(true);
    const wf = await workflowService.create({ postpack_id: selected });
    router.push(`/workflow/${wf.id}/fase-1`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button onClick={() => router.back()} className="mb-4">
        ← Voltar
      </button>
      <h1 className="text-2xl font-bold mb-4">Novo Workflow</h1>
      <div className="space-y-2">
        {postpacks.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer ${
              selected === p.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <p className="font-medium">{p.title}</p>
            <p className="text-sm text-gray-500">
              {p.format} • {p.objective}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={handleCreate}
        disabled={!selected || loading}
        className="w-full mt-4 py-3 bg-green-500 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? 'Criando...' : 'Iniciar Workflow'}
      </button>
    </div>
  );
}
