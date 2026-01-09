'use client';

import { Postpack } from '@/types/workflow';

interface PostpackInfoProps {
  postpack?: Postpack;
  postpackId: string;
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
}

export function PostpackInfo({
  postpack,
  postpackId,
  variant = 'full',
  className = '',
}: PostpackInfoProps) {
  // Fallback se postpack não existir (mostra apenas ID)
  if (!postpack) {
    return (
      <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-2xl">📦</span>
          <div>
            <p className="text-sm font-medium">Postpack ID</p>
            <p className="text-xs text-gray-400">{postpackId}</p>
          </div>
        </div>
      </div>
    );
  }

  // Variant minimal - apenas título
  if (variant === 'minimal') {
    return (
      <div className={`${className}`}>
        <h2 className="text-lg font-bold text-gray-900">{postpack.title}</h2>
      </div>
    );
  }

  // Variant compact - título + formato
  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg shadow p-3 ${className}`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">📦</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{postpack.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                {postpack.format}
              </span>
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                {postpack.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Variant full - card completo com todos os dados
  return (
    <div className={`bg-white rounded-lg shadow-md p-5 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{postpack.title}</h2>

          <div className="space-y-2">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Objetivo
              </p>
              <p className="text-sm text-gray-700">{postpack.objective}</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-gray-500">Formato:</span>
                <span className="inline-block px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                  {postpack.format}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-gray-500">Status:</span>
                <span className="inline-block px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                  {postpack.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {postpack.created_at && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Criado em {new Date(postpack.created_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
      )}
    </div>
  );
}
