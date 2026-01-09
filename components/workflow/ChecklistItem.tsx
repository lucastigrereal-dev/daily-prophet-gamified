'use client';

import { ChecklistItemConfig, ChecklistItemData, PostpackResumo } from '@/types/workflow';

interface Props {
  config: ChecklistItemConfig;
  data: ChecklistItemData;
  postpack: PostpackResumo;
  onChange: (data: Partial<ChecklistItemData>) => void;
  disabled?: boolean;
  onOpenModal?: () => void;
}

export function ChecklistItem({
  config,
  data,
  onChange,
  disabled,
  onOpenModal,
}: Props) {
  const status = data?.status || 'pendente';
  const icon =
    status === 'concluido'
      ? '✅'
      : status === 'pulado'
        ? '⚠️'
        : status === 'na'
          ? '➖'
          : '⚪';

  return (
    <div
      className={`flex items-center justify-between gap-3 p-3 sm:p-4 min-h-[56px] border-b ${disabled ? 'opacity-50' : ''}`}
      onClick={() => !disabled && onOpenModal?.()}
    >
      <div className="flex-1">
        <p className="font-medium text-sm sm:text-base">{config.label}</p>
        <p className="text-xs sm:text-sm text-gray-500">{config.descricao}</p>
      </div>
      <span className="text-xl sm:text-2xl ml-1">{icon}</span>
    </div>
  );
}
