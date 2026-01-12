// constants/formatos.ts

export const FORMATOS = [
  { code: 'reels', name: 'Reels', icon: '', description: 'Vídeo curto vertical', duracao: '60-90s' },
  { code: 'carrossel', name: 'Carrossel', icon: '', description: 'Slides deslizáveis', duracao: '5-10 slides' },
  { code: 'stories', name: 'Stories', icon: '', description: 'Conteúdo 24h', duracao: '3-8 stories' },
  { code: 'foto', name: 'Foto', icon: '?', description: 'Imagem estática', duracao: 'Single' },
] as const;

export type FormatoCode = typeof FORMATOS[number]['code'];
