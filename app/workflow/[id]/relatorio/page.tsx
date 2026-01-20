'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type MetricasMomento = {
  views: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reach: number;
  new_followers: number;
};

export default function RelatorioPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [finalizando, setFinalizando] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', params.id)
        .single();
      if (data) {
        setWorkflow(data);
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

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

  const handleFinalizar = async () => {
    setFinalizando(true);
    try {
      await supabase
        .from('workflows')
        .update({
          status: 'concluido',
          finalizado_em: new Date().toISOString()
        })
        .eq('id', params.id);
      router.push(`/workflow/${params.id}/sucesso`);
    } catch (error) {
      console.error('Erro ao finalizar:', error);
      setFinalizando(false);
    }
  };

  const handleMarcarCaseSucesso = async () => {
    setFinalizando(true);
    try {
      await supabase
        .from('workflows')
        .update({
          case_sucesso: true,
          status: 'concluido',
          finalizado_em: new Date().toISOString()
        })
        .eq('id', params.id);
      router.push(`/workflow/${params.id}/sucesso`);
    } catch (error) {
      console.error('Erro ao marcar case de sucesso:', error);
      setFinalizando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Relatório Final</h1>
          <p className="text-gray-600">Consolidação de métricas e performance do workflow</p>
        </div>

        {/* Resumo do Workflow */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">📋 Resumo do Workflow</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Formato</p>
              <p className="font-semibold text-gray-900">{workflow?.formato?.toUpperCase()}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Objetivo</p>
              <p className="font-semibold text-gray-900">{workflow?.objetivo}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Procedimento</p>
              <p className="font-semibold text-gray-900">{workflow?.procedimento}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Status</p>
              <p className="font-semibold text-green-600">✅ {workflow?.status}</p>
            </div>
          </div>
        </div>

        {/* Conteúdo Criado */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">📝 Conteúdo Criado</h3>

          {workflow?.gancho_data && (
            <div className="mb-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <p className="text-xs text-yellow-700 font-medium">🎣 Gancho</p>
              <p className="text-gray-800 mt-2">{workflow.gancho_data.texto}</p>
            </div>
          )}

          {workflow?.legenda_data && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <p className="text-xs text-blue-700 font-medium">📝 Legenda</p>
              <p className="text-gray-800 mt-2">{workflow.legenda_data.texto}</p>
            </div>
          )}

          {workflow?.cta_data && (
            <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <p className="text-xs text-green-700 font-medium">🎯 CTA</p>
              <p className="text-gray-800 mt-2">{workflow.cta_data.texto}</p>
            </div>
          )}

          {workflow?.url_publicado && (
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
              <p className="text-xs text-purple-700 font-medium">🔗 URL Publicado</p>
              <a
                href={workflow.url_publicado}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline mt-2 block break-all text-sm"
              >
                {workflow.url_publicado}
              </a>
            </div>
          )}
        </div>

        {/* Métricas 7 Dias */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h3 className="font-bold text-gray-800 mb-6">📈 Métricas - 7 Dias</h3>

          {/* Grid de Métricas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600 mb-2">👁️ Views</p>
              <p className="text-2xl font-bold text-blue-600">{metricas7d.views.toLocaleString('pt-BR')}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs text-gray-600 mb-2">❤️ Likes</p>
              <p className="text-2xl font-bold text-red-600">{metricas7d.likes.toLocaleString('pt-BR')}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-gray-600 mb-2">💬 Comentários</p>
              <p className="text-2xl font-bold text-green-600">{metricas7d.comments.toLocaleString('pt-BR')}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs text-gray-600 mb-2">📌 Saves</p>
              <p className="text-2xl font-bold text-purple-600">{metricas7d.saves.toLocaleString('pt-BR')}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-xs text-gray-600 mb-2">↗️ Compartilhamentos</p>
              <p className="text-2xl font-bold text-orange-600">{metricas7d.shares.toLocaleString('pt-BR')}</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <p className="text-xs text-gray-600 mb-2">📢 Alcance</p>
              <p className="text-2xl font-bold text-pink-600">{metricas7d.reach.toLocaleString('pt-BR')}</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <p className="text-xs text-gray-600 mb-2">👤 Novos Seguidores</p>
              <p className="text-2xl font-bold text-indigo-600">{metricas7d.new_followers.toLocaleString('pt-BR')}</p>
            </div>
          </div>

          {/* Taxas Calculadas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-700 mb-2">📊 Taxa Engajamento</p>
              <p className="text-3xl font-bold text-blue-700">{engajamento7d}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <p className="text-xs text-gray-700 mb-2">📌 Taxa Saves</p>
              <p className="text-3xl font-bold text-purple-700">{taxaSaves7d}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <p className="text-xs text-gray-700 mb-2">↗️ Taxa Compartilhamentos</p>
              <p className="text-3xl font-bold text-orange-700">{taxaCompartilhamentos7d}</p>
            </div>
          </div>
        </div>

        {/* Análise Causal */}
        {workflow?.analise_causal && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h3 className="font-bold text-gray-800 mb-3">🔍 Análise Causal</h3>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700 whitespace-pre-wrap">{workflow.analise_causal}</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">⏱️ Timeline do Workflow</h3>
          <div className="space-y-3">
            {workflow?.criado_em && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Criado:</span> {new Date(workflow.criado_em).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
            {workflow?.aprovado_em && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Aprovado:</span> {new Date(workflow.aprovado_em).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
            {workflow?.publicado_em && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Publicado:</span> {new Date(workflow.publicado_em).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
            {workflow?.metricas_7d_em && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Métricas Coletadas:</span> {new Date(workflow.metricas_7d_em).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Ações Finais */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push(`/workflow/${params.id}/fase-5`)}
            className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
          >
            ← Voltar
          </button>
          <button
            onClick={handleFinalizar}
            disabled={finalizando}
            className="flex-1 py-4 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {finalizando ? 'Finalizando...' : '✅ Finalizar Workflow'}
          </button>
          <button
            onClick={handleMarcarCaseSucesso}
            disabled={finalizando}
            className="flex-1 py-4 px-6 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 disabled:opacity-50"
          >
            {finalizando ? 'Processando...' : '⭐ Case de Sucesso'}
          </button>
        </div>
      </div>
    </div>
  );
}
