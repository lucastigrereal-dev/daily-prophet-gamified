'use client';

import { WorkflowComposicao } from '@/types/workflow';

interface Props {
  data?: WorkflowComposicao;
  onChange?: (data: Partial<WorkflowComposicao>) => void;
  onContinue?: (data: Partial<WorkflowComposicao>) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function ComposicaoReels({
  data,
  onChange,
  onContinue,
  disabled = false,
  loading = false,
  className = '',
}: Props) {
  const reelsData = data?.reels;

  const handleSim = () => {
    const newData = {
      reels: {
        montarScript: true,
        script: reelsData?.script,
      },
    };
    onChange?.(newData);
    onContinue?.(newData);
  };

  const handleNao = () => {
    const newData = {
      reels: {
        montarScript: false,
        script: reelsData?.script,
      },
    };
    onChange?.(newData);
    onContinue?.(newData);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📹 Composição - Reels
      </h3>

      <p className="text-gray-700 mb-6 text-base">
        Quer que eu monte o script completo do Reels?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleSim}
          disabled={disabled || loading}
          className={`min-h-[80px] flex items-center justify-center rounded-lg font-semibold text-lg transition-all ${
            reelsData?.montarScript === true
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-green-50'
          } ${
            disabled || loading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-md'
          }`}
        >
          ✅ SIM, MONTE O SCRIPT
        </button>

        <button
          onClick={handleNao}
          disabled={disabled || loading}
          className={`min-h-[80px] flex items-center justify-center rounded-lg font-semibold text-lg transition-all ${
            reelsData?.montarScript === false
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-red-50'
          } ${
            disabled || loading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-md'
          }`}
        >
          ❌ NÃO, JÁ TENHO PRONTO
        </button>
      </div>

      {reelsData?.montarScript !== undefined && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            {reelsData?.montarScript === true
              ? '✅ Você escolheu montar o script do banco de dados'
              : '❌ Você já tem o script pronto'}
          </p>
        </div>
      )}
    </div>
  );
}
