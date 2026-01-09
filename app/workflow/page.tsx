'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { PostPackWorkflow } from '@/types/workflow';

const STATUS_LABELS: Record<string, string> = {
  fase_1: 'Fase 1 - Criacao',
  fase_2: 'Fase 2 - Revisao',
  fase_3: 'Fase 3 - Aprovacao',
  fase_4: 'Fase 4 - Publicacao',
  fase_5: 'Fase 5 - Metricas',
  concluido: 'Concluido',
};

const STATUS_COLORS: Record<string, string> = {
  fase_1: 'bg-purple-100 text-purple-800',
  fase_2: 'bg-blue-100 text-blue-800',
  fase_3: 'bg-yellow-100 text-yellow-800',
  fase_4: 'bg-orange-100 text-orange-800',
  fase_5: 'bg-pink-100 text-pink-800',
  concluido: 'bg-green-100 text-green-800',
};

export default function WorkflowListPage() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<PostPackWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, emAndamento: 0, concluidos: 0 });

  useEffect(() => {
    loadWorkflows();
  }, []);

  async function loadWorkflows() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('postpack_workflow')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkflows(data || []);
      const total = data?.length || 0;
      const concluidos = data?.filter(w => w.status === 'concluido').length || 0;
      setStats({ total, emAndamento: total - concluidos, concluidos });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Workflows</h1>
            <p className="text-xs sm:text-sm text-gray-500">Gerenciamento de PostPacks</p>
          </div>
          <button
            onClick={() => router.push('/workflow/novo')}
            className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Novo PostPack
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
            <p className="text-xs sm:text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
            <p className="text-xs sm:text-sm text-gray-500">Em Andamento</p>
            <p className="text-2xl font-bold text-blue-600">{stats.emAndamento}</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
            <p className="text-xs sm:text-sm text-gray-500">Concluidos</p>
            <p className="text-2xl font-bold text-green-600">{stats.concluidos}</p>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm sm:text-base">Carregando...</p>
          </div>
        )}

        {!loading && workflows.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 mb-4 text-sm sm:text-base">Nenhum workflow encontrado</p>
            <button onClick={() => router.push('/workflow/novo')} className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-lg">
              Criar primeiro PostPack
            </button>
          </div>
        )}

        {!loading && workflows.length > 0 && (
          <div className="space-y-3">
            {workflows.map((wf) => (
              <div key={wf.id} onClick={() => router.push(`/workflow/${wf.id}`)} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md cursor-pointer">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">PostPack #{wf.id.slice(0, 8)}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Por: {wf.created_by || 'Sistema'}</p>
                    {wf.notas && <p className="text-xs sm:text-sm text-gray-600 mt-1">{wf.notas}</p>}
                  </div>
                  <div className="text-left sm:text-right">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[wf.status]}`}>
                      {STATUS_LABELS[wf.status]}
                    </span>
                    <p className="text-[11px] sm:text-xs text-gray-400 mt-2">{new Date(wf.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="mt-3 h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{
                    width: wf.status === 'concluido' ? '100%' : wf.status === 'fase_5' ? '80%' : wf.status === 'fase_4' ? '60%' : wf.status === 'fase_3' ? '40%' : wf.status === 'fase_2' ? '20%' : '5%'
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button onClick={() => router.push('/')} className="text-blue-600 hover:underline">Voltar para Home</button>
        </div>
      </main>
    </div>
  );
}
