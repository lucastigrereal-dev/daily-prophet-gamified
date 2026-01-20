'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// TIPOS
interface Gancho {
  id: string;
  texto: string;
  tipo_post?: string;
  pilar?: string;
  objetivo?: string;
  uso_count?: number;
}

interface Legenda {
  id: string;
  texto: string;
  estrutura?: string;
  formato?: string;
  procedimento?: string;
}

interface CTA {
  id: string;
  texto: string;
  categoria?: string;
  objetivo?: string;
}

interface Hashtag {
  id: string;
  texto: string;
  tema?: string;
  volume?: number;
}

// ETAPAS DO MONTADOR
type EtapaMontador = 'composicao' | 'gancho' | 'legenda' | 'cta' | 'hashtags' | 'protocolo' | 'resumo';

const ETAPAS: { id: EtapaMontador; label: string; numero: number }[] = [
  { id: 'composicao', label: 'Composição', numero: 1 },
  { id: 'gancho', label: 'Gancho', numero: 2 },
  { id: 'legenda', label: 'Legenda', numero: 3 },
  { id: 'cta', label: 'CTA', numero: 4 },
  { id: 'hashtags', label: 'Hashtags', numero: 5 },
  { id: 'protocolo', label: 'Protocolo', numero: 6 },
  { id: 'resumo', label: 'Resumo', numero: 7 },
];

export default function MontadorPage() {
  const params = useParams();
  const router = useRouter();
  const workflowId = (params?.id as string) || '';

  // Estado geral
  const [etapaAtual, setEtapaAtual] = useState<EtapaMontador>('composicao');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dados do workflow
  const [workflow, setWorkflow] = useState<any>(null);

  // Seleções do usuário
  const [selecoes, setSelecoes] = useState({
    composicao: null as any,
    gancho: null as Gancho | null,
    legenda: null as Legenda | null,
    cta: null as CTA | null,
    hashtags: [] as Hashtag[],
    protocolo: null as any,
  });

  // Dados do banco
  const [ganchos, setGanchos] = useState<Gancho[]>([]);
  const [legendas, setLegendas] = useState<Legenda[]>([]);
  const [ctas, setCtas] = useState<CTA[]>([]);
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);

  // Filtros
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // Carregar workflow ao montar
  useEffect(() => {
    carregarWorkflow();
  }, [workflowId]);

  // Carregar dados quando mudar de etapa
  useEffect(() => {
    if (workflow) {
      carregarDadosEtapa();
    }
  }, [etapaAtual, workflow]);

  const carregarWorkflow = async () => {
    setLoading(true);
    try {
      const { data: wf, error: e1 } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', workflowId)
        .single();

      if (e1) throw e1;

      setWorkflow(wf);

      // Restaurar seleções salvas se existirem
      if (wf.gancho_id) {
        const { data: gancho } = await supabase
          .from('ganchos')
          .select('*')
          .eq('id', wf.gancho_id)
          .single();
        if (gancho) setSelecoes(prev => ({ ...prev, gancho }));
      }

      if (wf.legenda_id) {
        const { data: legenda } = await supabase
          .from('legendas')
          .select('*')
          .eq('id', wf.legenda_id)
          .single();
        if (legenda) setSelecoes(prev => ({ ...prev, legenda }));
      }

      if (wf.cta_id) {
        const { data: cta } = await supabase
          .from('ctas')
          .select('*')
          .eq('id', wf.cta_id)
          .single();
        if (cta) setSelecoes(prev => ({ ...prev, cta }));
      }
    } catch (err) {
      console.error('Erro ao carregar workflow:', err);
    } finally {
      setLoading(false);
    }
  };

  const carregarDadosEtapa = async () => {
    if (!workflow) return;

    const formato = workflow.formato?.toLowerCase() || '';
    const pilar = workflow.procedimento?.toLowerCase() || '';
    const objetivo = workflow.objetivo?.toLowerCase() || '';

    try {
      switch (etapaAtual) {
        case 'gancho':
          const resG = await supabase
            .from('ganchos')
            .select('*')
            .limit(50);
          if (resG.data) setGanchos(resG.data);
          break;

        case 'legenda':
          const resL = await supabase
            .from('legendas')
            .select('*')
            .limit(50);
          if (resL.data) setLegendas(resL.data);
          break;

        case 'cta':
          const resC = await supabase
            .from('ctas')
            .select('*')
            .limit(100);
          if (resC.data) setCtas(resC.data);
          break;

        case 'hashtags':
          const resH = await supabase
            .from('hashtags')
            .select('*')
            .limit(100);
          if (resH.data) setHashtags(resH.data);
          break;
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  const salvarSelecao = async () => {
    setSaving(true);
    try {
      const updateData: any = {};

      if (selecoes.gancho) updateData.gancho_id = selecoes.gancho.id;
      if (selecoes.legenda) updateData.legenda_id = selecoes.legenda.id;
      if (selecoes.cta) updateData.cta_id = selecoes.cta.id;

      if (Object.keys(updateData).length > 0) {
        await supabase
          .from('workflows')
          .update(updateData)
          .eq('id', workflowId);
      }
    } catch (err) {
      console.error('Erro ao salvar:', err);
    } finally {
      setSaving(false);
    }
  };

  const avancar = async () => {
    await salvarSelecao();
    const idx = ETAPAS.findIndex(e => e.id === etapaAtual);
    if (idx < ETAPAS.length - 1) {
      setEtapaAtual(ETAPAS[idx + 1].id);
    } else {
      // Finalizar e ir para fase-2
      await supabase
        .from('workflows')
        .update({ status: 'montado' })
        .eq('id', workflowId);
      router.push(`/workflow/${workflowId}/fase-2`);
    }
  };

  const voltar = () => {
    const idx = ETAPAS.findIndex(e => e.id === etapaAtual);
    if (idx > 0) {
      setEtapaAtual(ETAPAS[idx - 1].id);
    }
  };

  // ===== RENDER ETAPA: COMPOSIÇÃO =====
  const renderComposicao = () => {
    const formato = workflow?.formato?.toLowerCase() || '';

    if (formato.includes('reel')) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">📹 Composição - Reels</h2>
          <p className="text-gray-600">Defina os parâmetros do seu Reels</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Duração do Reels</label>
              <div className="grid grid-cols-3 gap-4">
                {[15, 30, 60].map(dur => (
                  <button
                    key={dur}
                    onClick={() => setSelecoes(prev => ({
                      ...prev,
                      composicao: { ...prev.composicao, duracao: dur }
                    }))}
                    className={`p-4 rounded-lg border-2 transition ${
                      selecoes.composicao?.duracao === dur
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl font-bold">{dur}s</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quer que eu monte o script?</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelecoes(prev => ({
                    ...prev,
                    composicao: { ...prev.composicao, montarScript: true }
                  }))}
                  className={`p-6 rounded-lg border-2 ${
                    selecoes.composicao?.montarScript === true
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  ✅ SIM, MONTE O SCRIPT
                </button>
                <button
                  onClick={() => setSelecoes(prev => ({
                    ...prev,
                    composicao: { ...prev.composicao, montarScript: false }
                  }))}
                  className={`p-6 rounded-lg border-2 ${
                    selecoes.composicao?.montarScript === false
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                  }`}
                >
                  ❌ NÃO, JÁ TENHO PRONTO
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (formato.includes('carrossel')) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">📸 Composição - Carrossel</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Qual o tema do carrossel?</label>
            <input
              type="text"
              placeholder="Ex: 5 mitos sobre harmonização facial"
              value={selecoes.composicao?.tema || ''}
              onChange={(e) => setSelecoes(prev => ({
                ...prev,
                composicao: { ...prev.composicao, tema: e.target.value }
              }))}
              className="w-full p-4 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tipo de carrossel</label>
            <div className="grid grid-cols-2 gap-4">
              {['Mitos vs Verdades', 'Dicas', 'Passo a Passo', 'Antes/Depois', 'Lista', 'Educativo'].map(tipo => (
                <button
                  key={tipo}
                  onClick={() => setSelecoes(prev => ({
                    ...prev,
                    composicao: { ...prev.composicao, tipoCarrossel: tipo }
                  }))}
                  className={`p-4 rounded-lg border-2 ${
                    selecoes.composicao?.tipoCarrossel === tipo
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quantidade de slides</label>
            <div className="flex gap-2 flex-wrap">
              {[5, 6, 7, 8, 9, 10].map(n => (
                <button
                  key={n}
                  onClick={() => setSelecoes(prev => ({
                    ...prev,
                    composicao: { ...prev.composicao, numSlides: n }
                  }))}
                  className={`w-12 h-12 rounded-lg border-2 ${
                    selecoes.composicao?.numSlides === n
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Stories
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">📱 Composição - Stories</h2>

        <div>
          <label className="block text-sm font-medium mb-2">Estratégia de Stories</label>
          <div className="grid grid-cols-2 gap-4">
            {['Q&A', 'Bastidores', 'Enquete', 'Tutorial Rápido', 'Depoimento', 'Antes/Depois'].map(est => (
              <button
                key={est}
                onClick={() => setSelecoes(prev => ({
                  ...prev,
                  composicao: { ...prev.composicao, estrategia: est }
                }))}
                className={`p-4 rounded-lg border-2 ${
                  selecoes.composicao?.estrategia === est
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                {est}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Quantidade de stories</label>
          <div className="flex gap-2">
            {[3, 4, 5, 6, 7].map(n => (
              <button
                key={n}
                onClick={() => setSelecoes(prev => ({
                  ...prev,
                  composicao: { ...prev.composicao, numStories: n }
                }))}
                className={`w-12 h-12 rounded-lg border-2 ${
                  selecoes.composicao?.numStories === n
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ===== RENDER ETAPA: GANCHO =====
  const renderGancho = () => {
    const ganchosFiltrados = ganchos.filter(g =>
      g.texto.toLowerCase().includes(filtroTexto.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">🎣 Selecionar Gancho</h2>
          <span className="text-gray-500">{ganchos.length} opções</span>
        </div>

        <input
          type="text"
          placeholder="Filtrar ganchos..."
          value={filtroTexto}
          onChange={(e) => setFiltroTexto(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />

        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {ganchosFiltrados.map(gancho => (
            <button
              key={gancho.id}
              onClick={() => {
                setSelecoes(prev => ({ ...prev, gancho }));
                setFiltroTexto('');
              }}
              className={`w-full p-4 text-left rounded-lg border-2 transition ${
                selecoes.gancho?.id === gancho.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-medium">{gancho.texto}</p>
              {gancho.uso_count && (
                <div className="flex gap-2 mt-2 text-xs">
                  <span className="px-2 py-1 bg-gray-100 rounded">👁️ {gancho.uso_count} usos</span>
                </div>
              )}
            </button>
          ))}

          {ganchosFiltrados.length === 0 && (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Nenhum gancho encontrado</p>
            </div>
          )}
        </div>

        {selecoes.gancho && (
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <p className="font-medium text-green-800">✓ Selecionado:</p>
            <p className="text-sm text-green-700 mt-1">{selecoes.gancho.texto}</p>
          </div>
        )}
      </div>
    );
  };

  // ===== RENDER ETAPA: LEGENDA =====
  const renderLegenda = () => {
    const legendasFiltradas = legendas.filter(l =>
      l.texto.toLowerCase().includes(filtroTexto.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">📝 Selecionar Legenda</h2>
          <span className="text-gray-500">{legendas.length} opções</span>
        </div>

        <input
          type="text"
          placeholder="Filtrar legendas..."
          value={filtroTexto}
          onChange={(e) => setFiltroTexto(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />

        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {legendasFiltradas.map(legenda => (
            <button
              key={legenda.id}
              onClick={() => {
                setSelecoes(prev => ({ ...prev, legenda }));
                setFiltroTexto('');
              }}
              className={`w-full p-4 text-left rounded-lg border-2 transition ${
                selecoes.legenda?.id === legenda.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="text-sm line-clamp-3">{legenda.texto}</p>
            </button>
          ))}

          {legendasFiltradas.length === 0 && (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Nenhuma legenda encontrada</p>
            </div>
          )}
        </div>

        {selecoes.legenda && (
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <p className="font-medium text-green-800">✓ Selecionada:</p>
            <p className="text-sm text-green-700 mt-1 line-clamp-2">{selecoes.legenda.texto}</p>
          </div>
        )}
      </div>
    );
  };

  // ===== RENDER ETAPA: CTA =====
  const renderCTA = () => {
    const categorias = [...new Set(ctas.map(c => c.categoria || 'Geral'))];
    const ctasFiltrados = ctas.filter(c =>
      (filtroCategoria ? (c.categoria || 'Geral') === filtroCategoria : true) &&
      c.texto.toLowerCase().includes(filtroTexto.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">📣 Selecionar CTA</h2>
          <span className="text-gray-500">{ctas.length} opções</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFiltroCategoria('')}
            className={`px-3 py-1 rounded-full text-sm ${
              !filtroCategoria ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Todos
          </button>
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`px-3 py-1 rounded-full text-sm ${
                filtroCategoria === cat ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filtrar CTAs..."
          value={filtroTexto}
          onChange={(e) => setFiltroTexto(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
          {ctasFiltrados.map(cta => (
            <button
              key={cta.id}
              onClick={() => {
                setSelecoes(prev => ({ ...prev, cta }));
                setFiltroTexto('');
              }}
              className={`p-4 text-left rounded-lg border-2 transition ${
                selecoes.cta?.id === cta.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-medium text-sm">{cta.texto}</p>
              {cta.categoria && (
                <span className="text-xs text-gray-500 mt-1 block">{cta.categoria}</span>
              )}
            </button>
          ))}
        </div>

        {selecoes.cta && (
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <p className="font-medium text-green-800">✓ Selecionado:</p>
            <p className="text-sm text-green-700 mt-1">{selecoes.cta.texto}</p>
          </div>
        )}
      </div>
    );
  };

  // ===== RENDER ETAPA: HASHTAGS =====
  const renderHashtags = () => {
    const temas = [...new Set(hashtags.map(h => h.tema || 'Geral'))];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">🏷️ Selecionar Hashtags</h2>
          <span className="text-gray-500">{selecoes.hashtags.length} selecionadas</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFiltroCategoria('')}
            className={`px-3 py-1 rounded-full text-sm ${
              !filtroCategoria ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Todos
          </button>
          {temas.map(tema => (
            <button
              key={tema}
              onClick={() => setFiltroCategoria(tema)}
              className={`px-3 py-1 rounded-full text-sm ${
                filtroCategoria === tema ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {tema}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
          {hashtags
            .filter(h => !filtroCategoria || (h.tema || 'Geral') === filtroCategoria)
            .map(hash => {
              const selecionada = selecoes.hashtags.some(s => s.id === hash.id);
              return (
                <button
                  key={hash.id}
                  onClick={() => {
                    if (selecionada) {
                      setSelecoes(prev => ({
                        ...prev,
                        hashtags: prev.hashtags.filter(h => h.id !== hash.id)
                      }));
                    } else {
                      setSelecoes(prev => ({
                        ...prev,
                        hashtags: [...prev.hashtags, hash]
                      }));
                    }
                  }}
                  className={`p-3 text-left rounded-lg border-2 text-sm ${
                    selecionada
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-mono">#{hash.texto}</p>
                  {hash.volume && (
                    <span className="text-xs text-gray-500">{(hash.volume / 1000).toFixed(0)}K</span>
                  )}
                </button>
              );
            })}
        </div>

        {selecoes.hashtags.length > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="font-medium mb-2">Selecionadas ({selecoes.hashtags.length}):</p>
            <p className="text-sm text-gray-600 break-words">
              {selecoes.hashtags.map(h => `#${h.texto}`).join(' ')}
            </p>
          </div>
        )}
      </div>
    );
  };

  // ===== RENDER ETAPA: PROTOCOLO =====
  const renderProtocolo = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">📋 Protocolo Auto-Selecionado</h2>

        <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
          <p className="font-medium text-green-800">
            ✅ Protocolo selecionado automaticamente baseado em:
          </p>
          <ul className="mt-2 text-sm text-green-700 space-y-1">
            <li>• Formato: {workflow?.formato}</li>
            <li>• Objetivo: {workflow?.objetivo}</li>
            <li>• Procedimento: {workflow?.procedimento}</li>
          </ul>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="font-medium">Protocolo: {workflow?.formato} - {workflow?.objetivo}</p>
          <p className="text-sm text-gray-600 mt-2">
            Checklist será carregado automaticamente na próxima fase
          </p>
        </div>
      </div>
    );
  };

  // ===== RENDER ETAPA: RESUMO =====
  const renderResumo = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">✨ Resumo do PostPack</h2>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Formato</p>
            <p className="font-medium text-lg">{workflow?.formato}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500">
            <p className="text-sm text-gray-500">🎣 Gancho Selecionado</p>
            <p className="font-medium line-clamp-2">{selecoes.gancho?.texto || '❌ Nenhum'}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-pink-500">
            <p className="text-sm text-gray-500">📝 Legenda</p>
            <p className="font-medium line-clamp-2">{selecoes.legenda?.texto || '❌ Nenhuma'}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500">
            <p className="text-sm text-gray-500">📣 CTA</p>
            <p className="font-medium">{selecoes.cta?.texto || '❌ Nenhum'}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
            <p className="text-sm text-gray-500">🏷️ Hashtags ({selecoes.hashtags.length})</p>
            <p className="font-medium text-sm break-words">
              {selecoes.hashtags.length > 0
                ? selecoes.hashtags.map(h => `#${h.texto}`).join(' ')
                : '❌ Nenhuma'
              }
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ===== RENDER PRINCIPAL =====
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Carregando montador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">🗞️ Montador - Daily Prophet</h1>
          <p className="text-sm text-gray-500">PostPack: {workflow?.id?.slice(0, 8)}...</p>
        </div>
      </header>

      {/* Stepper */}
      <div className="bg-white border-b py-4 overflow-x-auto sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-2">
            {ETAPAS.map((etapa, idx) => {
              const atual = etapaAtual === etapa.id;
              const completa = ETAPAS.findIndex(e => e.id === etapaAtual) > idx;

              return (
                <button
                  key={etapa.id}
                  onClick={() => completa && setEtapaAtual(etapa.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition ${
                    atual
                      ? 'bg-blue-500 text-white shadow-lg'
                      : completa
                        ? 'bg-green-100 text-green-800 cursor-pointer hover:bg-green-200'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    atual ? 'bg-white text-blue-500' : completa ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
                  }`}>
                    {completa ? '✓' : etapa.numero}
                  </span>
                  <span className="hidden sm:inline">{etapa.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {etapaAtual === 'composicao' && renderComposicao()}
          {etapaAtual === 'gancho' && renderGancho()}
          {etapaAtual === 'legenda' && renderLegenda()}
          {etapaAtual === 'cta' && renderCTA()}
          {etapaAtual === 'hashtags' && renderHashtags()}
          {etapaAtual === 'protocolo' && renderProtocolo()}
          {etapaAtual === 'resumo' && renderResumo()}
        </div>

        {/* Navegação */}
        <div className="flex justify-between mt-8 gap-4">
          <button
            onClick={voltar}
            disabled={etapaAtual === 'composicao'}
            className="px-8 py-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-lg font-medium transition"
          >
            ← Voltar
          </button>

          <button
            onClick={avancar}
            disabled={saving}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition"
          >
            {saving ? '⏳ Salvando...' : etapaAtual === 'resumo' ? '✨ Finalizar Montagem' : 'Avançar →'}
          </button>
        </div>
      </main>
    </div>
  );
}
