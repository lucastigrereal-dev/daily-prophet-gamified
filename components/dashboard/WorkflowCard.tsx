'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PostpackWorkflowRow, Postpack } from '@/types/workflow';

interface WorkflowWithPostpack extends PostpackWorkflowRow {
  postpacks?: Postpack;
}

interface WorkflowCardProps {
  workflow: WorkflowWithPostpack;
  onUpdate: () => void;
}

const FORMAT_CONFIG = {
  reel: {
    badge: 'bg-pink-500',
    icon: '🎬',
    label: 'Reel'
  },
  carrossel: {
    badge: 'bg-orange-500',
    icon: '📸',
    label: 'Carrossel'
  },
  stories: {
    badge: 'bg-yellow-500',
    icon: '📱',
    label: 'Stories'
  }
};

const STATUS_CONFIG = {
  composicao: {
    badge: 'bg-gray-500',
    label: 'Composição',
    icon: '📝'
  },
  fase_1: {
    badge: 'bg-purple-500',
    label: 'Fase 1',
    icon: '1️⃣'
  },
  fase_2: {
    badge: 'bg-blue-500',
    label: 'Fase 2',
    icon: '2️⃣'
  },
  fase_3: {
    badge: 'bg-yellow-500',
    label: 'Fase 3',
    icon: '3️⃣'
  },
  fase_4: {
    badge: 'bg-green-500',
    label: 'Fase 4',
    icon: '4️⃣'
  },
  fase_5: {
    badge: 'bg-pink-500',
    label: 'Fase 5',
    icon: '5️⃣'
  },
  concluido: {
    badge: 'bg-purple-500',
    label: 'Concluído',
    icon: '✅'
  }
};

const PROCEDURE_LABELS: Record<string, string> = {
  procedimento_estetico: '💉 Procedimento Estético',
  resultado_paciente: '✨ Resultado Paciente',
  educacao_publica: '📚 Educação Pública'
};

export function WorkflowCard({ workflow, onUpdate }: WorkflowCardProps) {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const format = workflow.postpacks?.format?.toLowerCase() || 'reel';
  const formatConfig = FORMAT_CONFIG[format as keyof typeof FORMAT_CONFIG] || FORMAT_CONFIG.reel;
  const statusConfig = STATUS_CONFIG[workflow.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.composicao;
  const procedureLabel = PROCEDURE_LABELS[workflow.postpacks?.procedure || ''] || workflow.postpacks?.procedure || 'N/A';

  // Calcular progresso
  const getProgress = () => {
    const statusOrder = ['composicao', 'fase_1', 'fase_2', 'fase_3', 'fase_4', 'fase_5', 'concluido'];
    const currentIndex = statusOrder.indexOf(workflow.status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  // Calcular métricas de engajamento
  const getTotalEngagement = () => {
    const metrics = workflow.metricas_24h;
    if (!metrics) return 0;
    return (metrics.views || 0) + (metrics.likes || 0) + (metrics.saves || 0) + (metrics.comments || 0) + (metrics.shares || 0);
  };

  const handleContinue = () => {
    router.push(`/workflow/${workflow.id}`);
  };

  const handleViewReport = () => {
    router.push(`/workflow/${workflow.id}#relatorio`);
  };

  const handleDuplicate = async () => {
    setActionLoading(true);
    try {
      // TODO: Implementar duplicação de workflow
      alert('Funcionalidade de duplicação em desenvolvimento');
    } catch (error) {
      console.error('Erro ao duplicar:', error);
      alert('Erro ao duplicar workflow');
    } finally {
      setActionLoading(false);
      setShowActions(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm('Deseja realmente arquivar este workflow?')) return;

    setActionLoading(true);
    try {
      // TODO: Implementar arquivamento de workflow
      alert('Funcionalidade de arquivamento em desenvolvimento');
      onUpdate();
    } catch (error) {
      console.error('Erro ao arquivar:', error);
      alert('Erro ao arquivar workflow');
    } finally {
      setActionLoading(false);
      setShowActions(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
      {/* Header do Card */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-start justify-between mb-3">
          {/* Formato Badge */}
          <div className={`${formatConfig.badge} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5`}>
            <span>{formatConfig.icon}</span>
            <span>{formatConfig.label}</span>
          </div>

          {/* Menu de Ações */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg py-2 z-10">
                <button
                  onClick={handleContinue}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <span>▶️</span>
                  Continuar
                </button>
                <button
                  onClick={handleViewReport}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <span>📊</span>
                  Ver Relatório
                </button>
                <button
                  onClick={handleDuplicate}
                  disabled={actionLoading}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <span>📋</span>
                  Duplicar
                </button>
                <button
                  onClick={handleArchive}
                  disabled={actionLoading}
                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <span>🗄️</span>
                  Arquivar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Título */}
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
          {workflow.postpacks?.title || 'Sem título'}
        </h3>

        {/* Objetivo */}
        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
          {workflow.postpacks?.objective || 'Sem objetivo definido'}
        </p>

        {/* Status e Procedimento */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`${statusConfig.badge} text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1`}>
            <span>{statusConfig.icon}</span>
            <span>{statusConfig.label}</span>
          </span>
          <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
            {procedureLabel}
          </span>
        </div>
      </div>

      {/* Body do Card */}
      <div className="p-4">
        {/* Barra de Progresso */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-xs font-medium">Progresso</span>
            <span className="text-purple-400 text-xs font-bold">{Math.round(getProgress())}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>

        {/* Métricas */}
        {workflow.metricas_24h && (
          <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
            <div className="text-gray-400 text-xs mb-2">Métricas 24h</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-white font-bold text-sm">{workflow.metricas_24h.views || 0}</div>
                <div className="text-gray-400 text-xs">👁️ Views</div>
              </div>
              <div>
                <div className="text-white font-bold text-sm">{workflow.metricas_24h.likes || 0}</div>
                <div className="text-gray-400 text-xs">❤️ Likes</div>
              </div>
              <div>
                <div className="text-white font-bold text-sm">{workflow.metricas_24h.saves || 0}</div>
                <div className="text-gray-400 text-xs">💾 Saves</div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-purple-400 text-xs font-semibold">
                Total: {getTotalEngagement().toLocaleString()} engajamentos
              </span>
            </div>
          </div>
        )}

        {/* Data de Criação */}
        <div className="text-gray-500 text-xs mb-4">
          Criado em {new Date(workflow.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </div>

        {/* Botão Principal */}
        <button
          onClick={handleContinue}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <span>▶️</span>
          Continuar Workflow
        </button>
      </div>

      {/* Footer com Notas (se existir) */}
      {workflow.notas && (
        <div className="px-4 pb-4">
          <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-700">
            <div className="text-gray-400 text-xs mb-1">📝 Notas</div>
            <p className="text-gray-300 text-sm line-clamp-2">{workflow.notas}</p>
          </div>
        </div>
      )}
    </div>
  );
}
