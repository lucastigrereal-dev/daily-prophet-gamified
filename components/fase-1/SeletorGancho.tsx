'use client';

import { useState, useEffect } from 'react';

interface Gancho {
  id: string;
  texto: string;
  tipo_gancho?: string;
  tipo_legenda?: string;
  tipo_post?: string;
  pilar?: string;
  objetivo?: string;
  procedimento?: string;
  ativo?: boolean;
  uso_count?: number;
}

interface SeletorGanchoProps {
  formato: string;
  pilar: string;
  objetivo: string;
  selectedId: string | null;
  onSelect: (gancho: Gancho) => void;
}

export default function SeletorGancho({
  formato,
  pilar,
  objetivo,
  selectedId,
  onSelect,
}: SeletorGanchoProps) {
  const [ganchos, setGanchos] = useState<Gancho[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGanchos();
  }, [formato, pilar, objetivo]);

  const fetchGanchos = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (formato) params.append('tipo', formato);
      if (pilar) params.append('pilar', pilar);
      if (objetivo) params.append('objetivo', objetivo);
      params.append('limit', '50');

      const res = await fetch(`/api/content/ganchos?${params}`);
      const data = await res.json();

      if (res.ok) {
        setGanchos(data.data || []);
      } else {
        setError(data.error || 'Erro ao buscar ganchos');
      }
    } catch (error) {
      console.error('Erro ao buscar ganchos:', error);
      setError('Erro ao buscar ganchos');
    } finally {
      setLoading(false);
    }
  };

  const ganchosFiltrados = ganchos.filter((g) =>
    g.texto.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">6. Selecionar Gancho (Hook)</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">6. Selecionar Gancho (Hook)</h3>
        <span className="text-sm text-gray-500">{ganchos.length} opções</span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Filtro rápido */}
      <input
        type="text"
        placeholder="Filtrar ganchos por texto..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />

      {/* Lista de ganchos CLICÁVEIS */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
        {ganchosFiltrados.map((gancho) => (
          <button
            key={gancho.id}
            onClick={() => onSelect(gancho)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              selectedId === gancho.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <p className="font-medium text-sm md:text-base">{gancho.texto}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                {gancho.tipo_post}
              </span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                {gancho.objetivo}
              </span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                👁️ {gancho.uso_count} usos
              </span>
            </div>
          </button>
        ))}
      </div>

      {ganchosFiltrados.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {ganchos.length === 0
              ? 'Nenhum gancho disponível para os filtros selecionados'
              : 'Nenhum gancho encontrado. Tente outro filtro.'}
          </p>
        </div>
      )}

      {selectedId && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">✅ Gancho selecionado</p>
        </div>
      )}
    </div>
  );
}
