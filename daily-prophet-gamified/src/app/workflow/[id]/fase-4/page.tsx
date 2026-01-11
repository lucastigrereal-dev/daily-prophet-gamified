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
import { FASE_4_CONFIG } from '@/config/checklist-config';
import { useToast } from '@/hooks/useToast';
import LoadingPage from '@/components/ui/LoadingPage';
import { validateUrl } from '@/lib/validations';

export default function Fase4Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { success, error: showError } = useToast();
  const [workflow, setWorkflow] = useState<PostpackWorkflow | null>(null);
  const [modalItem, setModalItem] = useState<ChecklistItemConfig | null>(null);
  const [showAlerta, setShowAlerta] = useState(false);
  const [pendentes, setPendentes] = useState<ChecklistItemConfig[]>([]);
  const [publishUrl, setPublishUrl] = useState('');
  const id = params?.id;

  useEffect(() => {
    if (id) workflowService.getById(id).then(setWorkflow);
  }, [id]);

  const handleConfirm = async (obs?: string) => {
    if (!workflow || !modalItem) return;
    await workflowService.updateChecklist(workflow.id, 'fase_4', modalItem.id, {
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
        FASE_4_CONFIG.items.filter((i) => result.pendentes!.includes(i.id))
      );
      setShowAlerta(true);
    } else {
      router.push(`/workflow/${workflow.id}/fase-5`);
    }
  };

  const handleContinuar = async () => {
    if (!workflow) return;
    await workflowService.avancarFase(workflow.id, true);
    router.push(`/workflow/${workflow.id}/fase-5`);
  };

  const handleSavePublishUrl = async () => {
    if (!workflow) return;

    const error = validateUrl(publishUrl);
    if (error) {
      showError(error);
      return;
    }

    try {
      await workflowService.update(workflow.id, {
        fase_4_published_url: publishUrl,
        fase_4_published_at: new Date().toISOString(),
      });
      setWorkflow(await workflowService.getById(workflow.id));
      success('✓ URL de publicação salva!');
    } catch (err) {
      showError('Erro ao salvar URL');
    }
  };

  if (!workflow) return <LoadingPage />;

  return (
    <div className="min-h-screen flex flex-col">
      <WorkflowStepper currentFase="fase_4" workflow={workflow} />
      <div className="flex-1">
        <div className="max-w-4xl mx-auto p-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">URL de Publicação</h2>
            <div className="space-y-4">
              <input
                type="url"
                value={publishUrl}
                onChange={(e) => setPublishUrl(e.target.value)}
                placeholder="https://instagram.com/p/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSavePublishUrl}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar URL de Publicação
              </button>
            </div>
          </div>
        </div>
        <FaseChecklist
          fase="fase_4"
          config={FASE_4_CONFIG}
          data={workflow.fase_4}
          postpack={{
            id: workflow.postpack_id,
            title: '',
            objective: '',
            format: '',
            status: '',
          }}
          onItemChange={() => {}}
          onAvancar={handleAvancar}
          onVoltar={() => router.push(`/workflow/${workflow.id}/fase-3`)}
          podeAvancar={true}
          onOpenModal={(id) =>
            setModalItem(FASE_4_CONFIG.items.find((i) => i.id === id) || null)
          }
        />
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
        fase="fase_4"
      />
    </div>
  );
}
