import { createClient } from '@/lib/supabase/client';
import {
  PostpackWorkflow,
  PostpackWorkflowRow,
  Metricas24h,
  FaseNumero,
  ChecklistItemData,
  WorkflowFilters,
  WorkflowStatus,
  FaseStatus,
} from '@/types/workflow';

const getClient = () => createClient();

export const supabaseWorkflow = {
  async insert(data: Partial<PostpackWorkflowRow>): Promise<PostpackWorkflowRow> {
    const { data: row, error } = await getClient()
      .from('postpack_workflow')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return row;
  },

  async selectById(id: string): Promise<PostpackWorkflowRow | null> {
    const { data, error } = await getClient()
      .from('postpack_workflow')
      .select('*, postpacks(*)')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async selectByPostpack(postpackId: string): Promise<PostpackWorkflowRow | null> {
    const { data, error } = await getClient()
      .from('postpack_workflow')
      .select('*, postpacks(*)')
      .eq('postpack_id', postpackId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async selectMany(filters?: WorkflowFilters): Promise<PostpackWorkflowRow[]> {
    let query = getClient().from('postpack_workflow').select('*, postpacks(*)');
    if (filters?.status) query = query.in('status', filters.status);
    if (filters?.created_after) query = query.gte('created_at', filters.created_after);
    if (filters?.created_before) query = query.lte('created_at', filters.created_before);
    query = query.order('updated_at', { ascending: false });
    if (filters?.limit) query = query.limit(filters.limit);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async update(id: string, data: Partial<PostpackWorkflowRow>): Promise<PostpackWorkflowRow> {
    const { data: row, error } = await getClient()
      .from('postpack_workflow')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return row;
  },

  async updateChecklistItem(
    id: string,
    fase: FaseNumero,
    itemId: string,
    itemData: Partial<ChecklistItemData>
  ): Promise<void> {
    const current = await this.selectById(id);
    if (!current) throw new Error('Workflow nao encontrado');
    const checklistField = `${fase}_checklist` as keyof PostpackWorkflowRow;
    const currentChecklist =
      (current[checklistField] as Record<string, ChecklistItemData>) || {};
    const updatedChecklist = {
      ...currentChecklist,
      [itemId]: { ...currentChecklist[itemId], ...itemData },
    };
    await this.update(id, { [checklistField]: updatedChecklist } as any);
  },

  async updateMetrics(
    id: string,
    metricas24h: Metricas24h,
    metricas7d: Metricas24h
  ): Promise<PostpackWorkflowRow> {
    const current = await this.selectById(id);
    if (!current) throw new Error('Workflow nao encontrado');

    const { data: row, error } = await getClient()
      .from('postpack_workflow')
      .update({ metricas_24h: metricas24h, metricas_7d: metricas7d })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return row;
  },

  rowToWorkflow(row: PostpackWorkflowRow): PostpackWorkflow {
    return {
      id: row.id,
      postpack_id: row.postpack_id,
      postpack: row.postpacks || undefined, // Inclui dados do JOIN
      status: row.status as WorkflowStatus,
      created_at: row.created_at,
      updated_at: row.updated_at,
      completed_at: row.completed_at || undefined,
      created_by: row.created_by || undefined,
      approved_by: row.approved_by || undefined,
      fase_1: {
        status: row.fase_1_status as FaseStatus,
        completed_at: row.fase_1_completed_at || undefined,
        checklist: row.fase_1_checklist || {},
      },
      fase_2: {
        status: row.fase_2_status as FaseStatus,
        completed_at: row.fase_2_completed_at || undefined,
        checklist: row.fase_2_checklist || {},
        feedback: row.fase_2_feedback || undefined,
      },
      fase_3: {
        status: row.fase_3_status as FaseStatus,
        completed_at: row.fase_3_completed_at || undefined,
        checklist: row.fase_3_checklist || {},
      },
      fase_4: {
        status: row.fase_4_status as FaseStatus,
        completed_at: row.fase_4_completed_at || undefined,
        checklist: row.fase_4_checklist || {},
      },
      fase_5: {
        status: row.fase_5_status as FaseStatus,
        completed_at: row.fase_5_completed_at || undefined,
        checklist: row.fase_5_checklist || {},
      },
      published_url: row.fase_4_published_url || undefined,
      published_at: row.fase_4_published_at || undefined,
      metricas_24h: row.metricas_24h || undefined,
      metricas_7d: row.metricas_7d || undefined,
      notas: row.notas || undefined,
    };
  },
};
