'use client';

import { useState } from 'react';
import { Metricas24h } from '@/types/workflow';

interface Props {
  workflowId: string;
  onSave: (metricas24h: Metricas24h, metricas7d: Metricas24h) => Promise<void>;
  initialMetricas24h?: Metricas24h;
  initialMetricas7d?: Metricas24h;
}

export function MetricsForm({
  workflowId,
  onSave,
  initialMetricas24h,
  initialMetricas7d,
}: Props) {
  const [metricas24h, setMetricas24h] = useState<Metricas24h>(
    initialMetricas24h || {
      views: 0,
      likes: 0,
      saves: 0,
      comments: 0,
      shares: 0,
    }
  );

  const [metricas7d, setMetricas7d] = useState<Metricas24h>(
    initialMetricas7d || {
      views: 0,
      likes: 0,
      saves: 0,
      comments: 0,
      shares: 0,
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange24h = (key: keyof Metricas24h, value: number) => {
    setMetricas24h({ ...metricas24h, [key]: Math.max(0, value) });
  };

  const handleChange7d = (key: keyof Metricas24h, value: number) => {
    setMetricas7d({ ...metricas7d, [key]: Math.max(0, value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onSave(metricas24h, metricas7d);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar métricas');
    } finally {
      setLoading(false);
    }
  };

  const MetricInput = ({
    label,
    emoji,
    value,
    onChange,
  }: {
    label: string;
    emoji: string;
    value: number;
    onChange: (value: number) => void;
  }) => (
    <div className="flex-1 min-w-0">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {emoji} {label}
      </label>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white rounded-lg border border-gray-200">
      {/* Erro */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Sucesso */}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          ✅ Métricas salvas com sucesso!
        </div>
      )}

      {/* Métricas 24h */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">📊 Métricas 24h</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <MetricInput
            label="Views"
            emoji="👁️"
            value={metricas24h.views || 0}
            onChange={(value) => handleChange24h('views', value)}
          />
          <MetricInput
            label="Likes"
            emoji="❤️"
            value={metricas24h.likes || 0}
            onChange={(value) => handleChange24h('likes', value)}
          />
          <MetricInput
            label="Saves"
            emoji="💾"
            value={metricas24h.saves || 0}
            onChange={(value) => handleChange24h('saves', value)}
          />
          <MetricInput
            label="Comments"
            emoji="💬"
            value={metricas24h.comments || 0}
            onChange={(value) => handleChange24h('comments', value)}
          />
          <MetricInput
            label="Shares"
            emoji="🔗"
            value={metricas24h.shares || 0}
            onChange={(value) => handleChange24h('shares', value)}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Métricas 7d */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">📊 Métricas 7 dias</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <MetricInput
            label="Views"
            emoji="👁️"
            value={metricas7d.views || 0}
            onChange={(value) => handleChange7d('views', value)}
          />
          <MetricInput
            label="Likes"
            emoji="❤️"
            value={metricas7d.likes || 0}
            onChange={(value) => handleChange7d('likes', value)}
          />
          <MetricInput
            label="Saves"
            emoji="💾"
            value={metricas7d.saves || 0}
            onChange={(value) => handleChange7d('saves', value)}
          />
          <MetricInput
            label="Comments"
            emoji="💬"
            value={metricas7d.comments || 0}
            onChange={(value) => handleChange7d('comments', value)}
          />
          <MetricInput
            label="Shares"
            emoji="🔗"
            value={metricas7d.shares || 0}
            onChange={(value) => handleChange7d('shares', value)}
          />
        </div>
      </div>

      {/* Botão Save */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? 'Salvando...' : '💾 Salvar Métricas'}
      </button>
    </form>
  );
}
