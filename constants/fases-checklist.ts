// constants/fases-checklist.ts

export const FASES_CHECKLIST = [
  { code: 'pre_producao', name: 'Pré-Produção', icon: '', ordem: 1 },
  { code: 'gravacao', name: 'Gravação', icon: '', ordem: 2 },
  { code: 'edicao', name: 'Edição', icon: '??', ordem: 3 },
  { code: 'publicacao', name: 'Publicação', icon: '', ordem: 4 },
  { code: 'pos_publicacao', name: 'Pós-Publicação', icon: '', ordem: 5 },
] as const;

export type FaseCode = typeof FASES_CHECKLIST[number]['code'];
