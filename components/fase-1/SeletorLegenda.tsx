'use client';

import { useState, useEffect } from 'react';

interface Legenda {
  id: string;
  texto: string;
  tipo_legenda: string;
  tipo_post?: string | null;
  procedimento?: string | null;
  pilar?: string | null;
  objetivo?: string | null;
  created_at?: string;
}

interface SeletorLegendaProps {
  formato: string;
  pilar: string;
  objetivo: string;
  selectedId: string | null;
  onSelect: (legenda: Legenda) => void;
}

export default function SeletorLegenda({
  formato,
  pilar,
  objetivo,
  selectedId,
  onSelect,
}: SeletorLegendaProps) {
  const [legendas, setLegendas] = useState<Legenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLegendas();
  }, [formato, pilar, objetivo]);

  const fetchLegendas = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (formato) params.append('tipo', formato);
      params.append('limit', '30');

      const res = await fetch(`/api/content/legendas?${params}`);
      const data = await res.json();

      if (res.ok) {
        setLegendas(data.data || []);
      } else {
        setError(data.error || 'Erro ao buscar legendas');
      }
    } catch (error) {
      console.error('Erro ao buscar legendas:', error);
      setError('Erro ao buscar legendas');
    } finally {
      setLoading(false);
    }
  };

  const truncate = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">7. Selecionar Legenda</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">7. Selecionar Legenda</h3>
        <span className="text-sm text-gray-500">{legendas.length} opções</span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Lista de legendas CLICÁVEIS */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {legendas.map((legenda) => (
          <div
            key={legenda.id}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
              selectedId === legenda.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div
              onClick={() => onSelect(legenda)}
              className="space-y-2"
            >
              <p className="text-sm leading-relaxed">
                {expandedId === legenda.id ? legenda.texto : truncate(legenda.texto)}
              </p>
            </div>

            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                  {legenda.tipo_legenda}
                </span>
                {legenda.tipo_post && (
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                    {legenda.tipo_post}
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedId(expandedId === legenda.id ? null : legenda.id);
                }}
                className="text-xs text-blue-600 hover:underline whitespace-nowrap ml-2"
              >
                {expandedId === legenda.id ? 'Ver menos' : 'Ver completa'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {legendas.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            Nenhuma legenda disponível para os filtros selecionados
          </p>
        </div>
      )}

      {selectedId && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">✅ Legenda selecionada</p>
        </div>
      )}
    </div>
  );
}
