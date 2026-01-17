'use client';

import { useState, useEffect } from 'react';
import { WorkflowComposicao } from '@/types/workflow';

interface Props {
  data?: WorkflowComposicao;
  onChange?: (data: Partial<WorkflowComposicao>) => void;
  onContinue?: (data: Partial<WorkflowComposicao>) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function ComposicaoCarrossel({
  data,
  onChange,
  onContinue,
  disabled = false,
  loading = false,
  className = '',
}: Props) {
  const [tema, setTema] = useState(data?.carrossel?.tema || '');

  useEffect(() => {
    setTema(data?.carrossel?.tema || '');
  }, [data?.carrossel?.tema]);

  const handleChange = (value: string) => {
    setTema(value);
  };

  const handleGerarOpcoes = async () => {
    const newData = {
      carrossel: {
        tema,
        textosGerados: data?.carrossel?.textosGerados,
      },
    };
    onChange?.(newData);
    onContinue?.(newData);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🎠 Composição - Carrossel
      </h3>

      <div className="mb-4">
        <label htmlFor="carrossel-tema" className="block text-sm font-medium text-gray-700 mb-2">
          Qual a ideia/tema do carrossel?
        </label>

        <textarea
          id="carrossel-tema"
          value={tema}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled || loading}
          placeholder="Ex: 5 mitos sobre harmonização facial"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <button
        onClick={handleGerarOpcoes}
        disabled={disabled || loading || !tema.trim()}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
          disabled || loading || !tema.trim()
            ? 'bg-gray-400 cursor-not-allowed opacity-50'
            : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
        }`}
      >
        {loading ? 'Processando...' : '✨ GERAR OPÇÕES DE TEXTO'}
      </button>

      {tema && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            ✅ Tema salvo: <span className="font-semibold">{tema}</span>
          </p>
        </div>
      )}
    </div>
  );
}
