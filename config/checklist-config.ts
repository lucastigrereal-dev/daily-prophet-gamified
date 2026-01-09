// Configuração das 5 Fases do Workflow
import { FaseConfig, FaseNumero } from '@/types/workflow';

export const FASE_1_CONFIG: FaseConfig = {
  nome: 'Criacao',
  icone: '1',
  descricao: 'Geracao automatica do conteudo',
  items: [
    { id: 'roteiro_gerado', label: 'Roteiro gerado pela IA', obrigatorio: true },
    { id: 'imagens_geradas', label: 'Imagens/referencias geradas', obrigatorio: true },
    { id: 'hashtags_definidas', label: 'Hashtags definidas', obrigatorio: true },
    { id: 'horario_definido', label: 'Horario de publicacao definido', obrigatorio: false },
  ],
};

export const FASE_2_CONFIG: FaseConfig = {
  nome: 'Aprovacao',
  icone: '2',
  descricao: 'Validacao pela Dra. Karina',
  items: [
    { id: 'roteiro_revisado', label: 'Roteiro revisado e aprovado', obrigatorio: true },
    { id: 'conteudo_medico_validado', label: 'Conteudo medico validado', obrigatorio: true },
    { id: 'tom_comunicacao_ok', label: 'Tom de comunicacao adequado', obrigatorio: true },
    { id: 'ajustes_solicitados', label: 'Ajustes solicitados (se houver)', obrigatorio: false },
  ],
};

export const FASE_3_CONFIG: FaseConfig = {
  nome: 'Producao',
  icone: '3',
  descricao: 'Gravacao e edicao do video',
  items: [
    { id: 'video_gravado', label: 'Video gravado', obrigatorio: true },
    { id: 'video_editado', label: 'Video editado', obrigatorio: true },
    { id: 'legenda_adicionada', label: 'Legenda/texto adicionado', obrigatorio: true },
    { id: 'thumbnail_criada', label: 'Thumbnail/capa criada', obrigatorio: false },
    { id: 'audio_ajustado', label: 'Audio ajustado', obrigatorio: false },
  ],
};

export const FASE_4_CONFIG: FaseConfig = {
  nome: 'Publicacao',
  icone: '4',
  descricao: 'Postagem no Instagram',
  items: [
    { id: 'post_publicado', label: 'Post publicado no Instagram', obrigatorio: true },
    { id: 'hashtags_aplicadas', label: 'Hashtags aplicadas', obrigatorio: true },
    { id: 'localizacao_adicionada', label: 'Localizacao adicionada', obrigatorio: false },
    { id: 'stories_publicado', label: 'Story de divulgacao publicado', obrigatorio: false },
  ],
};

export const FASE_5_CONFIG: FaseConfig = {
  nome: 'Pos-Post',
  icone: '5',
  descricao: 'Ritual 30min + distribuicao',
  items: [
    { id: 'ritual_30min', label: 'Ritual 30 minutos executado', obrigatorio: true },
    { id: 'comentarios_respondidos', label: 'Comentarios respondidos', obrigatorio: true },
    { id: 'distribuicao_grupos', label: 'Distribuido nos grupos', obrigatorio: true },
    { id: 'metricas_iniciais', label: 'Metricas iniciais coletadas', obrigatorio: false },
  ],
};

export const FASES_CONFIG: Record<FaseNumero, FaseConfig> = {
  fase_1: FASE_1_CONFIG,
  fase_2: FASE_2_CONFIG,
  fase_3: FASE_3_CONFIG,
  fase_4: FASE_4_CONFIG,
  fase_5: FASE_5_CONFIG,
};

export const FASES_ORDEM: FaseNumero[] = ['fase_1', 'fase_2', 'fase_3', 'fase_4', 'fase_5'];

export function getProximaFase(faseAtual: FaseNumero): FaseNumero | null {
  const idx = FASES_ORDEM.indexOf(faseAtual);
  return idx < FASES_ORDEM.length - 1 ? FASES_ORDEM[idx + 1] : null;
}

export function getFaseAnterior(faseAtual: FaseNumero): FaseNumero | null {
  const idx = FASES_ORDEM.indexOf(faseAtual);
  return idx > 0 ? FASES_ORDEM[idx - 1] : null;
}
