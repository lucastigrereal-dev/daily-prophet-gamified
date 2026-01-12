// constants/procedimentos.ts

export const PROCEDIMENTOS = [
  { code: 'intimo_masculino', name: 'Íntimo Masculino', icon: '', keywords: ['intimax', 'peniano', 'masculino'] },
  { code: 'intimo_feminino', name: 'Íntimo Feminino', icon: '', keywords: ['intimo', 'feminino', 'vaginal'] },
  { code: 'gluteo', name: 'Glúteo', icon: '', keywords: ['bumbum', 'gluteo', 'corporal'] },
  { code: 'full_face', name: 'Full Face', icon: '', keywords: ['facial', 'rosto', 'face'] },
  { code: 'tradicionais', name: 'Tradicionais', icon: '', keywords: ['botox', 'preenchimento', 'outros'] },
] as const;

export type ProcedimentoCode = typeof PROCEDIMENTOS[number]['code'];
