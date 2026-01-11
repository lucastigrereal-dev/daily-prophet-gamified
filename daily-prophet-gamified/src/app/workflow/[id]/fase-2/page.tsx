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
import { FASE_2_CONFIG } from '@/config/checklist-config';
import { useToast } from '@/hooks/useToast';
import LoadingPage from '@/components/ui/LoadingPage';

export default function Fase2Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { success, error } = useToast();
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
    try {
      await workflowService.updateChecklist(workflow.id, 'fase_2', modalItem.id, {
        status: 'concluido',
        observacao: obs,
      });
      setWorkflow(await workflowService.getById(workflow.id));
      success('Checklist salvo com sucesso!');
      setModalItem(null);
    } catch (err) {
      error('Erro ao salvar checklist');
    }
  };

  const handleAvancar = async () => {
    if (!workflow) return;
    try {
      const result = await workflowService.avancarFase(workflow.id, false);
      if (!result.success && result.pendentes) {
        setPendentes(
          FASE_2_CONFIG.items.filter((i) => result.pendentes!.includes(i.id))
        );
        setShowAlerta(true);
      } else {
        success('✓ Avançado para Fase 3!');
        router.push(`/workflow/${workflow.id}/fase-3`);
      }
    } catch (err) {
      error('Erro ao avançar de fase');
    }
  };

  const handleContinuar = async () => {
    if (!workflow) return;
    try {
      await workflowService.avancarFase(workflow.id, true);
      success('✓ Avançado para Fase 3!');
      router.push(`/workflow/${workflow.id}/fase-3`);
    } catch (err) {
      error('Erro ao avançar de fase');
    }
  };

  if (!workflow) return <LoadingPage message="Carregando workflow..." />;

  return (
    <div className="min-h-screen flex flex-col">
      <WorkflowStepper currentFase="fase_2" workflow={workflow} />
      <div className="flex-1">
        <FaseChecklist
          fase="fase_2"
          config={FASE_2_CONFIG}
          data={workflow.fase_2}
          postpack={{
            id: workflow.postpack_id,
            title: '',
            objective: '',
            format: '',
            status: '',
          }}
          onItemChange={() => {}}
          onAvancar={handleAvancar}
          onVoltar={() => router.push(`/workflow/${workflow.id}/fase-1`)}
          podeAvancar={true}
          onOpenModal={(id) =>
            setModalItem(FASE_2_CONFIG.items.find((i) => i.id === id) || null)
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
        fase="fase_2"
      />
    </div>
  );
}
