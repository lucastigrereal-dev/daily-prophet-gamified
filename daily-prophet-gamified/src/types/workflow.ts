// Tipos do Sistema de Workflow de 5 Fases

export type FaseNumero = 'fase_1' | 'fase_2' | 'fase_3' | 'fase_4' | 'fase_5';
export type WorkflowStatus = FaseNumero | 'concluido';
export type FaseStatus = 'pendente' | 'em_progresso' | 'concluido' | 'incompleto';
export type ChecklistItemStatus = 'pendente' | 'concluido' | 'pulado' | 'na';

// Interface completa do Postpack para binding
export interface Postpack {
  id: string;
  title: string;
  objective: string;
  format: string;
  status: string;
  content?: any;
  created_at?: string;
  updated_at?: string;
}

// Alias para compatibilidade
export type PostpackResumo = Postpack;

export interface Metricas24h {
  views?: number;
  likes?: number;
  saves?: number;
  comments?: number;
  shares?: number;
}

export interface ChecklistItemData {
  id: string;
  status: ChecklistItemStatus;
  observacao?: string;
  timestamp?: string;
}

export interface ChecklistItemConfig {
  id: string;
  label: string;
  descricao?: string;
  obrigatorio: boolean;
  tipo?: 'checkbox' | 'texto' | 'arquivo' | 'link';
  botaoCopiar?: boolean;
  conteudoDinamico?: string;
}

export interface FaseConfig {
  nome: string;
  icone: string;
  descricao: string;
  items: ChecklistItemConfig[];
}

export interface FaseData {
  status: FaseStatus;
  checklist: Record<string, ChecklistItemData>;
  started_at?: string;
  completed_at?: string;
  feedback?: string;
}

export interface PostpackWorkflow {
  id: string;
  postpack_id: string;
  postpack?: Postpack; // Dados completos do postpack (JOIN)
  status: WorkflowStatus;
  created_by?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  published_url?: string;
  published_at?: string;
  metricas_24h?: Metricas24h;
  metricas_7d?: Metricas24h;
  notas?: string;
  fase_1: FaseData;
  fase_2: FaseData;
  fase_3: FaseData;
  fase_4: FaseData;
  fase_5: FaseData;
}

export interface PostpackWorkflowRow {
  id: string;
  postpack_id: string;
  postpacks?: Postpack; // JOIN result (Supabase retorna singular)
  status: string;
  created_by?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  notas?: string;
  metricas_24h?: Metricas24h;
  metricas_7d?: Metricas24h;
  fase_1_status: string;
  fase_1_checklist: Record<string, ChecklistItemData>;
  fase_1_started_at?: string;
  fase_1_completed_at?: string;
  fase_2_status: string;
  fase_2_checklist: Record<string, ChecklistItemData>;
  fase_2_started_at?: string;
  fase_2_completed_at?: string;
  fase_2_feedback?: string;
  fase_3_status: string;
  fase_3_checklist: Record<string, ChecklistItemData>;
  fase_3_started_at?: string;
  fase_3_completed_at?: string;
  fase_4_status: string;
  fase_4_checklist: Record<string, ChecklistItemData>;
  fase_4_started_at?: string;
  fase_4_completed_at?: string;
  fase_4_published_url?: string;
  fase_4_published_at?: string;
  fase_5_status: string;
  fase_5_checklist: Record<string, ChecklistItemData>;
  fase_5_started_at?: string;
  fase_5_completed_at?: string;
}

export interface CreateWorkflowInput {
  postpack_id: string;
  created_by?: string;
}

export interface WorkflowFilters {
  status?: WorkflowStatus[];
  postpack_id?: string;
  created_by?: string;
  created_after?: string;
  created_before?: string;
  limit?: number;
}
