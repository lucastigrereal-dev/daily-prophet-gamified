'use client';

import { useState, useEffect } from 'react';

// ============================================
// TIPOS
// ============================================
interface Post {
  id: string;
  titulo: string;
  data_publicacao: string;
  horario: string;
  formato: string;
  pilar: string;
  status: string;
  hook: string;
  legenda_abertura: string;
  legenda_meio: string;
  legenda_fechamento: string;
  cta: string;
  hashtags: string;
  keyword_principal: string;
  procedimento?: string;
}

interface CTA {
  id: string;
  texto: string;
  categoria_id: number;
  formato: string;
  pilar: string;
  observacao: string;
}

interface Legenda {
  id: string;
  tipo: string;
  texto: string;
  gatilho_id: number;
  keyword_principal: string;
  procedimento: string;
  pilar: string;
}

interface Hashtag {
  id: string;
  tag: string;
  tema_id: number;
  nivel: string;
  volume: string;
  intencao: string;
  risco_compliance: string;
}

interface HashtagCombo {
  id: string;
  tipo_formato: string;
  tema_id: number;
  nome: string;
  hashtags: string;
}

interface Keyword {
  id: string;
  keyword: string;
  categoria: string;
  volume_mensal: string;
  intencao: string;
}

interface Protocol {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
}

// ============================================
// TIPOS DE LEGENDA
// ============================================
const TIPOS_LEGENDA = [
  { code: 'todos', label: '📋 Todos' },
  { code: 'abertura', label: '🎬 Abertura' },
  { code: 'meio_eeat', label: '👑 E-E-A-T' },
  { code: 'meio_viral', label: '🚀 Viral' },
  { code: 'meio_emocional', label: '💕 Emocional' },
  { code: 'fechamento', label: '🎯 Fechamento' },
];

// ============================================
// REGRAS DE CRUZAMENTO
// ============================================
const REGRAS_PILAR: Record<string, { tipoMeio: string; categoriasPermitidas: string[] }> = {
  autoridade: {
    tipoMeio: 'meio_eeat',
    categoriasPermitidas: ['Salvamento', 'Compartilhamento', 'Autoridade', 'Educação']
  },
  educativo: {
    tipoMeio: 'meio_eeat',
    categoriasPermitidas: ['Salvamento', 'Comentário', 'Compartilhamento', 'Educação']
  },
  prova_social: {
    tipoMeio: 'meio_emocional',
    categoriasPermitidas: ['Compartilhamento', 'Comentário', 'Prova Social', 'Resultados']
  },
  conversao: {
    tipoMeio: 'meio_emocional',
    categoriasPermitidas: ['Direct', 'WhatsApp', 'Agendamento', 'Link Bio']
  },
  bastidores: {
    tipoMeio: 'meio_emocional',
    categoriasPermitidas: ['Comentário', 'Compartilhamento', 'Interação']
  },
  conexao_emocional: {
    tipoMeio: 'meio_emocional',
    categoriasPermitidas: ['Comentário', 'Compartilhamento', 'Empoderamento']
  }
};

// ============================================
// CONSTANTES
// ============================================
const FORMATOS = ['Todos', 'Reels', 'Carrossel', 'Stories'];
const PILARES = ['Todos', 'autoridade', 'educativo', 'prova_social', 'conversao', 'bastidores'];
const STATUS = ['Todos', 'pendente', 'aprovado', 'publicado'];

const PILAR_ICONS: Record<string, string> = {
  autoridade: '🏛️',
  prova_social: '⭐',
  engajamento: '💬',
  educativo: '📚',
  conversao: '💰',
  bastidores: '🎬',
  conexao_emocional: '❤️',
};

const PILAR_COLORS: Record<string, string> = {
  autoridade: 'bg-blue-600',
  prova_social: 'bg-green-600',
  engajamento: 'bg-purple-600',
  educativo: 'bg-yellow-600',
  conversao: 'bg-red-600',
  bastidores: 'bg-pink-600',
};

const FORMATO_ICONS: Record<string, string> = {
  Reels: '🎬',
  Carrossel: '📸',
  Stories: '📱',
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function Home() {
  // Estados principais
  const [modo, setModo] = useState<'biblioteca' | 'montador' | 'postpack'>('biblioteca');
  const [posts, setPosts] = useState<Post[]>([]);
  const [ctas, setCtas] = useState<CTA[]>([]);
  const [legendas, setLegendas] = useState<Legenda[]>([]);
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [hashtagCombos, setHashtagCombos] = useState<HashtagCombo[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de filtro
  const [filtroFormato, setFiltroFormato] = useState('Todos');
  const [filtroPilar, setFiltroPilar] = useState('Todos');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [busca, setBusca] = useState('');

  // Estados do montador
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [etapaMontador, setEtapaMontador] = useState(1);
  const [hookEditado, setHookEditado] = useState('');
  const [legendaEditada, setLegendaEditada] = useState('');
  const [ctaSelecionada, setCtaSelecionada] = useState('');
  const [hashtagsSelecionadas, setHashtagsSelecionadas] = useState('');
  const [tipoLegendaSelecionado, setTipoLegendaSelecionado] = useState<string>('todos');

  // Estados de UI
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(true);

  // Estados de Protocolos (Etapa 6)
  const [mostrarProtocolos, setMostrarProtocolos] = useState(false);
  const [protocolosMarcados, setProtocolosMarcados] = useState<string[]>([]);
  const [sugestaoUsuario, setSugestaoUsuario] = useState('');
  const [salvando, setSalvando] = useState(false);

  // ============================================
  // EFEITOS
  // ============================================
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedPost) {
      setHookEditado(selectedPost.hook || '');
      setLegendaEditada(buildLegenda(selectedPost));
      setCtaSelecionada(selectedPost.cta || '');
      setHashtagsSelecionadas(selectedPost.hashtags || '');
    }
  }, [selectedPost]);

  // ============================================
  // FUNÇÕES DE DADOS
  // ============================================
  const loadData = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !key) {
        setError('Configuracao do Supabase nao encontrada');
        setLoading(false);
        return;
      }

      const headers = { apikey: key, Authorization: `Bearer ${key}` };

      // Carregar todos os dados em paralelo
      const [resPosts, resCtas, resLegendas, resHashtags, resCombos, resKeywords, resProtocols] = await Promise.all([
        fetch(`${url}/rest/v1/posts?select=*&order=data_publicacao`, { headers }),
        fetch(`${url}/rest/v1/ctas?select=*&ativo=eq.true`, { headers }),
        fetch(`${url}/rest/v1/legendas?select=*&ativo=eq.true`, { headers }),
        fetch(`${url}/rest/v1/hashtags?select=*&ativo=eq.true&risco_compliance=neq.alto`, { headers }),
        fetch(`${url}/rest/v1/hashtag_combos?select=*&ativo=eq.true`, { headers }),
        fetch(`${url}/rest/v1/keywords?select=*`, { headers }),
        fetch(`${url}/rest/v1/protocols?select=*&isactive=eq.true`, { headers }),
      ]);

      const [postsData, ctasData, legendasData, hashtagsData, combosData, keywordsData, protocolsData] = await Promise.all([
        resPosts.json(),
        resCtas.json(),
        resLegendas.json(),
        resHashtags.json(),
        resCombos.json(),
        resKeywords.json(),
        resProtocols.json(),
      ]);

      if (Array.isArray(postsData)) setPosts(postsData);
      if (Array.isArray(ctasData)) setCtas(ctasData);
      if (Array.isArray(legendasData)) setLegendas(legendasData);
      if (Array.isArray(hashtagsData)) setHashtags(hashtagsData);
      if (Array.isArray(combosData)) setHashtagCombos(combosData);
      if (Array.isArray(keywordsData)) setKeywords(keywordsData);
      if (Array.isArray(protocolsData)) setProtocols(protocolsData);

    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao conectar com o banco de dados');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FUNÇÕES DE CRUZAMENTO
  // ============================================
  const getCtasFiltradas = (pilar: string, formato: string) => {
    const regra = REGRAS_PILAR[pilar];
    if (!regra) return ctas;

    return ctas.filter(cta => {
      // Filtrar por formato se especificado
      if (cta.formato && formato && cta.formato.toLowerCase() !== formato.toLowerCase()) {
        return false;
      }
      return true;
    });
  };

  const getLegendasFiltradas = (pilar: string, tipo: string, procedimento?: string) => {
    return legendas.filter(leg => {
      if (tipo && leg.tipo !== tipo) return false;
      if (pilar && leg.pilar && leg.pilar !== pilar) return false;
      if (procedimento && leg.procedimento && leg.procedimento !== procedimento) return false;
      return true;
    });
  };

  const getHashtagCombosFiltrados = (formato: string) => {
    const tipoCombo = formato?.toLowerCase() || 'reels';
    return hashtagCombos.filter(combo =>
      combo.tipo_formato?.toLowerCase() === tipoCombo
    );
  };

  const getKeywordsFiltradas = (procedimento?: string) => {
    if (!procedimento) return keywords;
    return keywords.filter(kw =>
      kw.categoria?.toLowerCase().includes(procedimento.toLowerCase()) ||
      kw.keyword?.toLowerCase().includes(procedimento.replace(/_/g, ' '))
    );
  };

  const getProtocolosFiltrados = (formato: string) => {
    if (!formato) return protocols;

    // Mapear formato para category do banco
    const categoryMap: Record<string, string> = {
      'Reels': 'reels',
      'Carrossel': 'carrossel',
      'Stories': 'geral'
    };

    const category = categoryMap[formato] || 'geral';

    return protocols.filter(protocol =>
      protocol.category?.toLowerCase() === category.toLowerCase()
    );
  };

  // ============================================
  // FUNÇÕES AUXILIARES
  // ============================================
  const buildLegenda = (p: Post) => {
    return [p.legenda_abertura, p.legenda_meio, p.legenda_fechamento].filter(Boolean).join('\n\n');
  };

  const buildPostPack = () => {
    const parts = [
      hookEditado,
      '',
      legendaEditada,
      '',
      ctaSelecionada,
      '',
      '.',
      '.',
      '.',
      '',
      hashtagsSelecionadas,
    ];
    return parts.join('\n');
  };

  const copyToClipboard = async (text: string, field?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (field) {
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      alert('Copiado!');
    }
  };

  const salvarPostpack = async () => {
    if (!selectedPost) return;

    try {
      setSalvando(true);
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !key) {
        alert('Configuracao do Supabase nao encontrada');
        return;
      }

      const headers = {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      };

      // Criar postpack no banco
      const postpackData = {
        name: selectedPost.titulo,
        description: buildPostPack(),
        pilar: selectedPost.pilar,
        formato: selectedPost.formato,
        protocolos_marcados: protocolosMarcados,
        sugestao_usuario: sugestaoUsuario,
        hook: hookEditado,
        legenda: legendaEditada,
        cta: ctaSelecionada,
        hashtags: hashtagsSelecionadas
      };

      const response = await fetch(`${url}/rest/v1/postpacks`, {
        method: 'POST',
        headers,
        body: JSON.stringify(postpackData)
      });

      if (response.ok) {
        alert('✅ PostPack salvo com sucesso!');
        // Resetar estados
        setModo('biblioteca');
        setEtapaMontador(1);
        setSelectedPost(null);
        setMostrarProtocolos(false);
        setProtocolosMarcados([]);
        setSugestaoUsuario('');
      } else {
        const error = await response.json();
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar PostPack. Verifique o console.');
      }
    } catch (err) {
      console.error('Erro ao salvar postpack:', err);
      alert('Erro ao salvar PostPack');
    } finally {
      setSalvando(false);
    }
  };

  // ============================================
  // FILTROS
  // ============================================
  const postsFiltrados = posts.filter((post) => {
    if (filtroFormato !== 'Todos' && post.formato !== filtroFormato) return false;
    if (filtroPilar !== 'Todos' && post.pilar !== filtroPilar) return false;
    if (filtroStatus !== 'Todos' && post.status !== filtroStatus) return false;
    if (busca && !post.titulo?.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: posts.length,
    ctas: ctas.length,
    legendas: legendas.length,
    hashtags: hashtags.length,
    keywords: keywords.length,
    protocols: protocols.length,
    pendentes: posts.filter((p) => p.status === 'pendente').length,
    aprovados: posts.filter((p) => p.status === 'aprovado').length,
  };

  // ============================================
  // RENDERIZAÇÃO - LOADING/ERROR
  // ============================================
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🧙‍♂️</div>
          <div className="text-white text-xl">Carregando Daily Prophet...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center bg-red-900/30 p-8 rounded-xl border border-red-500/50">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-white text-xl mb-2">Erro</div>
          <div className="text-red-300 text-sm mb-4">{error}</div>
          <button
            onClick={() => { setError(null); setLoading(true); loadData(); }}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Tentar Novamente
          </button>
        </div>
      </main>
    );
  }

  // ============================================
  // RENDERIZAÇÃO - MONTADOR (WIZARD)
  // ============================================
  const renderMontador = () => {
    const ctasFiltradas = selectedPost ? getCtasFiltradas(selectedPost.pilar, selectedPost.formato) : ctas;
    const legendasAbertura = selectedPost ? getLegendasFiltradas(selectedPost.pilar, 'abertura', selectedPost.procedimento) : [];
    const legendasMeio = selectedPost ? getLegendasFiltradas(selectedPost.pilar, REGRAS_PILAR[selectedPost.pilar]?.tipoMeio || 'meio_eeat', selectedPost.procedimento) : [];
    const combosFiltrados = selectedPost ? getHashtagCombosFiltrados(selectedPost.formato) : [];

    return (
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {['Ideia', 'Gancho', 'Legenda', 'CTA', 'Hashtags', 'PostPack'].map((step, i) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  etapaMontador > i + 1
                    ? 'bg-green-600 text-white'
                    : etapaMontador === i + 1
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {etapaMontador > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`ml-2 text-sm hidden md:block ${etapaMontador === i + 1 ? 'text-white' : 'text-gray-500'}`}>
                {step}
              </span>
              {i < 5 && <div className="w-8 md:w-16 h-1 bg-gray-700 mx-2" />}
            </div>
          ))}
        </div>

        {/* Etapa 1: Escolher Post */}
        {etapaMontador === 1 && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">1️⃣ Escolha uma ideia base</h2>
            <p className="text-gray-400 mb-4">Selecione um post para usar como base. As sugestoes serao filtradas pelo pilar e formato.</p>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {postsFiltrados.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedPost?.id === post.id
                      ? 'bg-purple-600/40 border-2 border-purple-500'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{FORMATO_ICONS[post.formato] || '📝'}</span>
                    <div className="flex-1">
                      <div className="text-white font-medium">{post.titulo}</div>
                      <div className="text-gray-400 text-sm">
                        {post.formato} • {PILAR_ICONS[post.pilar]} {post.pilar}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => selectedPost && setEtapaMontador(2)}
                disabled={!selectedPost}
                className={`px-6 py-3 rounded-lg font-bold ${
                  selectedPost
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Etapa 2: Editar Gancho */}
        {etapaMontador === 2 && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">2️⃣ Ajuste o Gancho</h2>
            <p className="text-gray-400 mb-4">O gancho e a primeira coisa que a pessoa ve. Precisa prender atencao!</p>

            <textarea
              value={hookEditado}
              onChange={(e) => setHookEditado(e.target.value)}
              className="w-full h-32 bg-gray-700 text-white rounded-lg p-4 border border-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="Digite o gancho..."
            />

            {/* Sugestoes de abertura */}
            {legendasAbertura.length > 0 && (
              <div className="mt-4">
                <label className="text-gray-400 text-sm mb-2 block">Sugestoes de abertura ({legendasAbertura.length}):</label>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                  {legendasAbertura.map((leg) => (
                    <button
                      key={leg.id}
                      onClick={() => setHookEditado(leg.texto)}
                      className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300"
                    >
                      {leg.texto}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setEtapaMontador(1)}
                className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
              >
                ← Voltar
              </button>
              <button
                onClick={() => setEtapaMontador(3)}
                className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Etapa 3: Editar Legenda */}
        {etapaMontador === 3 && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">3️⃣ Ajuste a Legenda</h2>
            <p className="text-gray-400 mb-4">A legenda completa do post. Pode editar a vontade.</p>

            <textarea
              value={legendaEditada}
              onChange={(e) => setLegendaEditada(e.target.value)}
              className="w-full h-48 bg-gray-700 text-white rounded-lg p-4 border border-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="Digite a legenda..."
            />

            {/* Seletor de Tipo de Legenda */}
            <div className="mt-4">
              <label className="text-gray-400 text-sm mb-2 block">Escolha o tipo de legenda para adicionar:</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {TIPOS_LEGENDA.map((tipo) => {
                  const count = legendas.filter(l =>
                    tipo.code === 'todos' || l.tipo === tipo.code
                  ).length;
                  return (
                    <button
                      key={tipo.code}
                      onClick={() => setTipoLegendaSelecionado(tipo.code)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        tipoLegendaSelecionado === tipo.code
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {tipo.label}
                      <span className="ml-1 text-xs opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Lista de legendas filtradas por tipo */}
              {(() => {
                const legendasFiltradas = selectedPost
                  ? getLegendasFiltradas(
                      selectedPost.pilar,
                      tipoLegendaSelecionado === 'todos' ? '' : tipoLegendaSelecionado,
                      selectedPost.procedimento
                    )
                  : [];

                return legendasFiltradas.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                    {legendasFiltradas.map((leg) => (
                      <button
                        key={leg.id}
                        onClick={() => setLegendaEditada(prev => prev + '\n\n' + leg.texto)}
                        className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300"
                      >
                        + {leg.texto.substring(0, 80)}...
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Nenhuma legenda encontrada para este tipo
                  </div>
                );
              })()}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setEtapaMontador(2)}
                className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
              >
                ← Voltar
              </button>
              <button
                onClick={() => setEtapaMontador(4)}
                className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Etapa 4: Escolher CTA */}
        {etapaMontador === 4 && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">4️⃣ Escolha a CTA</h2>
            <p className="text-gray-400 mb-4">
              Filtrado por pilar: <span className="text-purple-400">{selectedPost?.pilar}</span>
            </p>

            {/* CTA atual */}
            <div className="mb-4">
              <label className="text-gray-400 text-sm">CTA atual:</label>
              <input
                type="text"
                value={ctaSelecionada}
                onChange={(e) => setCtaSelecionada(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-purple-500 focus:outline-none mt-1"
              />
            </div>

            {/* Sugestoes do banco */}
            <div className="mt-4">
              <label className="text-gray-400 text-sm mb-2 block">Sugestoes compatíveis ({ctasFiltradas.length}):</label>
              <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                {ctasFiltradas.map((cta) => (
                  <button
                    key={cta.id}
                    onClick={() => setCtaSelecionada(cta.texto)}
                    className={`text-left p-3 rounded-lg text-sm transition-all ${
                      ctaSelecionada === cta.texto
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {cta.texto}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setEtapaMontador(3)}
                className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
              >
                ← Voltar
              </button>
              <button
                onClick={() => setEtapaMontador(5)}
                className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Etapa 5: Hashtags */}
        {etapaMontador === 5 && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">5️⃣ Escolha as Hashtags</h2>
            <p className="text-gray-400 mb-4">
              Combos para formato: <span className="text-purple-400">{selectedPost?.formato}</span>
            </p>

            <textarea
              value={hashtagsSelecionadas}
              onChange={(e) => setHashtagsSelecionadas(e.target.value)}
              className="w-full h-24 bg-gray-700 text-white rounded-lg p-4 border border-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="#hashtag1 #hashtag2 #hashtag3"
            />

            {/* Combos sugeridos */}
            {combosFiltrados.length > 0 && (
              <div className="mt-4">
                <label className="text-gray-400 text-sm mb-2 block">Combos prontos ({combosFiltrados.length}):</label>
                <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                  {combosFiltrados.map((combo) => (
                    <button
                      key={combo.id}
                      onClick={() => setHashtagsSelecionadas(combo.hashtags || combo.nome)}
                      className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300"
                    >
                      <span className="font-medium">{combo.nome}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hashtags individuais */}
            <div className="mt-4">
              <label className="text-gray-400 text-sm mb-2 block">Hashtags individuais (clique para adicionar):</label>
              <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto">
                {hashtags.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setHashtagsSelecionadas(prev => prev + ' ' + h.tag)}
                    className="px-3 py-1 bg-gray-700 hover:bg-purple-600 rounded-full text-sm text-gray-300"
                  >
                    {h.tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setEtapaMontador(4)}
                className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
              >
                ← Voltar
              </button>
              <button
                onClick={() => setEtapaMontador(6)}
                className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold"
              >
                Gerar PostPack →
              </button>
            </div>
          </div>
        )}

        {/* Etapa 6: PostPack Final */}
        {etapaMontador === 6 && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">📦 PostPack Pronto!</h2>
            <p className="text-gray-400 mb-4">Revise e copie para o Instagram.</p>

            {/* Preview */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-700">
              <pre className="text-white whitespace-pre-wrap text-sm font-mono">
                {buildPostPack()}
              </pre>
            </div>

            {/* Botoes de copia */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => copyToClipboard(buildPostPack(), 'all')}
                className={`p-4 rounded-lg font-bold transition-all ${
                  copiedField === 'all' ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'
                } text-white`}
              >
                {copiedField === 'all' ? '✓ Copiado!' : '📋 Copiar Tudo'}
              </button>
              <button
                onClick={() => copyToClipboard(hashtagsSelecionadas, 'hash')}
                className={`p-4 rounded-lg font-bold transition-all ${
                  copiedField === 'hash' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                } text-white`}
              >
                {copiedField === 'hash' ? '✓ Copiado!' : '#️⃣ So Hashtags'}
              </button>
            </div>

            {/* Info do post */}
            {selectedPost && (
              <div className="bg-gray-700/50 rounded-lg p-4 text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <span>{FORMATO_ICONS[selectedPost.formato]} {selectedPost.formato}</span>
                  <span>{PILAR_ICONS[selectedPost.pilar]} {selectedPost.pilar}</span>
                  <span>📅 {selectedPost.data_publicacao}</span>
                </div>
              </div>
            )}

            {/* PAINEL DE PROTOCOLOS */}
            {mostrarProtocolos && selectedPost && (() => {
              const protocolosFiltrados = getProtocolosFiltrados(selectedPost.formato);
              return (
                <div className="border-t border-gray-700 pt-6 mt-6">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    📋 Protocolos ({selectedPost.formato})
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Marque os protocolos que você seguiu ao criar este post:
                  </p>

                  {/* Lista de protocolos */}
                  {protocolosFiltrados.length > 0 ? (
                    <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                      {protocolosFiltrados.map((protocol) => (
                        <label
                          key={protocol.id}
                          className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-all"
                        >
                          <input
                            type="checkbox"
                            checked={protocolosMarcados.includes(protocol.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProtocolosMarcados([...protocolosMarcados, protocol.id]);
                              } else {
                                setProtocolosMarcados(protocolosMarcados.filter(id => id !== protocol.id));
                              }
                            }}
                            className="mt-1 w-5 h-5 rounded border-gray-500 text-purple-600 focus:ring-purple-500"
                          />
                          <div className="flex-1">
                            <div className="text-white font-medium">{protocol.name}</div>
                            <div className="text-gray-400 text-sm">{protocol.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-700 rounded-lg p-4 text-gray-400 text-center mb-6">
                      Nenhum protocolo encontrado para o formato "{selectedPost.formato}"
                    </div>
                  )}

                  {/* Caixinha de sugestão */}
                  <div className="mb-6">
                    <label className="text-white font-medium mb-2 block flex items-center gap-2">
                      💡 Sua sugestão ou observação:
                    </label>
                    <textarea
                      value={sugestaoUsuario}
                      onChange={(e) => setSugestaoUsuario(e.target.value)}
                      placeholder="Adicione sua sugestão ou observação sobre este post..."
                      className="w-full h-24 bg-gray-700 text-white rounded-lg p-4 border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              );
            })()}

            {/* Botoes de ação */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => {
                  if (mostrarProtocolos) {
                    setMostrarProtocolos(false);
                  } else {
                    setEtapaMontador(5);
                  }
                }}
                className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
                disabled={salvando}
              >
                ← Voltar e Editar
              </button>

              {!mostrarProtocolos ? (
                <button
                  onClick={() => setMostrarProtocolos(true)}
                  className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Continuar →
                </button>
              ) : (
                <button
                  onClick={salvarPostpack}
                  disabled={salvando}
                  className={`px-6 py-3 rounded-lg font-bold text-white ${
                    salvando
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {salvando ? '⏳ Salvando...' : '✓ Salvar PostPack'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================
  // RENDERIZAÇÃO PRINCIPAL
  // ============================================
  return (
    <main className="min-h-screen bg-gray-900 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-4xl">🧙‍♂️</span> Daily Prophet
            </h1>
            <p className="text-gray-400 mt-1">Sistema Operacional de Conteudo</p>
          </div>

          {/* Toggle de modo */}
          <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setModo('biblioteca')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                modo === 'biblioteca' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              📚 Biblioteca
            </button>
            <button
              onClick={() => setModo('montador')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                modo === 'montador' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              🔧 Montador
            </button>
          </div>
        </div>

        {/* Stats */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white">{stats.total}</div>
              <div className="text-gray-400 text-sm">Posts</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">{stats.ctas}</div>
              <div className="text-gray-400 text-sm">CTAs</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">{stats.legendas}</div>
              <div className="text-gray-400 text-sm">Legendas</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{stats.hashtags}</div>
              <div className="text-gray-400 text-sm">Hashtags</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">{stats.keywords}</div>
              <div className="text-gray-400 text-sm">Keywords</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-pink-400">{stats.protocols}</div>
              <div className="text-gray-400 text-sm">Protocolos</div>
            </div>
          </div>
        )}
      </div>

      {/* Conteudo */}
      <div className="max-w-6xl mx-auto">
        {modo === 'montador' ? (
          renderMontador()
        ) : (
          <>
            {/* Filtros */}
            <div className="bg-gray-800 rounded-xl p-4 mb-6">
              <div className="flex flex-wrap gap-4">
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar post..."
                  className="flex-1 min-w-48 bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
                />
                <select
                  value={filtroFormato}
                  onChange={(e) => setFiltroFormato(e.target.value)}
                  className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600"
                >
                  {FORMATOS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
                <select
                  value={filtroPilar}
                  onChange={(e) => setFiltroPilar(e.target.value)}
                  className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600"
                >
                  {PILARES.map((p) => <option key={p} value={p}>{PILAR_ICONS[p] || ''} {p}</option>)}
                </select>
              </div>
            </div>

            {/* Lista de Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {postsFiltrados.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    setSelectedPost(post);
                    setModo('montador');
                    setEtapaMontador(1);
                  }}
                  className="bg-gray-800 rounded-xl p-4 cursor-pointer hover:bg-gray-700 transition-all border border-transparent hover:border-purple-500"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{FORMATO_ICONS[post.formato] || '📝'}</span>
                    <div className="flex-1">
                      <h3 className="text-white font-medium line-clamp-2">{post.titulo}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded text-xs ${PILAR_COLORS[post.pilar] || 'bg-gray-600'} text-white`}>
                          {PILAR_ICONS[post.pilar]} {post.pilar}
                        </span>
                        <span className="text-gray-500 text-xs">{post.data_publicacao}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {postsFiltrados.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <div className="text-gray-400">Nenhum post encontrado</div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
