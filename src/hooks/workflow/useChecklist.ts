'use client';
import { useState, useCallback, useMemo } from 'react';
import { ChecklistItemData, FaseNumero } from '@/types/workflow';
import { FASES_CONFIG } from '@/config/checklist-config';

export function useChecklist(fase: FaseNumero, initialData: Record<string, ChecklistItemData>, onUpdate: (itemId: string, data: Partial<ChecklistItemData>) => void) {
  const [items, setItems] = useState(initialData);
  const config = FASES_CONFIG[fase];

  const updateItem = useCallback((itemId: string, data: Partial<ChecklistItemData>) => {
    const updated = { ...items, [itemId]: { ...items[itemId], ...data, timestamp: new Date().toISOString() } };
    setItems(updated);
    onUpdate(itemId, data);
  }, [items, onUpdate]);

  const getProgress = useCallback(() => {
    const obrigatorios = config.items.filter(i => i.obrigatorio);
    const done = obrigatorios.filter(i => items[i.id]?.status === 'concluido' || items[i.id]?.status === 'pulado').length;
    return Math.round((done / obrigatorios.length) * 100);
  }, [items, config]);

  const isComplete = useCallback(() => getProgress() === 100, [getProgress]);
  const getPendingItems = useCallback(() => config.items.filter(i => i.obrigatorio && (!items[i.id] || items[i.id].status === 'pendente')).map(i => i.id), [items, config]);
  const getSkippedItems = useCallback(() => Object.entries(items).filter(([_, v]) => v.status === 'pulado').map(([k]) => k), [items]);

  return { items, updateItem, getProgress, isComplete, getPendingItems, getSkippedItems };
}
