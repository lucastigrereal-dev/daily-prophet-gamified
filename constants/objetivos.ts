// constants/objetivos.ts

export const OBJETIVOS = [
  { code: 'autoridade', name: 'Autoridade', icon: '', description: 'Posicionar como especialista' },
  { code: 'educacao', name: 'Educação', icon: '', description: 'Ensinar algo' },
  { code: 'conversao', name: 'Conversão', icon: '', description: 'Gerar leads/vendas' },
  { code: 'alcance', name: 'Alcance', icon: '', description: 'Viralizar' },
  { code: 'comunidade', name: 'Comunidade', icon: '', description: 'Criar vínculo' },
  { code: 'objecoes', name: 'Objeções', icon: '', description: 'Quebrar travas' },
  { code: 'confianca', name: 'Confiança', icon: '?', description: 'Segurança/risco' },
  { code: 'prova_social', name: 'Prova Social', icon: '?', description: 'Resultados/bastidor' },
  { code: 'diferenciacao', name: 'Diferenciação', icon: '', description: 'Por que você' },
  { code: 'aquecimento', name: 'Aquecimento', icon: '', description: 'Pré-venda' },
] as const;

export type ObjetivoCode = typeof OBJETIVOS[number]['code'];
