'use client';

import { Metricas24h } from '@/types/workflow';

interface Props {
  metricas24h?: Metricas24h;
  metricas7d?: Metricas24h;
  onEdit?: () => void;
  updatedAt?: string;
}

export function MetricsDisplay({ metricas24h, metricas7d, onEdit, updatedAt }: Props) {
  if (!metricas24h && !metricas7d) {
    return null;
  }

  const MetricCard = ({
    emoji,
    label,
    value24h,
    value7d,
  }: {
    emoji: string;
    label: string;
    value24h?: number;
    value7d?: number;
  }) => {
    const val24 = value24h || 0;
    const val7 = value7d || 0;
    const growth = val24 > 0 && val7 > 0 ? ((val7 - val24) / val24 * 100).toFixed(0) : '0';

    return (
      <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
        <div className="text-center">
          <div className="text-2xl mb-1">{emoji}</div>
          <div className="text-xs font-semibold text-gray-600 uppercase">{label}</div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-center">
          <div className="bg-white rounded py-1 px-2">
            <div className="text-xs text-gray-500">24h</div>
            <div className="text-sm font-bold text-gray-900">{val24.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded py-1 px-2">
            <div className="text-xs text-gray-500">7d</div>
            <div className="text-sm font-bold text-gray-900">{val7.toLocaleString()}</div>
          </div>
        </div>
        {val24 > 0 && val7 > 0 && (
          <div className="mt-2 text-center">
            <div className={`text-xs font-semibold ${val7 >= val24 ? 'text-green-600' : 'text-red-600'}`}>
              {val7 >= val24 ? '📈' : '📉'} {growth}%
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">📊 Métricas</h2>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded font-medium transition-colors"
          >
            ✏️ Editar
          </button>
        )}
      </div>

      {/* Timestamp */}
      {updatedAt && (
        <p className="text-xs text-gray-500">
          Atualizado em {new Date(updatedAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard
          emoji="👁️"
          label="Views"
          value24h={metricas24h?.views}
          value7d={metricas7d?.views}
        />
        <MetricCard
          emoji="❤️"
          label="Likes"
          value24h={metricas24h?.likes}
          value7d={metricas7d?.likes}
        />
        <MetricCard
          emoji="💾"
          label="Saves"
          value24h={metricas24h?.saves}
          value7d={metricas7d?.saves}
        />
        <MetricCard
          emoji="💬"
          label="Comments"
          value24h={metricas24h?.comments}
          value7d={metricas7d?.comments}
        />
        <MetricCard
          emoji="🔗"
          label="Shares"
          value24h={metricas24h?.shares}
          value7d={metricas7d?.shares}
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-xs text-gray-600 uppercase font-semibold">Total 24h</div>
          <div className="text-xl font-bold text-blue-600">
            {((metricas24h?.views || 0) +
              (metricas24h?.likes || 0) +
              (metricas24h?.saves || 0) +
              (metricas24h?.comments || 0) +
              (metricas24h?.shares || 0)).toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-600 uppercase font-semibold">Total 7d</div>
          <div className="text-xl font-bold text-blue-600">
            {((metricas7d?.views || 0) +
              (metricas7d?.likes || 0) +
              (metricas7d?.saves || 0) +
              (metricas7d?.comments || 0) +
              (metricas7d?.shares || 0)).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
