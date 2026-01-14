// API de Workflow - CRUD Operations
// Daily Prophet - Instituto Rodovansky

import { supabase } from './supabase';
import type {
  PostpackWorkflowRow,
  CreateWorkflowInput,
  WorkflowStatus,
  FaseStatus
} from '../types/workflow';

// Type para updates parciais do workflow
type UpdateWorkflow = Partial<Omit<PostpackWorkflowRow, 'id' | 'created_at'>>;

// ============ READ ============

// Buscar todos os workflows
export async function getWorkflows() {
  const { data, error } = await supabase
    .from('postpack_workflow')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as PostpackWorkflowRow[];
}

// Buscar workflow por ID
export async function getWorkflowById(id: string) {
  const { data, error } = await supabase
    .from('postpack_workflow')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as PostpackWorkflowRow;
}

// Buscar workflow por postpack_id
export async function getWorkflowByPostPackId(postpackId: string) {
  const { data, error } = await supabase
    .from('postpack_workflow')
    .select('*')
    .eq('postpack_id', postpackId)
    .single();

  if (error) throw error;
  return data as PostpackWorkflowRow;
}

// Buscar workflows por status
export async function getWorkflowsByStatus(status: WorkflowStatus) {
  const { data, error } = await supabase
    .from('postpack_workflow')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as PostpackWorkflowRow[];
}

// ============ CREATE ============

// Criar novo workflow
export async function createWorkflow(workflow: CreateWorkflowInput) {
  const { data, error } = await supabase
    .from('postpack_workflow')
    .insert([{
      postpack_id: workflow.postpack_id,
      created_by: workflow.created_by,
      status: 'fase_1',
      fase_1_status: 'em_progresso',
    }])
    .select()
    .single();

  if (error) throw error;
  return data as PostpackWorkflowRow;
}

// ============ UPDATE ============

// Atualizar workflow
export async function updateWorkflow(id: string, updates: UpdateWorkflow) {
  const { data, error } = await supabase
    .from('postpack_workflow')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as PostpackWorkflowRow;
}

// Avancar para proxima fase
export async function avancarFase(id: string, faseAtual: number) {
  const proximaFase = faseAtual + 1;
  const faseKey = `fase_${faseAtual}` as const;
  const proximaFaseKey = `fase_${proximaFase}` as const;

  const updates: Record<string, unknown> = {
    [`${faseKey}_status`]: 'concluido',
    [`${faseKey}_completed_at`]: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (proximaFase <= 5) {
    updates.status = proximaFaseKey;
    updates[`${proximaFaseKey}_status`] = 'em_progresso';
  } else {
    updates.status = 'concluido';
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('postpack_workflow')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as PostpackWorkflowRow;
}

// Atualizar checklist de uma fase
export async function updateChecklist(
  id: string,
  fase: number,
  checklist: Record<string, boolean>
) {
  const faseKey = `fase_${fase}_checklist`;

  const { data, error } = await supabase
    .from('postpack_workflow')
    .update({
      [faseKey]: checklist,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as PostpackWorkflowRow;
}

// Atualizar status de uma fase
export async function updateFaseStatus(
  id: string,
  fase: number,
  status: FaseStatus
) {
  const faseKey = `fase_${fase}_status`;

  const updates: Record<string, unknown> = {
    [faseKey]: status,
    updated_at: new Date().toISOString(),
  };

  if (status === 'concluido') {
    updates[`fase_${fase}_completed_at`] = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('postpack_workflow')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as PostpackWorkflowRow;
}

// Salvar metricas
export async function salvarMetricas(
  id: string,
  tipo: '24h' | '7d',
  metricas: Record<string, number>
) {
  const metricasKey = tipo === '24h' ? 'metricas_24h' : 'metricas_7d';

  const { data, error } = await supabase
    .from('postpack_workflow')
    .update({
      [metricasKey]: metricas,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as PostpackWorkflowRow;
}

// ============ DELETE ============

// Deletar workflow
export async function deleteWorkflow(id: string) {
  const { error } = await supabase
    .from('postpack_workflow')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// ============ STATS ============

// Obter estatisticas de workflows
export async function getWorkflowStats() {
  const { data, error } = await supabase
    .from('postpack_workflow')
    .select('status');

  if (error) throw error;

  const stats = {
    total: data.length,
    composicao: 0,
    fase_1: 0,
    fase_2: 0,
    fase_3: 0,
    fase_4: 0,
    fase_5: 0,
    concluido: 0,
  };

  data.forEach((item) => {
    const status = item.status as WorkflowStatus;
    if (status in stats) {
      (stats as any)[status]++;
    }
  });

  return stats;
}