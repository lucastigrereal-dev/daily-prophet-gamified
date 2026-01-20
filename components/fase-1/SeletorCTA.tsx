'use client';

import { useState, useEffect } from 'react';

interface CTA {
  id: string;
  texto: string;
  categoria: string;
  tipo_post?: string;
  pilar?: string;
  objetivo?: string;
  ativo?: boolean;
}

interface SeletorCTAProps {
  formato: string;
  pilar: string;
  objetivo: string;
  selectedId: string | null;
  onSelect: (cta: CTA) => void;
}

const CATEGORIAS = [
  'engajamento',
  'conversao',
  'autoridade',
  'educativo',
  'urgencia',
  'prova_social',
];

export default function SeletorCTA({
  formato,
  pilar,
  objetivo,
  selectedId,
  onSelect,
}: SeletorCTAProps) {
  const [ctas, setCtas] = useState<CTA[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('engajamento');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCTAs();
  }, [formato, pilar, objetivo]);

  const fetchCTAs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (formato) params.append('tipo_post', formato);
      if (pilar) params.append('pilar', pilar);
      if (objetivo) params.append('objetivo', objetivo);
      params.append('limit', '100');

      const res = await fetch(`/api/content/ctas?${params}`);
      const data = await res.json();

      if (res.ok) {
        setCtas(data.data || []);
      } else {
        setError(data.error || 'Erro ao buscar CTAs');
      }
    } catch (error) {
      console.error('Erro ao buscar CTAs:', error);
      setError('Erro ao buscar CTAs');
    } finally {
      setLoading(false);
    }
  };

  const ctasFiltrados = ctas.filter((cta) => cta.categoria === categoriaSelecionada);

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">8. Selecionar CTA (Chamada para Ação)</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">8. Selecionar CTA (Chamada para Ação)</h3>
        <span className="text-sm text-gray-500">
          {ctasFiltrados.length} / {ctas.length} opções
        </span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Tabs por categoria */}
      <div className="flex gap-2 flex-wrap border-b border-gray-200">
        {CATEGORIAS.map((categoria) => {
          const count = ctas.filter((c) => c.categoria === categoria).length;
          return (
            <button
              key={categoria}
              onClick={() => setCategoriaSelecionada(categoria)}
              className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                categoriaSelecionada === categoria
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {categoria.charAt(0).toUpperCase() + categoria.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid de CTAs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
        {ctasFiltrados.map((cta) => (
          <button
            key={cta.id}
            onClick={() => onSelect(cta)}
            className={`p-4 text-left rounded-lg border-2 transition-all min-h-20 flex items-center ${
              selectedId === cta.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="w-full">
              <p className="font-medium text-sm md:text-base leading-snug">{cta.texto}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                  {cta.tipo_post}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {ctasFiltrados.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {ctas.length === 0
              ? 'Nenhum CTA disponível para os filtros selecionados'
              : 'Nenhum CTA encontrado nesta categoria'}
          </p>
        </div>
      )}

      {selectedId && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">✅ CTA selecionado</p>
        </div>
      )}
    </div>
  );
}
