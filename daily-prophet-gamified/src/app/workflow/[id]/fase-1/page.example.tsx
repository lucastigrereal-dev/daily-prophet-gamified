'use client';

import { useRouter, useParams } from 'next/navigation';
import { useWorkflow } from '@/hooks/useWorkflow';
import { ChecklistManager, ProgressBar } from '@/components/workflow';
import { ChecklistItemConfig } from '@/types/workflow';

// Configuração da checklist da Fase 1
const FASE_1_ITEMS: ChecklistItemConfig[] = [
  { id: 'objetivo', label: 'Definir objetivo do postpack', descricao: 'Descrever claramente o objetivo do conteúdo', obrigatorio: true },
  { id: 'formato', label: 'Escolher formato do conteúdo', descricao: 'Selecionar o formato (carrossel, vídeo, imagem única)', obrigatorio: true },
  { id: 'revisar', label: 'Revisar informações básicas', descricao: 'Validar todas as informações inseridas', obrigatorio: true }
];

export default function Fase1PageExample() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const workflowId = params?.id || '';

  const { workflow, loading, error, updateWorkflow, avancarFase, podeAvancar } = useWorkflow(workflowId);

  const handleChecklistChange = async (checklist: Record<string, any>) => {
    if (!workflow) return;

    await updateWorkflow({
      fase_1: {
        ...workflow.fase_1,
        checklist
      }
    });
  };

  const handleAvancar = async () => {
    if (!podeAvancar()) {
      alert('Complete todos os itens obrigatórios antes de avançar!');
      return;
    }

    await avancarFase();
    router.push(`/workflow/${workflowId}/fase-2`);
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Erro: {error}</div>;
  if (!workflow) return <div className="p-8 text-center">Workflow não encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar currentPhase={1} />

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fase 1 - Criação
          </h1>
          <p className="text-gray-600">
            Configure as informações básicas do seu postpack
          </p>
        </div>

        {/* Postpack Info */}
        {workflow.postpack && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">{workflow.postpack.title}</h2>
            <p className="text-gray-600 text-sm">{workflow.postpack.objective}</p>
            <p className="text-gray-500 text-xs mt-1">Formato: {workflow.postpack.format}</p>
          </div>
        )}

        {/* Checklist */}
        <ChecklistManager
          items={FASE_1_ITEMS}
          data={workflow.fase_1.checklist}
          onChange={handleChecklistChange}
          autoSave={true}
        />

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.push('/workflow')}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={handleAvancar}
            disabled={!podeAvancar()}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            Avançar para Fase 2
          </button>
        </div>
      </div>
    </div>
  );
}
