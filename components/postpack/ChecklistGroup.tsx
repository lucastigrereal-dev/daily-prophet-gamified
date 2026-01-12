'use client';

import { useState } from 'react';
import { ChecklistItem, ChecklistItemProps } from './ChecklistItem';

export interface ChecklistGroupProps {
  fase: string;
  faseLabel: string;
  items: ChecklistItemProps[];
  onToggle: (id: string) => void;
}

export function ChecklistGroup({ fase, faseLabel, items, onToggle }: ChecklistGroupProps) {
  const [aberto, setAberto] = useState(true);
  const marcados = items.filter((item) => item.marcado).length;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900">
      <button
        type="button"
        onClick={() => setAberto((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-800"
        aria-expanded={aberto}
        aria-controls={`checklist-${fase}`}
      >
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-gray-100">{faseLabel}</div>
          <div className="text-xs text-gray-400">
            {marcados}/{items.length}
          </div>
        </div>
        <div className="text-xs text-gray-400">{aberto ? '▲' : '▼'}</div>
      </button>
      {aberto && (
        <div id={`checklist-${fase}`} className="px-2 pb-2">
          {items.map((item) => (
            <ChecklistItem key={item.id} {...item} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
