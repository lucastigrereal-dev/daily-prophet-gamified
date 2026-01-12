// constants/horarios.ts

export const HORARIOS = [
  { horario: '08:50', label: 'Manhã cedo', description: 'Público acordando, alta atenção', icon: '' },
  { horario: '11:50', label: 'Meio-dia', description: 'Pausa do almoço', icon: '??' },
  { horario: '17:50', label: 'Final do dia', description: 'Maior engajamento', icon: '', recomendado: true },
  { horario: '20:50', label: 'Noite', description: 'Relaxamento', icon: '' },
] as const;
