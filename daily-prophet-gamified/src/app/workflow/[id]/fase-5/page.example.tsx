'use client';

import { useRouter, useParams } from 'next/navigation';
import { useWorkflow } from '@/hooks/useWorkflow';
import { ChecklistManager, ProgressBar } from '@/components/workflow';
import { ChecklistItemConfig } from '@/types/workflow';

const FASE_5_ITEMS: ChecklistItemConfig[] = [
  { id: 'coletar_metricas', label: 'Coletar métricas (24h)', descricao: 'Registrar métricas após 24h da publicação', obrigatorio: true },
  { id: 'analisar', label: 'Analisar resultados', descricao: 'Avaliar performance do conteúdo', obrigatorio: true },
  { id: 'relatorio', label: 'Gerar relatório final', descricao: 'Criar relatório com insights', obrigatorio: false }
];

export default function Fase5PageExample() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const workflowId = params?.id || '';

  const { workflow, loading, error, updateWorkflow, avancarFase, podeAvancar } = useWorkflow(workflowId);

  const handleChecklistChange = async (checklist: Record<string, any>) => {
    if (!workflow) return;
    await updateWorkflow({
      fase_5: {
        ...workflow.fase_5,
        checklist
      }
    });
  };

  const handleFinalizar = async () => {
    if (!podeAvancar()) {
      alert('Complete todos os itens obrigatórios antes de finalizar!');
      return;
    }
    await avancarFase();
    router.push(`/workflow/${workflowId}/concluido`);
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Erro: {error}</div>;
  if (!workflow) return <div className="p-8 text-center">Workflow não encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <ProgressBar currentPhase={5} />

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fase 5 - Métricas
          </h1>
          <p className="text-gray-600">
            Colete métricas e finalize o workflow
          </p>
        </div>

        <ChecklistManager
          items={FASE_5_ITEMS}
          data={workflow.fase_5.checklist}
          onChange={handleChecklistChange}
          autoSave={true}
        />

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.push(`/workflow/${workflowId}/fase-4`)}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={handleFinalizar}
            disabled={!podeAvancar()}
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            Finalizar Workflow
          </button>
        </div>
      </div>
    </div>
  );
}
