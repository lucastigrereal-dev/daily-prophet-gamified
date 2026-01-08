'use client';

import {
  FaseNumero,
  FaseConfig,
  FaseData,
  PostpackResumo,
  ChecklistItemData,
} from '@/types/workflow';
import { ChecklistItem } from './ChecklistItem';
import { ProgressBar } from './ProgressBar';

interface Props {
  fase: FaseNumero;
  config: FaseConfig;
  data: FaseData;
  postpack: PostpackResumo;
  onItemChange: (itemId: string, data: Partial<ChecklistItemData>) => void;
  onAvancar: () => void;
  onVoltar: () => void;
  podeAvancar: boolean;
  onOpenModal: (itemId: string) => void;
}

export function FaseChecklist({
  config,
  data,
  postpack,
  onItemChange,
  onAvancar,
  onVoltar,
  podeAvancar,
  onOpenModal,
}: Props) {
  const total = config.items.filter((i) => i.obrigatorio).length;
  const done = config.items.filter(
    (i) =>
      i.obrigatorio &&
      (data.checklist[i.id]?.status === 'concluido' ||
        data.checklist[i.id]?.status === 'pulado')
  ).length;
  const progress = Math.round((done / total) * 100);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-xl font-bold">
          {config.icone} {config.nome}
        </h2>
        <p className="text-gray-600">{config.descricao}</p>
        <div className="mt-2">
          <ProgressBar progress={progress} />
          <p className="text-sm text-right mt-1">{progress}%</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {config.items.map((item) => (
          <ChecklistItem
            key={item.id}
            config={item}
            data={data.checklist[item.id] || { id: item.id, status: 'pendente' }}
            postpack={postpack}
            onChange={(d) => onItemChange(item.id, d)}
            onOpenModal={() => onOpenModal(item.id)}
          />
        ))}
      </div>

      <div className="p-4 border-t flex gap-2">
        <button onClick={onVoltar} className="flex-1 py-3 border rounded-lg">
          ← Voltar
        </button>
        <button
          onClick={onAvancar}
          className="flex-1 py-3 bg-blue-500 text-white rounded-lg"
        >
          {podeAvancar ? 'Avançar →' : 'Avançar ⚠️'}
        </button>
      </div>
    </div>
  );
}
