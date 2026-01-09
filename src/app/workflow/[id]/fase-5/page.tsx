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

export default function Fase5Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [workflow, setWorkflow] = useState<PostpackWorkflow | null>(null);
  const [modalItem, setModalItem] = useState<ChecklistItemConfig | null>(null);
  const [showAlerta, setShowAlerta] = useState(false);
  const [pendentes, setPendentes] = useState<ChecklistItemConfig[]>([]);
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

  if (!workflow) return <div className="p-4">Carregando...</div>;

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
