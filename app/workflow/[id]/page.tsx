'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { PostpackWorkflow, FaseStatus } from '@/types/workflow';
import { FASES_CONFIG } from '@/config/checklist-config';
import { workflowService } from '@/lib/workflow-service';

const STATUS_COLORS: Record<FaseStatus, string> = {
  pendente: 'bg-gray-200 text-gray-600',
  em_progresso: 'bg-blue-500 text-white',
  concluido: 'bg-green-500 text-white',
  incompleto: 'bg-red-500 text-white',
};

export default function WorkflowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [workflow, setWorkflow] = useState<PostpackWorkflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingItems, setPendingItems] = useState<string[] | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (params.id) loadWorkflow(params.id as string);
  }, [params.id]);

  async function loadWorkflow(id: string) {
    try {
      setLoading(true);
      setError(null);
      setPendingItems(null);
      const data = await workflowService.getById(id);
      if (!data) {
        setError('Nao encontrado');
        setWorkflow(null);
        return;
      }
      setWorkflow(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }

  async function avancarFase() {
    if (!workflow) return;
    try {
      setUpdating(true);
      setError(null);
      setPendingItems(null);
      const result = await workflowService.avancarFase(workflow.id);
      if (!result.success) {
        const faseAtual = workflow.status as keyof typeof FASES_CONFIG;
        const itens = FASES_CONFIG[faseAtual]?.items || [];
        const labels = result.pendentes
          ?.map((id) => itens.find((item) => item.id === id)?.label || id)
          .filter(Boolean) || [];
        setPendingItems(labels);
        setError('Nao foi possivel avancar. Itens pendentes.');
        return;
      }
      await loadWorkflow(workflow.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
      setPendingItems(null);
    } finally {
      setUpdating(false);
    }
  }

  async function concluir() {
    await avancarFase();
  }

  async function excluir() {
    if (!workflow || !confirm('Excluir workflow?')) return;
    try {
      setUpdating(true);
      setError(null);
      await workflowService.delete(workflow.id);
      router.push('/workflow');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  if (!workflow) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-red-500 text-sm sm:text-base">{error || 'Nao encontrado'}</p>
      </div>
    );
  }

  const fases = [
    { num: 1, key: 'fase_1', status: workflow.fase_1.status, completed: workflow.fase_1.completed_at },
    { num: 2, key: 'fase_2', status: workflow.fase_2.status, completed: workflow.fase_2.completed_at },
    { num: 3, key: 'fase_3', status: workflow.fase_3.status, completed: workflow.fase_3.completed_at },
    { num: 4, key: 'fase_4', status: workflow.fase_4.status, completed: workflow.fase_4.completed_at },
    { num: 5, key: 'fase_5', status: workflow.fase_5.status, completed: workflow.fase_5.completed_at },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <button onClick={() => router.push('/workflow')} className="text-blue-600 hover:underline mb-2 text-sm sm:text-base">&larr; Voltar</button>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">PostPack #{workflow.id.slice(0, 8)}</h1>
              <p className="text-xs sm:text-sm text-gray-500">Por {workflow.created_by || 'Sistema'} - {new Date(workflow.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
            <span className={`inline-flex px-3 py-1 h-fit rounded-full text-xs sm:text-sm ${workflow.status === 'concluido' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
              {workflow.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6">
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-3 sm:p-4 text-sm sm:text-base">
            <p className="font-medium mb-2">{error}</p>
            {pendingItems && pendingItems.length > 0 && (
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                {pendingItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Progresso</h2>
          <div className="relative mb-6 sm:mb-8">
            <div className="hidden sm:block absolute top-6 left-6 right-6 h-1 bg-gray-200">
              <div className="h-full bg-green-500" style={{ width: `${(fases.filter(f => f.status === 'concluido').length / 5) * 100}%` }} />
            </div>
            <div className="relative grid grid-cols-2 gap-4 sm:flex sm:justify-between">
              {fases.map((f) => {
                const cfg = FASES_CONFIG[f.key as keyof typeof FASES_CONFIG];
                return (
                  <div key={f.num} className="flex flex-col items-center text-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg font-bold z-10 ${STATUS_COLORS[f.status as FaseStatus]}`}>
                      {f.status === 'concluido' ? 'OK' : f.status === 'em_progresso' ? '>>' : f.status === 'incompleto' ? '!' : f.num}
                    </div>
                    <span className="mt-2 text-xs sm:text-sm font-medium">{cfg.nome}</span>
                    {f.completed && <span className="text-[10px] sm:text-xs text-gray-400">{new Date(f.completed).toLocaleDateString('pt-BR')}</span>}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {workflow.status !== 'concluido' && workflow.status !== 'fase_5' && (
              <button
                onClick={avancarFase}
                disabled={updating}
                className="flex-1 min-h-[44px] py-3 px-4 text-sm sm:text-base font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {updating ? 'Atualizando...' : 'Avancar fase'}
              </button>
            )}
            {workflow.status === 'fase_5' && (
              <button
                onClick={concluir}
                disabled={updating}
                className="flex-1 min-h-[44px] py-3 px-4 text-sm sm:text-base font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {updating ? 'Concluindo...' : 'Concluir workflow'}
              </button>
            )}
          </div>
        </div>

        {workflow.notas && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="font-semibold mb-2 text-sm sm:text-base">Notas</h2>
            <p className="text-gray-600 text-sm sm:text-base">{workflow.notas}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-red-200">
          <h2 className="font-semibold text-red-600 mb-4 text-sm sm:text-base">Zona de Perigo</h2>
          <button onClick={excluir} disabled={updating} className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400">
            Excluir Workflow
          </button>
        </div>
      </main>
    </div>
  );
}
