// constants/etapas-montador.ts

export const ETAPAS_MONTADOR = [
  { numero: 1, nome: 'Formato', obrigatoria: true, formatos: ['reels', 'carrossel', 'stories', 'foto'] },
  { numero: 2, nome: 'Objetivo', obrigatoria: true, formatos: ['reels', 'carrossel', 'stories', 'foto'] },
  { numero: 3, nome: 'Procedimento', obrigatoria: true, formatos: ['reels', 'carrossel', 'stories', 'foto'] },
  { numero: 4, nome: 'Ideia', obrigatoria: true, formatos: ['reels', 'carrossel', 'stories', 'foto'] },
  { numero: 5, nome: 'Gancho', obrigatoria: true, formatos: ['reels', 'carrossel', 'stories', 'foto'] },
  { numero: 6, nome: 'Roteiro', obrigatoria: true, formatos: ['reels', 'stories'] }, // só pra vídeo
  { numero: 7, nome: 'Legenda', obrigatoria: true, formatos: ['reels', 'carrossel', 'stories', 'foto'] },
  { numero: 8, nome: 'CTA', obrigatoria: true, formatos: ['reels', 'carrossel', 'stories', 'foto'] },
  { numero: 9, nome: 'Hashtags', obrigatoria: true, formatos: ['reels', 'carrossel', 'foto'] },
  { numero: 10, nome: 'Horário', obrigatoria: true, formatos: ['reels', 'carrossel', 'stories', 'foto'] },
  { numero: 11, nome: 'Checklist', obrigatoria: true, formatos: ['reels', 'carrossel', 'stories', 'foto'] },
  { numero: 12, nome: 'PostPack', obrigatoria: true, formatos: ['reels', 'carrossel', 'stories', 'foto'] },
  { numero: 13, nome: 'Métricas', obrigatoria: false, formatos: ['reels', 'carrossel', 'stories', 'foto'] },
] as const;
