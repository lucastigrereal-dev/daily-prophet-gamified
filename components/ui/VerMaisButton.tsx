'use client';

export interface VerMaisButtonProps {
  totalItens: number;
  itensVisiveis: number;
  onClick: () => void;
  loading?: boolean;
}

export function VerMaisButton({ totalItens, itensVisiveis, onClick, loading }: VerMaisButtonProps) {
  const restantes = totalItens - itensVisiveis;
  if (restantes <= 0) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full py-2 text-blue-500 hover:text-blue-400 text-sm disabled:opacity-60"
    >
      {loading ? '⏳ Carregando...' : `+ Ver mais ${restantes} itens...`}
    </button>
  );
}
