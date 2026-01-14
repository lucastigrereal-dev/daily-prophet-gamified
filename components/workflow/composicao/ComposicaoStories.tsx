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

const ESTRATEGIAS = [
  { value: 'caixinha-perguntas', label: '📝 Caixinha de perguntas' },
  { value: 'enquete', label: '📊 Enquete' },
  { value: 'quiz', label: '🧠 Quiz' },
  { value: 'contagem-regressiva', label: '⏱️ Contagem regressiva' },
  { value: 'antes-depois', label: '🔄 Antes e depois' },
  { value: 'bastidores', label: '🎬 Bastidores' },
];

export default function ComposicaoStories({
  data,
  onChange,
  onContinue,
  disabled = false,
  loading = false,
  className = '',
}: Props) {
  const [estrategia, setEstrategia] = useState(
    data?.stories?.estrategia || ''
  );

  useEffect(() => {
    setEstrategia(data?.stories?.estrategia || '');
  }, [data?.stories?.estrategia]);

  const handleChange = (value: string) => {
    setEstrategia(value);
    const newData = {
      stories: {
        estrategia: value,
        exemplos: data?.stories?.exemplos,
      },
    };
    onChange?.(newData);
    onContinue?.(newData);
  };

  const selectedEstrategia = ESTRATEGIAS.find(
    (e) => e.value === estrategia
  );

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📱 Composição - Stories
      </h3>

      <div className="mb-4">
        <label htmlFor="stories-estrategia" className="block text-sm font-medium text-gray-700 mb-2">
          Qual estratégia de Stories?
        </label>

        <select
          id="stories-estrategia"
          value={estrategia}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled || loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3E%3Cpath stroke=%27%236B7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3E%3C/svg%3E")',
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
        >
          <option value="">Selecione uma estratégia...</option>
          {ESTRATEGIAS.map((est) => (
            <option key={est.value} value={est.value}>
              {est.label}
            </option>
          ))}
        </select>
      </div>

      {selectedEstrategia && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900 font-semibold">
            Estratégia selecionada:
          </p>
          <p className="text-base text-blue-800 mt-1">
            {selectedEstrategia.label}
          </p>
        </div>
      )}
    </div>
  );
}
