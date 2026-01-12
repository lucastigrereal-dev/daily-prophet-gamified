// config/nota-qualidade.ts
// Pesos para cálculo da nota automática

export const PESOS_NOTA = {
  hookForte: 0.20,        // 20%
  temEEAT: 0.20,          // 20%
  ctaClaro: 0.15,         // 15%
  hashtagsMix: 0.10,      // 10%
  checklistCompleto: 0.20, // 20%
  horarioOtimizado: 0.05, // 5%
  roteiroModelo: 0.10,    // 10%
} as const;

export const NIVEIS_NOTA = [
  { min: 4.5, nivel: 'excelente', label: 'Excelente', cor: 'green' },
  { min: 4.0, nivel: 'muito_bom', label: 'Muito Bom', cor: 'blue' },
  { min: 3.0, nivel: 'bom', label: 'Bom', cor: 'yellow' },
  { min: 2.0, nivel: 'precisa_melhorar', label: 'Precisa Melhorar', cor: 'orange' },
  { min: 0, nivel: 'revisar', label: 'Revisar', cor: 'red' },
] as const;
