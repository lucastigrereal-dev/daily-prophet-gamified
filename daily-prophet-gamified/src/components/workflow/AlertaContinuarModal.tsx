'use client';

import { ChecklistItemConfig, FaseNumero } from '@/types/workflow';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onVoltar: () => void;
  onContinuar: () => void;
  itensPendentes: ChecklistItemConfig[];
  fase: FaseNumero;
}

export function AlertaContinuarModal({
  isOpen,
  onClose,
  onVoltar,
  onContinuar,
  itensPendentes,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 text-center border-b">
          <span className="text-4xl">⚠️</span>
          <h3 className="font-bold mt-2">Itens Pendentes</h3>
        </div>

        <div className="p-4">
          <p className="mb-4">Você está avançando com itens incompletos:</p>
          {itensPendentes.map((item) => (
            <p key={item.id} className="text-red-600 text-sm">
              ❌ {item.label}
            </p>
          ))}
          <p className="mt-4 text-sm text-gray-600">
            💡 Isso pode impactar a performance do post.
          </p>
        </div>

        <div className="p-4 border-t space-y-2">
          <button
            onClick={onVoltar}
            className="w-full py-3 border rounded-lg"
          >
            🔙 Voltar e corrigir
          </button>
          <button
            onClick={onContinuar}
            className="w-full py-3 bg-orange-500 text-white rounded-lg"
          >
            ➡️ Continuar mesmo assim
          </button>
        </div>
      </div>
    </div>
  );
}
