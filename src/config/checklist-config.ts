import { FaseConfig, FaseNumero } from '@/types/workflow';

export const FASE_1_CONFIG: FaseConfig = { numero: 'fase_1', nome: 'Criação', descricao: 'Geração do PostPack', icone: '✏️', items: [
  { id: 'hook_gerado', label: 'Hook gerado', descricao: 'Texto de abertura 3 segundos', obrigatorio: true, automatico: true },
  { id: 'roteiro_gerado', label: 'Roteiro com keywords SEO', descricao: 'Roteiro completo', obrigatorio: true, automatico: true },
  { id: 'legenda_seo', label: 'Legenda SEO', descricao: 'Legenda otimizada', obrigatorio: true, automatico: true },
  { id: 'cta_definido', label: 'CTA definido', descricao: 'Chamada para ação', obrigatorio: true, automatico: true },
  { id: 'hashtags_geradas', label: 'Hashtags (5-8)', descricao: 'Combo hashtags', obrigatorio: true, automatico: true },
  { id: 'horario_definido', label: 'Horário postagem', descricao: '08:50, 11:50, 18:50 ou 20:50', obrigatorio: true, automatico: true },
]};

export const FASE_2_CONFIG: FaseConfig = { numero: 'fase_2', nome: 'Aprovação', descricao: 'Validação Dra. Karina', icone: '✅', items: [
  { id: 'hook_aprovado', label: 'Hook aprovado', descricao: 'Texto adequado?', obrigatorio: true, automatico: false, permiteReprovar: true, campoFeedback: true, mostrarConteudo: true },
  { id: 'roteiro_aprovado', label: 'Roteiro aprovado', descricao: 'Roteiro correto?', obrigatorio: true, automatico: false, permiteReprovar: true, campoFeedback: true, mostrarConteudo: true },
  { id: 'legenda_aprovada', label: 'Legenda aprovada', descricao: 'Legenda adequada?', obrigatorio: true, automatico: false, permiteReprovar: true, campoFeedback: true, mostrarConteudo: true },
  { id: 'cta_aprovado', label: 'CTA aprovado', descricao: 'CTA correto?', obrigatorio: true, automatico: false, permiteReprovar: true, campoFeedback: true, mostrarConteudo: true },
  { id: 'hashtags_aprovadas', label: 'Hashtags aprovadas', descricao: 'Hashtags adequadas?', obrigatorio: true, automatico: false, permiteReprovar: true, campoFeedback: true, mostrarConteudo: true },
]};

export const FASE_3_CONFIG: FaseConfig = { numero: 'fase_3', nome: 'Produção', descricao: 'Gravação e edição', icone: '🎬', items: [
  { id: 'video_gravado', label: 'Vídeo gravado', descricao: 'Seguindo roteiro', obrigatorio: true, automatico: false },
  { id: 'edicao_feita', label: 'Edição feita', descricao: 'Cortes e transições', obrigatorio: true, automatico: false },
  { id: 'texto_na_tela', label: 'Texto na tela', descricao: 'Textos inseridos', obrigatorio: true, automatico: false, mostrarConteudo: true, botaoCopiar: true },
  { id: 'video_exportado', label: 'Vídeo exportado', descricao: 'Pronto para upload', obrigatorio: true, automatico: false },
]};

export const FASE_4_CONFIG: FaseConfig = { numero: 'fase_4', nome: 'Publicação', descricao: 'Publicar no Instagram', icone: '📱', items: [
  { id: 'editor_nativo_ig', label: 'Editor nativo IG', descricao: 'Passou pelo editor', obrigatorio: true, automatico: false },
  { id: 'audio_trending', label: 'Áudio trending', descricao: 'Áudio em alta', obrigatorio: false, automatico: false, permiteNA: true },
  { id: 'legenda_colada', label: 'Legenda colada', descricao: 'Do PostPack', obrigatorio: true, automatico: false, mostrarConteudo: true, botaoCopiar: true },
  { id: 'hashtags_adicionadas', label: 'Hashtags adicionadas', descricao: 'Na legenda', obrigatorio: true, automatico: false, mostrarConteudo: true, botaoCopiar: true },
  { id: 'collab_ativada', label: 'Collab ativada', descricao: 'Se aplicável', obrigatorio: false, automatico: false, permiteNA: true },
  { id: 'publicado', label: 'PUBLICADO', descricao: 'No horário', obrigatorio: true, automatico: false, campoURL: true },
]};

export const FASE_5_CONFIG: FaseConfig = { numero: 'fase_5', nome: 'Pós-Post', descricao: 'Ritual 30min + Distribuição', icone: '🔥', items: [
  { id: 'dms_enviadas', label: '20 DMs enviadas', descricao: 'Direct engajados', obrigatorio: true, automatico: false, grupo: 'Ritual 30 min', campoQuantidade: true },
  { id: 'comentarios_respondidos', label: 'Comentários respondidos', descricao: 'Com perguntas', obrigatorio: true, automatico: false, grupo: 'Ritual 30 min' },
  { id: 'paginas_parceiras_curtiu', label: 'Curtiu parceiros', descricao: 'Outras contas', obrigatorio: true, automatico: false, grupo: 'Ritual 30 min' },
  { id: 'paginas_parceiras_compartilhou', label: 'Compartilhou parceiros', descricao: 'Cruzado', obrigatorio: true, automatico: false, grupo: 'Ritual 30 min' },
  { id: 'paginas_parceiras_salvou', label: 'Salvou parceiros', descricao: 'Boost', obrigatorio: true, automatico: false, grupo: 'Ritual 30 min' },
  { id: 'stories_repostado', label: 'Stories 30min', descricao: 'Segunda vida', obrigatorio: true, automatico: false, grupo: 'Distribuição' },
  { id: 'grupo_whatsapp', label: 'WhatsApp', descricao: 'Grupo divulgação', obrigatorio: true, automatico: false, grupo: 'Distribuição' },
  { id: 'canal_instagram', label: 'Canal IG', descricao: 'Broadcast', obrigatorio: true, automatico: false, grupo: 'Distribuição' },
  { id: 'telegram', label: 'Telegram', descricao: 'Grupo/canal', obrigatorio: true, automatico: false, grupo: 'Distribuição' },
]};

export const FASES_CONFIG: Record<FaseNumero, FaseConfig> = { fase_1: FASE_1_CONFIG, fase_2: FASE_2_CONFIG, fase_3: FASE_3_CONFIG, fase_4: FASE_4_CONFIG, fase_5: FASE_5_CONFIG };
export const FASES_ORDEM: FaseNumero[] = ['fase_1', 'fase_2', 'fase_3', 'fase_4', 'fase_5'];
export const getFaseConfig = (fase: FaseNumero): FaseConfig => FASES_CONFIG[fase];
export const getProximaFase = (atual: FaseNumero): FaseNumero | null => { const i = FASES_ORDEM.indexOf(atual); return i === -1 || i === 4 ? null : FASES_ORDEM[i + 1]; };
export const getFaseAnterior = (atual: FaseNumero): FaseNumero | null => { const i = FASES_ORDEM.indexOf(atual); return i <= 0 ? null : FASES_ORDEM[i - 1]; };
