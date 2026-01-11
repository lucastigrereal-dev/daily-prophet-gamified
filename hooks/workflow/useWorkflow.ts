'use client';
import { useState, useEffect, useCallback } from 'react';
import { PostpackWorkflow, PostpackResumo, FaseNumero, ChecklistItemData, ChecklistItemConfig } from '@/types/workflow';
import { workflowService } from '@/lib/workflow-service';
import { FASES_CONFIG } from '@/config/checklist-config';

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
    return workflowService.calcularProgresso(workflow[fase].checklist, fase);
  }, [workflow]);

  const canAdvance = useCallback((fase: FaseNumero): boolean => {
    if (!workflow) return false;
    const config = FASES_CONFIG[fase];
    const checklist = workflow[fase].checklist;
    return config.items.filter(i => i.obrigatorio).every(i => checklist[i.id]?.status === 'concluido' || checklist[i.id]?.status === 'pulado');
  }, [workflow]);

  const getItensPendentes = useCallback((fase: FaseNumero): ChecklistItemConfig[] => {
    if (!workflow) return [];
    const config = FASES_CONFIG[fase];
    const checklist = workflow[fase].checklist;
    return config.items.filter(i => i.obrigatorio && (!checklist[i.id] || checklist[i.id].status === 'pendente'));
  }, [workflow]);

  return { workflow, postpack, loading, error, updateChecklist, avancarFase, voltarFase, finalizarWorkflow, getCurrentFase, getFaseProgress, canAdvance, getItensPendentes };
}
