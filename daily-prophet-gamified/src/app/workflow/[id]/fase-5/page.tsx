'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PostpackWorkflow, ChecklistItemConfig } from '@/types/workflow';
import { workflowService } from '@/lib/workflow-service';
import {
  WorkflowStepper,
  FaseChecklist,
  ConfirmacaoModal,
  AlertaContinuarModal,
} from '@/components/workflow';
import { FASE_5_CONFIG } from '@/config/checklist-config';
import { useToast } from '@/hooks/useToast';
import LoadingPage from '@/components/ui/LoadingPage';

export default function Fase5Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { success, error } = useToast();
  const [workflow, setWorkflow] = useState<PostpackWorkflow | null>(null);
  const [modalItem, setModalItem] = useState<ChecklistItemConfig | null>(null);
  const [showAlerta, setShowAlerta] = useState(false);
  const [pendentes, setPendentes] = useState<ChecklistItemConfig[]>([]);
  const [metricas, setMetricas] = useState({
    impressoes: 0,
    alcance: 0,
    engajamento: 0,
    likes: 0,
    comentarios: 0,
    salvamentos: 0
  });
  const id = params?.id;

  useEffect(() => {
    if (id) workflowService.getById(id).then(setWorkflow);
  }, [id]);

  const handleConfirm = async (obs?: string) => {
    if (!workflow || !modalItem) return;
    await workflowService.updateChecklist(workflow.id, 'fase_5', modalItem.id, {
      status: 'concluido',
      observacao: obs,
    });
    setWorkflow(await workflowService.getById(workflow.id));
    setModalItem(null);
  };

  const handleAvancar = async () => {
    if (!workflow) return;
    const result = await workflowService.avancarFase(workflow.id, false);
    if (!result.success && result.pendentes) {
      setPendentes(
        FASE_5_CONFIG.items.filter((i) => result.pendentes!.includes(i.id))
      );
      setShowAlerta(true);
    } else {
      router.push(`/workflow/${workflow.id}/relatorio`);
    }
  };

  const handleContinuar = async () => {
    if (!workflow) return;
    await workflowService.avancarFase(workflow.id, true);
    router.push(`/workflow/${workflow.id}/relatorio`);
  };

  const handleSaveMetrics = async () => {
    if (!workflow) return;
    try {
      await workflowService.update(workflow.id, {
        fase_5_metricas: metricas,
        completed_at: new Date().toISOString()
      });
      success('🎉 Workflow completo! Métricas salvas.');
      router.push(`/workflow/${workflow.id}/relatorio`);
    } catch (err) {
      error('Erro ao salvar métricas');
    }
  };

  if (!workflow) return <LoadingPage message="Carregando workflow..." />;

  return (
    <div className="min-h-screen flex flex-col">
      <WorkflowStepper currentFase="fase_5" workflow={workflow} />
      <div className="flex-1">
        <FaseChecklist
          fase="fase_5"
          config={FASE_5_CONFIG}
          data={workflow.fase_5}
          postpack={{
            id: workflow.postpack_id,
            title: '',
            objective: '',
            format: '',
            status: '',
          }}
          onItemChange={() => {}}
          onAvancar={handleAvancar}
          onVoltar={() => router.push(`/workflow/${workflow.id}/fase-4`)}
          podeAvancar={true}
          onOpenModal={(id) =>
            setModalItem(FASE_5_CONFIG.items.find((i) => i.id === id) || null)
          }
        />

        {/* Seção de Métricas */}
        <div className="max-w-4xl mx-auto p-6 mt-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 Métricas de Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Impressões
              </label>
              <input
                type="number"
                min="0"
                value={metricas.impressoes}
                onChange={(e) => setMetricas({ ...metricas, impressoes: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alcance
              </label>
              <input
                type="number"
                min="0"
                value={metricas.alcance}
                onChange={(e) => setMetricas({ ...metricas, alcance: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Engajamento (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={metricas.engajamento}
                onChange={(e) => setMetricas({ ...metricas, engajamento: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Likes
              </label>
              <input
                type="number"
                min="0"
                value={metricas.likes}
                onChange={(e) => setMetricas({ ...metricas, likes: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentários
              </label>
              <input
                type="number"
                min="0"
                value={metricas.comentarios}
                onChange={(e) => setMetricas({ ...metricas, comentarios: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salvamentos
              </label>
              <input
                type="number"
                min="0"
                value={metricas.salvamentos}
                onChange={(e) => setMetricas({ ...metricas, salvamentos: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={handleSaveMetrics}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            🎉 Finalizar Workflow e Salvar Métricas
          </button>
        </div>
      </div>
      <ConfirmacaoModal
        isOpen={!!modalItem}
        onClose={() => setModalItem(null)}
        onConfirm={handleConfirm}
        item={modalItem}
      />
      <AlertaContinuarModal
        isOpen={showAlerta}
        onClose={() => setShowAlerta(false)}
        onVoltar={() => setShowAlerta(false)}
        onContinuar={handleContinuar}
        itensPendentes={pendentes}
        fase="fase_5"
      />
    </div>
  );
}
