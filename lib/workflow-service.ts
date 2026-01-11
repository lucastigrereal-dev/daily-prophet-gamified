import { PostpackWorkflow, PostpackWorkflowRow, Metricas24h, FaseNumero, ChecklistItemData, WorkflowStatus, CreateWorkflowInput, WorkflowFilters } from '@/types/workflow';
import { FASES_CONFIG, getProximaFase } from '@/config/checklist-config';
import { supabaseWorkflow } from './supabase-workflow';
import { createClient } from '@/lib/supabase/client';

export const workflowService = {
  async create(input: CreateWorkflowInput): Promise<PostpackWorkflow> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const row = await supabaseWorkflow.insert({
      postpack_id: input.postpack_id,
      created_by: user?.id,
      status: 'fase_1',
      fase_1_status: 'em_progresso'
    });
    return supabaseWorkflow.rowToWorkflow(row);
  },

  async getById(id: string): Promise<PostpackWorkflow | null> {
    const row = await supabaseWorkflow.selectById(id);
    return row ? supabaseWorkflow.rowToWorkflow(row) : null;
  },

  async getByPostpack(postpackId: string): Promise<PostpackWorkflow | null> {
    const row = await supabaseWorkflow.selectByPostpack(postpackId);
    return row ? supabaseWorkflow.rowToWorkflow(row) : null;
  },

  async list(filters?: WorkflowFilters): Promise<PostpackWorkflow[]> {
    const rows = await supabaseWorkflow.selectMany(filters);
    return rows.map(supabaseWorkflow.rowToWorkflow);
  },

  async update(workflowId: string, data: Partial<PostpackWorkflowRow>): Promise<PostpackWorkflow> {
    const row = await supabaseWorkflow.update(workflowId, data);
    return supabaseWorkflow.rowToWorkflow(row);
  },

  async updateChecklist(workflowId: string, fase: FaseNumero, itemId: string, data: Partial<ChecklistItemData>): Promise<void> {
    const itemData = { ...data, id: itemId, timestamp: new Date().toISOString() };
    await supabaseWorkflow.updateChecklistItem(workflowId, fase, itemId, itemData);
  },

  async updateMetrics(workflowId: string, metricas24h: Metricas24h, metricas7d: Metricas24h): Promise<PostpackWorkflow> {
    const row = await supabaseWorkflow.updateMetrics(workflowId, metricas24h, metricas7d);
    return supabaseWorkflow.rowToWorkflow(row);
  },

  async avancarFase(workflowId: string, force = false): Promise<{ success: boolean; pendentes?: string[] }> {
    const workflow = await this.getById(workflowId);
    if (!workflow) throw new Error('Workflow não encontrado');
    const faseAtual = workflow.status as FaseNumero;
    const config = FASES_CONFIG[faseAtual];
    const checklist = workflow[faseAtual].checklist;
    const pendentes = config.items.filter(item => item.obrigatorio && (!checklist[item.id] || checklist[item.id].status === 'pendente')).map(i => i.id);
    if (pendentes.length > 0 && !force) return { success: false, pendentes };
    if (force && pendentes.length > 0) { for (const itemId of pendentes) { await this.updateChecklist(workflowId, faseAtual, itemId, { status: 'pulado' }); } }
    const proximaFase = getProximaFase(faseAtual);
    const novoStatus = proximaFase || 'concluido';
    await supabaseWorkflow.update(workflowId, { status: novoStatus, [`${faseAtual}_status`]: pendentes.length > 0 ? 'incompleto' : 'concluido', [`${faseAtual}_completed_at`]: new Date().toISOString(), ...(proximaFase ? { [`${proximaFase}_status`]: 'em_progresso' } : { completed_at: new Date().toISOString() }) });
    return { success: true };
  },

  async voltarFase(workflowId: string): Promise<void> {
    const workflow = await this.getById(workflowId);
    if (!workflow) throw new Error('Workflow não encontrado');
    const faseAtual = workflow.status as FaseNumero;
    const idx = ['fase_1','fase_2','fase_3','fase_4','fase_5'].indexOf(faseAtual);
    if (idx > 0) { const faseAnterior = ['fase_1','fase_2','fase_3','fase_4','fase_5'][idx - 1]; await supabaseWorkflow.update(workflowId, { status: faseAnterior, [`${faseAtual}_status`]: 'pendente' } as any); }
  },

  async finalizar(workflowId: string): Promise<void> { await supabaseWorkflow.update(workflowId, { status: 'concluido', completed_at: new Date().toISOString() } as any); },

  async delete(workflowId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('postpack_workflow')
      .delete()
      .eq('id', workflowId);
    if (error) throw error;
  },

  calcularProgresso(checklist: Record<string, ChecklistItemData>, fase: FaseNumero): number {
    const config = FASES_CONFIG[fase];
    const obrigatorios = config.items.filter(i => i.obrigatorio);
    const concluidos = obrigatorios.filter(i => checklist[i.id]?.status === 'concluido' || checklist[i.id]?.status === 'pulado').length;
    return Math.round((concluidos / obrigatorios.length) * 100);
  }
};
