'use client';

export interface ChecklistItemProps {
  id: string;
  titulo: string;
  descricao?: string;
  dica?: string;
  obrigatorio: boolean;
  marcado: boolean;
  onToggle: (id: string) => void;
}

export function ChecklistItem({
  id,
  titulo,
  descricao,
  dica,
  obrigatorio,
  marcado,
  onToggle,
}: ChecklistItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800">
      <input
        type="checkbox"
        checked={marcado}
        onChange={() => onToggle(id)}
        className="mt-1 w-5 h-5"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={marcado ? 'line-through text-gray-500' : ''}>{titulo}</span>
          {obrigatorio && <span className="text-red-500 text-xs">*</span>}
        </div>
        {descricao && <p className="text-sm text-gray-400">{descricao}</p>}
        {dica && <p className="text-xs text-blue-400 mt-1">{dica}</p>}
      </div>
    </div>
  );
}
