'use client';
import { useState, useEffect, useCallback } from 'react';
import { PostpackWorkflow, PostpackResumo, FaseNumero, ChecklistItemData, ChecklistItemConfig, WorkflowComposicao } from '@/types/workflow';
import { workflowService } from '@/lib/workflow-service';
import { FASES_CONFIG } from '@/config/checklist-config';

const VALID_STORIES_STRATEGIES = ['teaser', 'behind_the_scenes', 'tutorial', 'q_and_a', 'promocao', 'outro'];

export function useWorkflow(workflowId: string) {
  const [workflow, setWorkflow] = useState<PostpackWorkflow | null>(null);
  const [postpack, setPostpack] = useState<PostpackResumo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (workflowId) {
      setLoading(true);
      workflowService.getById(workflowId)
        .then(wf => { setWorkflow(wf); setPostpack(wf ? { id: wf.postpack_id, title: '', objective: '', format: '', status: '' } : null); })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [workflowId]);

  const updateChecklist = useCallback(async (fase: FaseNumero, itemId: string, data: Partial<ChecklistItemData>) => {
    if (!workflow) return;
    await workflowService.updateChecklist(workflow.id, fase, itemId, data);
    setWorkflow(await workflowService.getById(workflow.id));
  }, [workflow]);

  const avancarFase = useCallback(async (force = false) => {
    if (!workflow) return false;
    const result = await workflowService.avancarFase(workflow.id, force);
    if (result.success) setWorkflow(await workflowService.getById(workflow.id));
    return result.success;
  }, [workflow]);

  const voltarFase = useCallback(async () => {
    if (!workflow) return;
    await workflowService.voltarFase(workflow.id);
    setWorkflow(await workflowService.getById(workflow.id));
  }, [workflow]);

  const finalizarWorkflow = useCallback(async () => {
    if (!workflow) return;
    await workflowService.finalizar(workflow.id);
    setWorkflow(await workflowService.getById(workflow.id));
  }, [workflow]);

  const getCurrentFase = useCallback((): FaseNumero => (workflow?.status as FaseNumero) || 'fase_1', [workflow]);

  const getFaseProgress = useCallback((fase: FaseNumero): number => {
    if (!workflow) return 0;
    if (fase === 'composicao') return 100;
    const faseData = workflow[fase];
    if (!('checklist' in faseData)) return 0;
    return workflowService.calcularProgresso(faseData.checklist, fase);
  }, [workflow]);

  const canAdvance = useCallback((fase: FaseNumero): boolean => {
    if (!workflow) return false;
    if (fase === 'composicao') return true;
    const config = FASES_CONFIG[fase];
    const faseData = workflow[fase];
    if (!('checklist' in faseData)) return true;
    const checklist = faseData.checklist;
    return config.items.filter(i => i.obrigatorio).every(i => checklist[i.id]?.status === 'concluido' || checklist[i.id]?.status === 'pulado');
  }, [workflow]);

  const getItensPendentes = useCallback((fase: FaseNumero): ChecklistItemConfig[] => {
    if (!workflow) return [];
    if (fase === 'composicao') return [];
    const config = FASES_CONFIG[fase];
    const faseData = workflow[fase];
    if (!('checklist' in faseData)) return [];
    const checklist = faseData.checklist;
    return config.items.filter(i => i.obrigatorio && (!checklist[i.id] || checklist[i.id].status === 'pendente'));
  }, [workflow]);

  const updateComposicao = useCallback(async (composicao: Partial<WorkflowComposicao>) => {
    if (!workflow) return;
    const novaComposicao = { ...workflow.composicao, ...composicao };
    await workflowService.updateComposicao(workflow.id, novaComposicao);
    setWorkflow(await workflowService.getById(workflow.id));
  }, [workflow]);

  const updateReels = useCallback(async (data: { montarScript: boolean; script?: string }) => {
    if (!workflow) return;
    if (typeof data.montarScript !== 'boolean') throw new Error('montarScript deve ser boolean');
    await updateComposicao({ reels: data });
  }, [workflow, updateComposicao]);

  const updateCarrossel = useCallback(async (data: { tema: string; textosGerados?: string[] }) => {
    if (!workflow) return;
    if (!data.tema || data.tema.length < 10) throw new Error('Tema deve ter no mínimo 10 caracteres');
    await updateComposicao({ carrossel: data });
  }, [workflow, updateComposicao]);

  const updateStories = useCallback(async (data: { estrategia: string; exemplos?: any[] }) => {
    if (!workflow) return;
    if (!VALID_STORIES_STRATEGIES.includes(data.estrategia)) {
      throw new Error(`Estratégia deve ser uma de: ${VALID_STORIES_STRATEGIES.join(', ')}`);
    }
    await updateComposicao({ stories: data });
  }, [workflow, updateComposicao]);

  const isComposicaoCompleta = useCallback((): boolean => {
    if (!workflow?.composicao) return false;
    const { reels, carrossel, stories } = workflow.composicao;
    return !!(
      reels?.montarScript !== undefined &&
      carrossel?.tema &&
      stories?.estrategia &&
      VALID_STORIES_STRATEGIES.includes(stories.estrategia)
    );
  }, [workflow]);

  return {
    workflow,
    postpack,
    loading,
    error,
    updateChecklist,
    avancarFase,
    voltarFase,
    finalizarWorkflow,
    getCurrentFase,
    getFaseProgress,
    canAdvance,
    getItensPendentes,
    updateComposicao,
    updateReels,
    updateCarrossel,
    updateStories,
    isComposicaoCompleta
  };
}
