'use client';

import { useRouter, useParams } from 'next/navigation';
import { useWorkflow } from '@/hooks/useWorkflow';
import { ChecklistManager, ProgressBar } from '@/components/workflow';
import { ChecklistItemConfig } from '@/types/workflow';

const FASE_4_ITEMS: ChecklistItemConfig[] = [
  { id: 'agendar', label: 'Agendar publicação', descricao: 'Definir data e hora da publicação', obrigatorio: true },
  { id: 'publicar', label: 'Publicar conteúdo', descricao: 'Realizar publicação no Instagram', obrigatorio: true },
  { id: 'confirmar_url', label: 'Confirmar URL da publicação', descricao: 'Salvar link do post publicado', obrigatorio: true }
];

export default function Fase4PageExample() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const workflowId = params?.id || '';

  const { workflow, loading, error, updateWorkflow, avancarFase, podeAvancar } = useWorkflow(workflowId);

  const handleChecklistChange = async (checklist: Record<string, any>) => {
    if (!workflow) return;
    await updateWorkflow({
      fase_4: {
        ...workflow.fase_4,
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
    router.push(`/workflow/${workflowId}/fase-5`);
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Erro: {error}</div>;
  if (!workflow) return <div className="p-8 text-center">Workflow não encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <ProgressBar currentPhase={4} />

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fase 4 - Publicação
          </h1>
          <p className="text-gray-600">
            Publique o conteúdo no Instagram
          </p>
        </div>

        <ChecklistManager
          items={FASE_4_ITEMS}
          data={workflow.fase_4.checklist}
          onChange={handleChecklistChange}
          autoSave={true}
        />

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.push(`/workflow/${workflowId}/fase-3`)}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={handleAvancar}
            disabled={!podeAvancar()}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            Avançar para Fase 5
          </button>
        </div>
      </div>
    </div>
  );
}
