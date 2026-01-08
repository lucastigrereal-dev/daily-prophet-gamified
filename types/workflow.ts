// Tipos para PostPack Workflow
// Daily Prophet - Instituto Rodovansky

export type WorkflowStatus = 'fase_1' | 'fase_2' | 'fase_3' | 'fase_4' | 'fase_5' | 'concluido';
export type FaseStatus = 'pendente' | 'em_andamento' | 'concluido' | 'rejeitado';

export interface FaseChecklist {
  [key: string]: boolean;
}

export interface Metricas {
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  reach?: number;
  impressions?: number;
  engagement_rate?: number;
}

export interface PostPackWorkflow {
  id: string;
  postpack_id: string;
  status: WorkflowStatus;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  created_by: string | null;
  approved_by: string | null;
  
  // Fase 1: Criacao
  fase_1_status: FaseStatus;
  fase_1_completed_at: string | null;
  fase_1_checklist: FaseChecklist;
  
  // Fase 2: Revisao
  fase_2_status: FaseStatus;
  fase_2_completed_at: string | null;
  fase_2_checklist: FaseChecklist;
  fase_2_feedback: string | null;
  
  // Fase 3: Aprovacao
  fase_3_status: FaseStatus;
  fase_3_completed_at: string | null;
  fase_3_checklist: FaseChecklist;
  
  // Fase 4: Publicacao
  fase_4_status: FaseStatus;
  fase_4_completed_at: string | null;
  fase_4_checklist: FaseChecklist;
  fase_4_published_url: string | null;
  fase_4_published_at: string | null;
  
  // Fase 5: Metricas
  fase_5_status: FaseStatus;
  fase_5_completed_at: string | null;
  fase_5_checklist: FaseChecklist;
  metricas_24h: Metricas | null;
  metricas_7d: Metricas | null;
  
  notas: string | null;
}

// Tipo para criar novo workflow
export type CreateWorkflow = Pick<PostPackWorkflow, 'postpack_id' | 'created_by'>;

// Tipo para atualizar workflow
export type UpdateWorkflow = Partial<Omit<PostPackWorkflow, 'id' | 'created_at'>>;

// Configuracao das fases
export const FASES_CONFIG = {
  fase_1: {
    nome: 'Criacao',
    descricao: 'Criacao do conteudo do post',
    checklist_padrao: {
      hook_criado: false,
      legenda_escrita: false,
      cta_definido: false,
      hashtags_selecionadas: false,
      imagem_pronta: false,
    }
  },
  fase_2: {
    nome: 'Revisao',
    descricao: 'Revisao e ajustes do conteudo',
    checklist_padrao: {
      ortografia_verificada: false,
      tom_adequado: false,
      cta_efetivo: false,
      hashtags_relevantes: false,
    }
  },
  fase_3: {
    nome: 'Aprovacao',
    descricao: 'Aprovacao final pela Dra. Karina',
    checklist_padrao: {
      conteudo_aprovado: false,
      imagem_aprovada: false,
      data_publicacao_definida: false,
    }
  },
  fase_4: {
    nome: 'Publicacao',
    descricao: 'Publicacao no Instagram',
    checklist_padrao: {
      publicado_instagram: false,
      stories_publicado: false,
      link_salvo: false,
    }
  },
  fase_5: {
    nome: 'Metricas',
    descricao: 'Coleta e analise de metricas',
    checklist_padrao: {
      metricas_24h_coletadas: false,
      metricas_7d_coletadas: false,
      analise_realizada: false,
    }
  }
} as const;
