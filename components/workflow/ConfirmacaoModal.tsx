'use client';

import { useState } from 'react';
import { ChecklistItemConfig } from '@/types/workflow';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (obs?: string) => void;
  item: ChecklistItemConfig | null;
  conteudo?: string;
}

export function ConfirmacaoModal({
  isOpen,
  onClose,
  onConfirm,
  item,
  conteudo,
}: Props) {
  const [obs, setObs] = useState('');

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-md rounded-none sm:rounded-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-sm sm:text-base">✅ Confirmar</h3>
          <button onClick={onClose} className="min-h-[44px] min-w-[44px] text-center">✕</button>
        </div>

        <div className="p-4">
          <p className="font-medium">{item.label}</p>
          <p className="text-gray-600 text-sm mb-4">{item.descricao}</p>

          {conteudo && (
            <div className="bg-gray-100 p-3 rounded mb-4">
              <p className="text-sm">{conteudo}</p>
              {item.botaoCopiar && (
                <button
                  onClick={() => navigator.clipboard.writeText(conteudo)}
                  className="text-blue-500 text-sm mt-2"
                >
                  📋 Copiar
                </button>
              )}
            </div>
          )}

          <textarea
            placeholder="Observação (opcional)"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            className="w-full border rounded p-2 text-sm"
            rows={2}
          />
        </div>

        <div className="p-4 border-t flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 border rounded">
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm(obs);
              setObs('');
            }}
            className="flex-1 py-2 bg-green-500 text-white rounded"
          >
            ✅ Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
