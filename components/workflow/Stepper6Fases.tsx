'use client';

import { useState, useEffect } from 'react';

interface Ideia {
  id: string;
  title: string;
  objective?: string;
  format?: string;
  tipo_post?: string;
  procedimento?: string;
}

interface Gancho {
  id: string;
  texto: string;
  tipo_legenda?: string;
  tipo_post?: string;
  procedimento?: string;
}

interface Legenda {
  id: string;
  texto: string;
  tipo_legenda?: string;
  tipo_post?: string;
  procedimento?: string;
}

interface CTA {
  id: string;
  texto: string;
  tipo_post?: string;
  procedimento?: string;
}

interface Hashtag {
  id: string;
  tags?: string;
  tipo_post?: string;
}

interface Props {
  workflowId: string;
  onComplete?: (data: ComposicaoData) => void;
  onSave?: (data: ComposicaoData) => Promise<void>;
}

interface ComposicaoData {
  ideia_id?: string;
  gancho_id?: string;
  legenda_id?: string;
  cta_id?: string;
  hashtag_id?: string;
  composicao_final?: string;
}

const FASES = [
  { numero: 1, nome: 'Ideia', icon: '💡' },
  { numero: 2, nome: 'Gancho', icon: '🎣' },
  { numero: 3, nome: 'Legenda', icon: '📝' },
  { numero: 4, nome: 'CTA', icon: '🎯' },
  { numero: 5, nome: 'Hashtags', icon: '#️⃣' },
  { numero: 6, nome: 'PostPack', icon: '📦' },
];

export default function Stepper6Fases({
  workflowId,
  onComplete,
  onSave,
}: Props) {
  const [faseAtual, setFaseAtual] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados dos dados
  const [ideias, setIdeias] = useState<Ideia[]>([]);
  const [ganchos, setGanchos] = useState<Gancho[]>([]);
  const [legendas, setLegendas] = useState<Legenda[]>([]);
  const [ctas, setCtas] = useState<CTA[]>([]);
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);

  // Seleções do usuário
  const [composicao, setComposicao] = useState<ComposicaoData>({});
  const [saving, setSaving] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    loadIdeias();
  }, []);

  // Carregar ganchos quando ideia é selecionada
  useEffect(() => {
    if (composicao.ideia_id) {
      loadGanchos();
    }
  }, [composicao.ideia_id]);

  const loadIdeias = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/ideias?limit=1000');
      const data = await res.json();
      setIdeias(data.ideias || []);
    } catch (err) {
      setError('Erro ao carregar ideias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadGanchos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content/ganchos?limit=1000');
      const data = await res.json();
      setGanchos(data || []);
    } catch (err) {
      console.error('Erro ao carregar ganchos:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLegendas = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content/legendas?limit=1000');
      const data = await res.json();
      setLegendas(data || []);
    } catch (err) {
      console.error('Erro ao carregar legendas:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCtas = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content/ctas?limit=1000');
      const data = await res.json();
      setCtas(data || []);
    } catch (err) {
      console.error('Erro ao carregar CTAs:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadHashtags = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content/hashtags?limit=1000');
      const data = await res.json();
      setHashtags(data || []);
    } catch (err) {
      console.error('Erro ao carregar hashtags:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvancar = async () => {
    if (faseAtual < 6) {
      // Load data for next phase
      if (faseAtual === 2) {
        loadLegendas();
      } else if (faseAtual === 3) {
        loadCtas();
      } else if (faseAtual === 4) {
        loadHashtags();
      }
      setFaseAtual(faseAtual + 1);
    } else {
      // Salvar composição final
      await handleSalvar();
    }
  };

  const handleVoltar = () => {
    if (faseAtual > 1) {
      setFaseAtual(faseAtual - 1);
    }
  };

  const handleSalvar = async () => {
    if (!onSave) return;

    try {
      setSaving(true);
      await onSave(composicao);
      if (onComplete) {
        onComplete(composicao);
      }
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setError('Erro ao salvar composição');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">
          {FASES[faseAtual - 1].icon} {FASES[faseAtual - 1].nome}
        </h2>
        <p className="text-gray-600">
          Passo {faseAtual} de 6: Escolha {FASES[faseAtual - 1].nome.toLowerCase()}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {FASES.map((fase) => (
            <div
              key={fase.numero}
              className={`flex-1 h-2 mx-1 rounded-full ${
                fase.numero <= faseAtual ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          {FASES.map((fase) => (
            <span key={fase.numero}>{fase.nome}</span>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="mb-8">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            <p className="mt-4 text-gray-600">Carregando opções...</p>
          </div>
        ) : (
          <>
            {faseAtual === 1 && (
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {ideias.length === 0 ? (
                  <p className="text-gray-500">Nenhuma ideia disponível</p>
                ) : (
                  ideias.map((ideia) => (
                    <button
                      key={ideia.id}
                      onClick={() => {
                        setComposicao({ ...composicao, ideia_id: ideia.id });
                        handleAvancar();
                      }}
                      className={`p-4 text-left rounded-lg border-2 transition ${
                        composicao.ideia_id === ideia.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-400'
                      }`}
                    >
                      <div className="font-semibold">{ideia.title}</div>
                      {ideia.objective && (
                        <div className="text-sm text-gray-600">{ideia.objective}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {ideia.format && <span className="mr-2">📱 {ideia.format}</span>}
                        {ideia.tipo_post && <span className="mr-2">🏷️ {ideia.tipo_post}</span>}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {faseAtual === 2 && (
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {ganchos.length === 0 ? (
                  <p className="text-gray-500">Nenhum gancho disponível</p>
                ) : (
                  ganchos.map((gancho) => (
                    <button
                      key={gancho.id}
                      onClick={() => {
                        setComposicao({ ...composicao, gancho_id: gancho.id });
                        handleAvancar();
                      }}
                      className={`p-4 text-left rounded-lg border-2 transition ${
                        composicao.gancho_id === gancho.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-400'
                      }`}
                    >
                      <div className="font-semibold">{gancho.texto.substring(0, 50)}...</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {gancho.tipo_post && <span className="mr-2">{gancho.tipo_post}</span>}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {faseAtual === 3 && (
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {legendas.length === 0 ? (
                  <p className="text-gray-500">Nenhuma legenda disponível</p>
                ) : (
                  legendas.map((legenda) => (
                    <button
                      key={legenda.id}
                      onClick={() => {
                        setComposicao({ ...composicao, legenda_id: legenda.id });
                        handleAvancar();
                      }}
                      className={`p-4 text-left rounded-lg border-2 transition ${
                        composicao.legenda_id === legenda.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-400'
                      }`}
                    >
                      <div className="font-semibold">{legenda.texto.substring(0, 50)}...</div>
                    </button>
                  ))
                )}
              </div>
            )}

            {faseAtual === 4 && (
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {ctas.length === 0 ? (
                  <p className="text-gray-500">Nenhum CTA disponível</p>
                ) : (
                  ctas.map((cta) => (
                    <button
                      key={cta.id}
                      onClick={() => {
                        setComposicao({ ...composicao, cta_id: cta.id });
                        handleAvancar();
                      }}
                      className={`p-4 text-left rounded-lg border-2 transition ${
                        composicao.cta_id === cta.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-400'
                      }`}
                    >
                      <div className="font-semibold">{cta.texto}</div>
                    </button>
                  ))
                )}
              </div>
            )}

            {faseAtual === 5 && (
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {hashtags.length === 0 ? (
                  <p className="text-gray-500">Nenhuma hashtag disponível</p>
                ) : (
                  hashtags.map((hashtag) => (
                    <button
                      key={hashtag.id}
                      onClick={() => {
                        setComposicao({ ...composicao, hashtag_id: hashtag.id });
                        handleAvancar();
                      }}
                      className={`p-4 text-left rounded-lg border-2 transition ${
                        composicao.hashtag_id === hashtag.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-400'
                      }`}
                    >
                      <div className="font-semibold">
                        {hashtag.tags?.substring(0, 100)}...
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {faseAtual === 6 && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Resumo da Composição</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Ideia:</span>{' '}
                    {composicao.ideia_id ? '✅ Selecionada' : '❌ Não selecionada'}
                  </p>
                  <p>
                    <span className="font-medium">Gancho:</span>{' '}
                    {composicao.gancho_id ? '✅ Selecionado' : '❌ Não selecionado'}
                  </p>
                  <p>
                    <span className="font-medium">Legenda:</span>{' '}
                    {composicao.legenda_id ? '✅ Selecionada' : '❌ Não selecionada'}
                  </p>
                  <p>
                    <span className="font-medium">CTA:</span>{' '}
                    {composicao.cta_id ? '✅ Selecionado' : '❌ Não selecionado'}
                  </p>
                  <p>
                    <span className="font-medium">Hashtags:</span>{' '}
                    {composicao.hashtag_id ? '✅ Selecionadas' : '❌ Não selecionadas'}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleVoltar}
          disabled={faseAtual === 1 || saving}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-gray-800 font-semibold rounded-lg transition"
        >
          ← Voltar
        </button>
        <button
          onClick={handleAvancar}
          disabled={saving || loading}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
        >
          {faseAtual === 6
            ? saving
              ? 'Salvando...'
              : '✅ Salvar Composição'
            : `Avançar → ${FASES[faseAtual]?.nome}`}
        </button>
      </div>
    </div>
  );
}
