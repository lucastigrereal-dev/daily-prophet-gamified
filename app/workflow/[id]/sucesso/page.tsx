'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import html2canvas from 'html2canvas';

type MetricasMomento = {
  views: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reach: number;
  new_followers: number;
};

export default function SucessoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exportando, setExportando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('workflows')
          .select('*')
          .eq('id', params.id)
          .single();

        if (data && !data.case_sucesso) {
          router.push(`/workflow/${params.id}`);
          return;
        }

        setWorkflow(data);
      } catch (error) {
        console.error('Erro ao carregar:', error);
        router.push(`/workflow/${params.id}`);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) load();
  }, [params.id, router]);

  const metricas7d = workflow?.metricas?.['7d'] || {
    views: 0,
    likes: 0,
    comments: 0,
    saves: 0,
    shares: 0,
    reach: 0,
    new_followers: 0
  };

  const calcularTaxa = (numerador: number, denominador: number) => {
    if (denominador === 0) return '0%';
    return ((numerador / denominador) * 100).toFixed(1) + '%';
  };

  const engajamento7d = calcularTaxa(
    metricas7d.likes + metricas7d.comments + metricas7d.saves,
    metricas7d.reach
  );

  const taxaSaves7d = calcularTaxa(metricas7d.saves, metricas7d.reach);

  const taxaCompartilhamentos7d = calcularTaxa(metricas7d.shares, metricas7d.reach);

  const handleExportarImagem = async () => {
    if (!contentRef.current) return;

    try {
      setExportando(true);
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `case-sucesso-${params.id}-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar imagem');
    } finally {
      setExportando(false);
    }
  };

  const handleCopiarLink = async () => {
    const link = `${window.location.origin}/workflow/${params.id}/sucesso`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
      alert('Erro ao copiar link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 rounded-lg p-6">
          <p className="text-center">Case de sucesso não encontrado ou não autorizado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header com Badge */}
        <div className="mb-8">
          <button
            onClick={() => router.push(`/workflow/${params.id}`)}
            className="text-yellow-400 hover:text-yellow-300 transition-colors mb-6 flex items-center gap-2 text-sm sm:text-base font-medium"
          >
            ← Voltar
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-full">
                <span className="text-lg">🏆</span>
                <span className="text-yellow-400 font-bold text-sm sm:text-base">CASE DE SUCESSO</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Seu Sucesso em Foco</h1>
              <p className="text-gray-400 text-sm sm:text-base">PostPack #{workflow.id.slice(0, 8)}</p>
            </div>
          </div>

          {/* Badges de Informação */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-purple-500 bg-opacity-20 border border-purple-500 rounded-lg p-3 sm:p-4">
              <p className="text-purple-300 text-xs uppercase tracking-wider mb-1">Formato</p>
              <p className="text-white font-semibold text-sm sm:text-base">{workflow?.formato?.toUpperCase() || 'N/A'}</p>
            </div>
            <div className="bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg p-3 sm:p-4">
              <p className="text-blue-300 text-xs uppercase tracking-wider mb-1">Objetivo</p>
              <p className="text-white font-semibold text-sm sm:text-base">{workflow?.objetivo || 'N/A'}</p>
            </div>
            <div className="bg-cyan-500 bg-opacity-20 border border-cyan-500 rounded-lg p-3 sm:p-4">
              <p className="text-cyan-300 text-xs uppercase tracking-wider mb-1">Procedimento</p>
              <p className="text-white font-semibold text-sm sm:text-base">{workflow?.procedimento || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Conteúdo Exportável */}
        <div ref={contentRef} className="space-y-6">
          {/* Seção de Métricas */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-750 border border-yellow-500 border-opacity-30 rounded-lg p-6 sm:p-8 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span>📊</span>
              Métricas - 7 Dias
            </h2>

            {/* Grid de Métricas Grandes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {/* Views */}
              <div className="bg-blue-600 bg-opacity-20 border border-blue-500 rounded-lg p-4 sm:p-5 transform hover:scale-105 transition-transform">
                <p className="text-blue-300 text-xs uppercase tracking-wider mb-2 font-medium">👁️ Views</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-300">
                  {metricas7d.views.toLocaleString('pt-BR')}
                </p>
                <p className="text-blue-400 text-xs mt-1">impressões</p>
              </div>

              {/* Likes */}
              <div className="bg-red-600 bg-opacity-20 border border-red-500 rounded-lg p-4 sm:p-5 transform hover:scale-105 transition-transform">
                <p className="text-red-300 text-xs uppercase tracking-wider mb-2 font-medium">❤️ Likes</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-300">
                  {metricas7d.likes.toLocaleString('pt-BR')}
                </p>
                <p className="text-red-400 text-xs mt-1">curtidas</p>
              </div>

              {/* Comments */}
              <div className="bg-green-600 bg-opacity-20 border border-green-500 rounded-lg p-4 sm:p-5 transform hover:scale-105 transition-transform">
                <p className="text-green-300 text-xs uppercase tracking-wider mb-2 font-medium">💬 Comentários</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-300">
                  {metricas7d.comments.toLocaleString('pt-BR')}
                </p>
                <p className="text-green-400 text-xs mt-1">respostas</p>
              </div>

              {/* Saves */}
              <div className="bg-purple-600 bg-opacity-20 border border-purple-500 rounded-lg p-4 sm:p-5 transform hover:scale-105 transition-transform">
                <p className="text-purple-300 text-xs uppercase tracking-wider mb-2 font-medium">📌 Saves</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-300">
                  {metricas7d.saves.toLocaleString('pt-BR')}
                </p>
                <p className="text-purple-400 text-xs mt-1">salvos</p>
              </div>

              {/* Shares */}
              <div className="bg-orange-600 bg-opacity-20 border border-orange-500 rounded-lg p-4 sm:p-5 transform hover:scale-105 transition-transform">
                <p className="text-orange-300 text-xs uppercase tracking-wider mb-2 font-medium">↗️ Compartilhamentos</p>
                <p className="text-2xl sm:text-3xl font-bold text-orange-300">
                  {metricas7d.shares.toLocaleString('pt-BR')}
                </p>
                <p className="text-orange-400 text-xs mt-1">shares</p>
              </div>

              {/* Reach */}
              <div className="bg-pink-600 bg-opacity-20 border border-pink-500 rounded-lg p-4 sm:p-5 transform hover:scale-105 transition-transform">
                <p className="text-pink-300 text-xs uppercase tracking-wider mb-2 font-medium">📢 Alcance</p>
                <p className="text-2xl sm:text-3xl font-bold text-pink-300">
                  {metricas7d.reach.toLocaleString('pt-BR')}
                </p>
                <p className="text-pink-400 text-xs mt-1">pessoas</p>
              </div>

              {/* Followers */}
              <div className="bg-indigo-600 bg-opacity-20 border border-indigo-500 rounded-lg p-4 sm:p-5 transform hover:scale-105 transition-transform">
                <p className="text-indigo-300 text-xs uppercase tracking-wider mb-2 font-medium">👤 Novos Seguidores</p>
                <p className="text-2xl sm:text-3xl font-bold text-indigo-300">
                  {metricas7d.new_followers.toLocaleString('pt-BR')}
                </p>
                <p className="text-indigo-400 text-xs mt-1">followers</p>
              </div>
            </div>

            {/* Cards de Taxas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Engajamento */}
              <div className="bg-gradient-to-br from-yellow-600 to-orange-600 bg-opacity-20 border border-yellow-500 rounded-lg p-6 text-center">
                <p className="text-yellow-300 text-xs uppercase tracking-wider mb-2 font-medium">📊 Taxa Engajamento</p>
                <p className="text-4xl font-bold text-yellow-300">{engajamento7d}</p>
                <p className="text-yellow-400 text-xs mt-2">do alcance</p>
              </div>

              {/* Saves */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 bg-opacity-20 border border-purple-500 rounded-lg p-6 text-center">
                <p className="text-purple-300 text-xs uppercase tracking-wider mb-2 font-medium">📌 Taxa Saves</p>
                <p className="text-4xl font-bold text-purple-300">{taxaSaves7d}</p>
                <p className="text-purple-400 text-xs mt-2">salvamento</p>
              </div>

              {/* Compartilhamentos */}
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 bg-opacity-20 border border-blue-500 rounded-lg p-6 text-center">
                <p className="text-blue-300 text-xs uppercase tracking-wider mb-2 font-medium">↗️ Taxa Compartilhamentos</p>
                <p className="text-4xl font-bold text-blue-300">{taxaCompartilhamentos7d}</p>
                <p className="text-blue-400 text-xs mt-2">compartilhamento</p>
              </div>
            </div>
          </div>

          {/* Conteúdo Criado */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-750 border border-yellow-500 border-opacity-30 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span>📝</span>
              Conteúdo Criado
            </h2>

            <div className="space-y-4">
              {/* Gancho */}
              {workflow?.gancho_data && (
                <div className="bg-yellow-600 bg-opacity-15 border-l-4 border-yellow-500 rounded p-4 sm:p-5">
                  <p className="text-yellow-400 text-xs uppercase tracking-wider font-bold mb-2">🎣 Gancho</p>
                  <p className="text-gray-200 text-sm sm:text-base">{workflow.gancho_data.texto}</p>
                </div>
              )}

              {/* Legenda */}
              {workflow?.legenda_data && (
                <div className="bg-blue-600 bg-opacity-15 border-l-4 border-blue-500 rounded p-4 sm:p-5">
                  <p className="text-blue-400 text-xs uppercase tracking-wider font-bold mb-2">📋 Legenda</p>
                  <p className="text-gray-200 text-sm sm:text-base whitespace-pre-wrap">{workflow.legenda_data.texto}</p>
                </div>
              )}

              {/* CTA */}
              {workflow?.cta_data && (
                <div className="bg-green-600 bg-opacity-15 border-l-4 border-green-500 rounded p-4 sm:p-5">
                  <p className="text-green-400 text-xs uppercase tracking-wider font-bold mb-2">🎯 Call-to-Action</p>
                  <p className="text-gray-200 text-sm sm:text-base">{workflow.cta_data.texto}</p>
                </div>
              )}

              {/* URL */}
              {workflow?.url_publicado && (
                <div className="bg-purple-600 bg-opacity-15 border-l-4 border-purple-500 rounded p-4 sm:p-5">
                  <p className="text-purple-400 text-xs uppercase tracking-wider font-bold mb-2">🔗 URL Publicado</p>
                  <a
                    href={workflow.url_publicado}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-300 hover:text-purple-200 break-all text-sm sm:text-base"
                  >
                    {workflow.url_publicado}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Visual */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-750 border border-yellow-500 border-opacity-30 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span>⏱️</span>
              Timeline
            </h2>

            <div className="space-y-4">
              {workflow?.criado_em && (
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="w-0.5 h-12 bg-gray-700 mt-2"></div>
                  </div>
                  <div className="pt-1">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Criado</p>
                    <p className="text-white font-semibold">{new Date(workflow.criado_em).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              )}

              {workflow?.aprovado_em && (
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div className="w-0.5 h-12 bg-gray-700 mt-2"></div>
                  </div>
                  <div className="pt-1">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Aprovado</p>
                    <p className="text-white font-semibold">{new Date(workflow.aprovado_em).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              )}

              {workflow?.publicado_em && (
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    <div className="w-0.5 h-12 bg-gray-700 mt-2"></div>
                  </div>
                  <div className="pt-1">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Publicado</p>
                    <p className="text-white font-semibold">{new Date(workflow.publicado_em).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              )}

              {workflow?.metricas_7d_em && (
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="pt-1">
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Métricas Coletadas</p>
                    <p className="text-white font-semibold">{new Date(workflow.metricas_7d_em).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Análise Causal */}
          {workflow?.analise_causal && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-750 border border-yellow-500 border-opacity-30 rounded-lg p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🔍</span>
                Análise Causal
              </h2>
              <div className="bg-gray-900 bg-opacity-50 border border-gray-700 rounded p-4 sm:p-5">
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{workflow.analise_causal}</p>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com Ações */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => router.push(`/workflow/${params.id}`)}
            className="flex-1 py-3 px-4 sm:py-4 sm:px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            ← Voltar
          </button>

          <button
            onClick={handleCopiarLink}
            className={`flex-1 py-3 px-4 sm:py-4 sm:px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${
              copiado
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            📋 {copiado ? 'Copiado!' : 'Copiar Link'}
          </button>

          <button
            onClick={handleExportarImagem}
            disabled={exportando}
            className="flex-1 py-3 px-4 sm:py-4 sm:px-6 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            📥 {exportando ? 'Exportando...' : 'Exportar Imagem'}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            Case de Sucesso • Daily Prophet - Instituto Rodovansky • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
