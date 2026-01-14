'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { useWorkflow } from '@/hooks/useWorkflow';
import { WorkflowComposicao } from '@/types/workflow';
import ComposicaoReels from '@/components/workflow/composicao/ComposicaoReels';
import ComposicaoCarrossel from '@/components/workflow/composicao/ComposicaoCarrossel';
import ComposicaoStories from '@/components/workflow/composicao/ComposicaoStories';

export default function ComposicaoPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const workflowId = params?.id || '';

  const { workflow, loading, error, updateWorkflow } = useWorkflow(workflowId);
  const [saving, setSaving] = useState(false);

  const handleComposicaoChange = async (composicaoData: Partial<WorkflowComposicao>) => {
    if (!workflow) return;

    try {
      setSaving(true);
      const updated = await updateWorkflow({
        composicao: {
          ...workflow.composicao,
          ...composicaoData
        }
      });

      if (updated) {
        // Não avança automaticamente - deixa o usuário completar a composição
      }
    } catch (err) {
      console.error('Erro ao salvar composição:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAvancar = async () => {
    if (!workflow?.composicao) {
      alert('Por favor, complete a composição antes de avançar');
      return;
    }

    try {
      setSaving(true);
      await updateWorkflow({
        status: 'fase_1'
      });
      router.push(`/workflow/${workflowId}/fase-1`);
    } catch (err) {
      alert('Erro ao avançar: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleVoltar = () => {
    router.push(`/workflow/${workflowId}`);
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Erro: {error}</div>;
  if (!workflow) return <div className="p-8 text-center">Workflow não encontrado</div>;

  const formato = workflow.postpack?.format || '';
  const composicaoAtual = workflow.composicao || {};

  const renderComponente = () => {
    if (formato.toLowerCase().includes('reel')) {
      return (
        <ComposicaoReels
          data={composicaoAtual}
          onChange={handleComposicaoChange}
          loading={saving}
        />
      );
    } else if (formato.toLowerCase().includes('carrossel')) {
      return (
        <ComposicaoCarrossel
          data={composicaoAtual}
          onChange={handleComposicaoChange}
          loading={saving}
        />
      );
    } else if (formato.toLowerCase().includes('storie')) {
      return (
        <ComposicaoStories
          data={composicaoAtual}
          onChange={handleComposicaoChange}
          loading={saving}
        />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ✏️ Composição do Conteúdo
          </h1>
          <p className="text-gray-600">
            Vamos preparar o conteúdo de acordo com o formato escolhido
          </p>
        </div>

        {/* Postpack Info */}
        {workflow.postpack && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">{workflow.postpack.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{workflow.postpack.objective}</p>
            <div className="flex gap-4 text-sm flex-wrap">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {workflow.postpack.format}
              </span>
              {workflow.postpack.status && (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
                  {workflow.postpack.status}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Composição Component */}
        {renderComponente() ? (
          <div className="mb-6">
            {renderComponente()}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Formato não reconhecido: <strong>{formato}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Por favor, verifique se o formato do postpack está configurado corretamente.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Formatos suportados: Reels, Carrossel, Stories
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleVoltar}
            disabled={saving}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-lg transition-colors"
          >
            ← Voltar
          </button>
          <button
            onClick={handleAvancar}
            disabled={saving || !composicaoAtual.reels && !composicaoAtual.carrossel && !composicaoAtual.stories}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            {saving ? 'Salvando...' : 'Avançar para Fase 1 →'}
          </button>
        </div>
      </div>
    </div>
  );
}
