'use client';

import type { PostpackWorkflowRow, Postpack } from '@/types/workflow';

interface WorkflowWithPostpack extends PostpackWorkflowRow {
  postpacks?: Postpack;
}

interface WorkflowStatsProps {
  workflows: WorkflowWithPostpack[];
}

export function WorkflowStats({ workflows }: WorkflowStatsProps) {
  // Calcular estatísticas gerais
  const totalWorkflows = workflows.length;

  // Workflows por status
  const statusCounts = {
    composicao: workflows.filter(w => w.status === 'composicao').length,
    fase_1: workflows.filter(w => w.status === 'fase_1').length,
    fase_2: workflows.filter(w => w.status === 'fase_2').length,
    fase_3: workflows.filter(w => w.status === 'fase_3').length,
    fase_4: workflows.filter(w => w.status === 'fase_4').length,
    fase_5: workflows.filter(w => w.status === 'fase_5').length,
    concluido: workflows.filter(w => w.status === 'concluido').length,
  };

  // Workflows por formato
  const formatCounts = {
    reel: workflows.filter(w => w.postpacks?.format?.toLowerCase() === 'reel').length,
    carrossel: workflows.filter(w => w.postpacks?.format?.toLowerCase() === 'carrossel').length,
    stories: workflows.filter(w => w.postpacks?.format?.toLowerCase() === 'stories').length,
  };

  // Workflows por procedimento
  const procedureCounts = {
    procedimento_estetico: workflows.filter(w => w.postpacks?.procedure === 'procedimento_estetico').length,
    resultado_paciente: workflows.filter(w => w.postpacks?.procedure === 'resultado_paciente').length,
    educacao_publica: workflows.filter(w => w.postpacks?.procedure === 'educacao_publica').length,
  };

  // Calcular engajamento médio
  const totalEngagement = workflows.reduce((sum, w) => {
    const metrics = w.metricas_24h;
    if (!metrics) return sum;
    return sum + (metrics.views || 0) + (metrics.likes || 0) + (metrics.saves || 0) +
           (metrics.comments || 0) + (metrics.shares || 0);
  }, 0);

  const workflowsWithMetrics = workflows.filter(w => w.metricas_24h).length;
  const avgEngagement = workflowsWithMetrics > 0 ? Math.round(totalEngagement / workflowsWithMetrics) : 0;

  // Taxa de conclusão
  const completionRate = totalWorkflows > 0
    ? Math.round((statusCounts.concluido / totalWorkflows) * 100)
    : 0;

  // Workflows em andamento (não concluídos)
  const inProgress = totalWorkflows - statusCounts.concluido;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Total de Workflows */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="text-3xl">📊</div>
          <div className="text-purple-200 text-sm font-medium">Total</div>
        </div>
        <div className="text-4xl font-bold mb-1">{totalWorkflows}</div>
        <div className="text-purple-200 text-sm">Workflows</div>
      </div>

      {/* Workflows em Andamento */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="text-3xl">⚡</div>
          <div className="text-blue-200 text-sm font-medium">Ativos</div>
        </div>
        <div className="text-4xl font-bold mb-1">{inProgress}</div>
        <div className="text-blue-200 text-sm">Em Andamento</div>
      </div>

      {/* Workflows Concluídos */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="text-3xl">✅</div>
          <div className="text-green-200 text-sm font-medium">Concluídos</div>
        </div>
        <div className="text-4xl font-bold mb-1">{statusCounts.concluido}</div>
        <div className="text-green-200 text-sm">Taxa: {completionRate}%</div>
      </div>

      {/* Engajamento Médio */}
      <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="text-3xl">🔥</div>
          <div className="text-pink-200 text-sm font-medium">Engajamento</div>
        </div>
        <div className="text-4xl font-bold mb-1">{avgEngagement.toLocaleString()}</div>
        <div className="text-pink-200 text-sm">Média 24h</div>
      </div>

      {/* Distribuição por Status */}
      <div className="bg-gray-800 rounded-xl p-6 md:col-span-2">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>📈</span>
          Distribuição por Status
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">📝 Composição</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gray-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalWorkflows > 0 ? (statusCounts.composicao / totalWorkflows) * 100 : 0}%` }}
                />
              </div>
              <span className="text-white font-semibold text-sm w-8 text-right">{statusCounts.composicao}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">1️⃣ Fase 1</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalWorkflows > 0 ? (statusCounts.fase_1 / totalWorkflows) * 100 : 0}%` }}
                />
              </div>
              <span className="text-white font-semibold text-sm w-8 text-right">{statusCounts.fase_1}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">2️⃣ Fase 2</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalWorkflows > 0 ? (statusCounts.fase_2 / totalWorkflows) * 100 : 0}%` }}
                />
              </div>
              <span className="text-white font-semibold text-sm w-8 text-right">{statusCounts.fase_2}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">3️⃣ Fase 3</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalWorkflows > 0 ? (statusCounts.fase_3 / totalWorkflows) * 100 : 0}%` }}
                />
              </div>
              <span className="text-white font-semibold text-sm w-8 text-right">{statusCounts.fase_3}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">4️⃣ Fase 4</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalWorkflows > 0 ? (statusCounts.fase_4 / totalWorkflows) * 100 : 0}%` }}
                />
              </div>
              <span className="text-white font-semibold text-sm w-8 text-right">{statusCounts.fase_4}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">5️⃣ Fase 5</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalWorkflows > 0 ? (statusCounts.fase_5 / totalWorkflows) * 100 : 0}%` }}
                />
              </div>
              <span className="text-white font-semibold text-sm w-8 text-right">{statusCounts.fase_5}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">✅ Concluído</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalWorkflows > 0 ? (statusCounts.concluido / totalWorkflows) * 100 : 0}%` }}
                />
              </div>
              <span className="text-white font-semibold text-sm w-8 text-right">{statusCounts.concluido}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Distribuição por Formato */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>🎬</span>
          Por Formato
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">🎬 Reels</span>
            <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {formatCounts.reel}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">📸 Carrossel</span>
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {formatCounts.carrossel}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">📱 Stories</span>
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {formatCounts.stories}
            </span>
          </div>
        </div>
      </div>

      {/* Distribuição por Procedimento */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span>💉</span>
          Por Procedimento
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">💉 Estético</span>
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {procedureCounts.procedimento_estetico}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">✨ Resultado</span>
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {procedureCounts.resultado_paciente}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">📚 Educação</span>
            <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {procedureCounts.educacao_publica}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
