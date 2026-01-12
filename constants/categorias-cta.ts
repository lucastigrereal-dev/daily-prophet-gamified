// constants/categorias-cta.ts

export const CATEGORIAS_CTA = [
  { code: 'salvamento', name: 'Salvamento', icon: '', objetivo: 'Aumentar saves' },
  { code: 'comentario', name: 'Comentário', icon: '', objetivo: 'Gerar discussão' },
  { code: 'compartilhamento', name: 'Compartilhamento', icon: '', objetivo: 'Viralizar' },
  { code: 'dm', name: 'Direct', icon: '', objetivo: 'Gerar leads' },
  { code: 'link', name: 'Link na Bio', icon: '', objetivo: 'Tráfego externo' },
] as const;

export const INTENSIDADES_CTA = [
  { code: 'suave', name: 'Suave', descricao: 'Convite gentil' },
  { code: 'medio', name: 'Médio', descricao: 'Encorajamento claro' },
  { code: 'direto', name: 'Direto', descricao: 'Comando assertivo' },
] as const;
