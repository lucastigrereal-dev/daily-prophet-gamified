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
  registrado_em?: string;
};

export default function Fase5Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState<'30min' | '24h' | '7d'>('30min');
  const [analise, setAnalise] = useState('');
  const [metricas, setMetricas] = useState<Record<'30min' | '24h' | '7d', MetricasMomento>>({
    '30min': { views: 0, likes: 0, comments: 0, saves: 0, shares: 0, reach: 0, new_followers: 0 },
    '24h': { views: 0, likes: 0, comments: 0, saves: 0, shares: 0, reach: 0, new_followers: 0 },
    '7d': { views: 0, likes: 0, comments: 0, saves: 0, shares: 0, reach: 0, new_followers: 0 }
  });
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', params.id)
        .single();
      if (data) {
        setWorkflow(data);
        if (data.metricas) {
          setMetricas(data.metricas);
        }
        if (data.analise_causal) {
          setAnalise(data.analise_causal);
        }
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  const updateMetrica = (momento: '30min' | '24h' | '7d', campo: keyof MetricasMomento, valor: number) => {
    setMetricas(prev => ({
      ...prev,
      [momento]: {
        ...prev[momento],
        [campo]: valor
      }
    }));
  };

  const handleSalvarMetricas = async () => {
    setSalvando(true);
    try {
      const updateData: any = {
        metricas
      };

      // Adiciona timestamp do momento registrado
      if (abaAtiva === '30min') {
        updateData.metricas_30min_em = new Date().toISOString();
      } else if (abaAtiva === '24h') {
        updateData.metricas_24h_em = new Date().toISOString();
      } else if (abaAtiva === '7d') {
        updateData.metricas_7d_em = new Date().toISOString();
      }

      await supabase
        .from('workflows')
        .update(updateData)
        .eq('id', params.id);
    } catch (error) {
      console.error('Erro ao salvar métricas:', error);
    } finally {
      setSalvando(false);
    }
  };

  const handleSalvarAnalise = async () => {
    setSalvando(true);
    try {
      await supabase
        .from('workflows')
        .update({ analise_causal: analise })
        .eq('id', params.id);
    } catch (error) {
      console.error('Erro ao salvar análise:', error);
    } finally {
      setSalvando(false);
    }
  };

  const handleAvancar = async () => {
    if (!analise.trim()) {
      alert('Por favor, complete a análise causal antes de prosseguir');
      return;
    }
    await supabase
      .from('workflows')
      .update({ status: 'metricas_coletadas' })
      .eq('id', params.id);
    router.push(`/workflow/${params.id}/relatorio`);
  };

  const calcularEngajamento = () => {
    const metricas_aba = metricas[abaAtiva];
    if (metricas_aba.reach === 0) return '0%';
    const engajamento = ((metricas_aba.likes + metricas_aba.comments + metricas_aba.saves) / metricas_aba.reach) * 100;
    return engajamento.toFixed(1) + '%';
  };

  const calcularTaxaSaves = () => {
    const metricas_aba = metricas[abaAtiva];
    if (metricas_aba.reach === 0) return '0%';
    const taxa = (metricas_aba.saves / metricas_aba.reach) * 100;
    return taxa.toFixed(1) + '%';
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
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Fase 5: Métricas</h1>
          <p className="text-gray-600">Colete métricas em diferentes momentos e analise o desempenho</p>
        </div>

        {/* Abas */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-2">
            {(['30min', '24h', '7d'] as const).map(aba => (
              <button
                key={aba}
                onClick={() => setAbaAtiva(aba)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  abaAtiva === aba
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {aba === '30min' ? '⏱️ 30 min' : aba === '24h' ? '📅 24h' : '📈 7 dias'}
              </button>
            ))}
          </div>
        </div>

        {/* Métricas */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">📊 Métricas - {abaAtiva === '30min' ? '30 minutos' : abaAtiva === '24h' ? '24 horas' : '7 dias'}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">👁️ Views</label>
              <input
                type="number"
                min="0"
                value={metricas[abaAtiva].views}
                onChange={(e) => updateMetrica(abaAtiva, 'views', parseInt(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">❤️ Likes</label>
              <input
                type="number"
                min="0"
                value={metricas[abaAtiva].likes}
                onChange={(e) => updateMetrica(abaAtiva, 'likes', parseInt(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">💬 Comentários</label>
              <input
                type="number"
                min="0"
                value={metricas[abaAtiva].comments}
                onChange={(e) => updateMetrica(abaAtiva, 'comments', parseInt(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📌 Saves</label>
              <input
                type="number"
                min="0"
                value={metricas[abaAtiva].saves}
                onChange={(e) => updateMetrica(abaAtiva, 'saves', parseInt(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">↗️ Compartilhamentos</label>
              <input
                type="number"
                min="0"
                value={metricas[abaAtiva].shares}
                onChange={(e) => updateMetrica(abaAtiva, 'shares', parseInt(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📢 Alcance</label>
              <input
                type="number"
                min="0"
                value={metricas[abaAtiva].reach}
                onChange={(e) => updateMetrica(abaAtiva, 'reach', parseInt(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">👤 Novos Seguidores</label>
              <input
                type="number"
                min="0"
                value={metricas[abaAtiva].new_followers}
                onChange={(e) => updateMetrica(abaAtiva, 'new_followers', parseInt(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Stats Rápidas */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
            <div>
              <p className="text-xs text-gray-600">Taxa de Engajamento</p>
              <p className="text-lg font-bold text-blue-600">{calcularEngajamento()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Taxa de Saves</p>
              <p className="text-lg font-bold text-blue-600">{calcularTaxaSaves()}</p>
            </div>
          </div>

          <button
            onClick={handleSalvarMetricas}
            disabled={salvando}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : `💾 Salvar Métricas (${abaAtiva})`}
          </button>
        </div>

        {/* Análise Causal */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">🔍 Análise Causal</h3>
          <p className="text-sm text-gray-600 mb-3">Por que acha que o conteúdo teve esse desempenho?</p>
          <textarea
            value={analise}
            onChange={(e) => setAnalise(e.target.value)}
            placeholder="Exemplo: O gancho foi muito impactante para o público. A sequência de B-roll manteve a atenção..."
            className="w-full p-4 border border-gray-300 rounded-lg h-32 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSalvarAnalise}
            disabled={salvando}
            className="mt-3 w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : '💾 Salvar Análise'}
          </button>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push(`/workflow/${params.id}/fase-4`)}
            className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
          >
            ← Voltar
          </button>
          <button
            onClick={handleAvancar}
            disabled={!analise.trim()}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-colors
              ${analise.trim()
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            ✅ Gerar Relatório
          </button>
        </div>
      </div>
    </div>
  );
}
