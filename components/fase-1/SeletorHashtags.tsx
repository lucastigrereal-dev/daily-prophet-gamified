'use client';

import { useState, useEffect } from 'react';

interface Hashtag {
  id: string;
  texto: string;
  tema: string;
  volume?: number;
  tipo_post?: string;
  pilar?: string;
  objetivo?: string;
  ativo?: boolean;
}

interface SeletorHashtagsProps {
  formato: string;
  pilar: string;
  objetivo: string;
  selectedIds: string[];
  onSelect: (hashtags: string[]) => void;
}

const TEMAS = ['autoridade', 'procedimento', 'local', 'beneficio', 'trending', 'marca'];
const MAX_HASHTAGS = 30;

export default function SeletorHashtags({
  formato,
  pilar,
  objetivo,
  selectedIds,
  onSelect,
}: SeletorHashtagsProps) {
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [loading, setLoading] = useState(true);
  const [temaSelecionado, setTemaSelecionado] = useState<string>('trending');
  const [error, setError] = useState<string | null>(null);
  const [selecionados, setSelecionados] = useState<string[]>(selectedIds);

  useEffect(() => {
    fetchHashtags();
  }, [formato, pilar, objetivo]);

  useEffect(() => {
    setSelecionados(selectedIds);
  }, [selectedIds]);

  const fetchHashtags = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (formato) params.append('tipo_post', formato);
      if (pilar) params.append('pilar', pilar);
      if (objetivo) params.append('objetivo', objetivo);
      params.append('limit', '150');

      const res = await fetch(`/api/content/hashtags?${params}`);
      const data = await res.json();

      if (res.ok) {
        setHashtags(data.data || []);
      } else {
        setError(data.error || 'Erro ao buscar hashtags');
      }
    } catch (error) {
      console.error('Erro ao buscar hashtags:', error);
      setError('Erro ao buscar hashtags');
    } finally {
      setLoading(false);
    }
  };

  const hashtagsFiltrados = hashtags.filter((h) => h.tema === temaSelecionado);

  const toggleHashtag = (hashtag: Hashtag) => {
    let novosSelecionados: string[];

    if (selecionados.includes(hashtag.id)) {
      novosSelecionados = selecionados.filter((id) => id !== hashtag.id);
    } else {
      if (selecionados.length >= MAX_HASHTAGS) {
        setError(`Máximo de ${MAX_HASHTAGS} hashtags atingido`);
        return;
      }
      novosSelecionados = [...selecionados, hashtag.id];
    }

    setSelecionados(novosSelecionados);
    onSelect(novosSelecionados);
  };

  // Obter textos dos hashtags selecionados
  const textosHashtagsSelecionados = selecionados
    .map((id) => {
      const h = hashtags.find((tag) => tag.id === id);
      return h?.texto || '';
    })
    .filter((t) => t);

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">9. Selecionar Hashtags</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">9. Selecionar Hashtags</h3>
        <span className={`text-sm font-medium ${
          selecionados.length > 25
            ? 'text-red-600'
            : selecionados.length > 20
              ? 'text-yellow-600'
              : 'text-gray-500'
        }`}>
          {selecionados.length}/{MAX_HASHTAGS} selecionadas
        </span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Preview de hashtags selecionadas */}
      {selecionados.length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">Hashtags selecionadas:</p>
          <p className="text-sm text-blue-800 break-all">
            {textosHashtagsSelecionados.join(' ')}
          </p>
          <p className="text-xs text-blue-600 mt-2">
            Total: {textosHashtagsSelecionados.join(' ').length} caracteres
          </p>
        </div>
      )}

      {/* Tabs por tema */}
      <div className="flex gap-2 flex-wrap border-b border-gray-200">
        {TEMAS.map((tema) => {
          const count = hashtags.filter((h) => h.tema === tema).length;
          return (
            <button
              key={tema}
              onClick={() => setTemaSelecionado(tema)}
              className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                temaSelecionado === tema
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tema.charAt(0).toUpperCase() + tema.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid de hashtags */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-80 overflow-y-auto pr-2">
        {hashtagsFiltrados.map((hashtag) => {
          const isSelected = selecionados.includes(hashtag.id);
          return (
            <button
              key={hashtag.id}
              onClick={() => toggleHashtag(hashtag)}
              className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="truncate">{hashtag.texto}</div>
              <div className="text-xs mt-1 opacity-70">
                {hashtag.volume && hashtag.volume > 0 && `📊 ${hashtag.volume}`}
              </div>
            </button>
          );
        })}
      </div>

      {hashtagsFiltrados.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {hashtags.length === 0
              ? 'Nenhuma hashtag disponível para os filtros selecionados'
              : 'Nenhuma hashtag encontrada neste tema'}
          </p>
        </div>
      )}

      {/* Aviso de limite */}
      {selecionados.length === MAX_HASHTAGS && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 text-sm">
            ⚠️ Limite de {MAX_HASHTAGS} hashtags atingido
          </p>
        </div>
      )}

      {selecionados.length > 0 && selecionados.length < MAX_HASHTAGS && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">
            ✅ {selecionados.length} hashtag{selecionados.length > 1 ? 's' : ''} selecionada{selecionados.length > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
