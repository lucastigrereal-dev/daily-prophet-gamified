'use client'
import { useState, useEffect } from 'react'
import { ChecklistItemConfig, ChecklistItemData } from '@/types/workflow'

interface Props {
  items: ChecklistItemConfig[]
  data: Record<string, ChecklistItemData>
  onChange: (data: Record<string, ChecklistItemData>) => void
  autoSave?: boolean
}

export default function ChecklistManager({ items, data, onChange, autoSave = true }: Props) {
  const [checklist, setChecklist] = useState<Record<string, ChecklistItemData>>(data)

  useEffect(() => {
    setChecklist(data)
  }, [data])

  useEffect(() => {
    if (autoSave && JSON.stringify(checklist) !== JSON.stringify(data)) {
      const timer = setTimeout(() => {
        onChange(checklist)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [checklist, autoSave, data])

  function toggleItem(id: string) {
    setChecklist(prev => {
      const current = prev[id] || { id, status: 'pendente' }
      const newStatus = current.status === 'concluido' ? 'pendente' : 'concluido'

      return {
        ...prev,
        [id]: {
          ...current,
          status: newStatus,
          timestamp: newStatus === 'concluido' ? new Date().toISOString() : undefined
        }
      }
    })
  }

  const completedCount = items.filter(item => {
    const itemData = checklist[item.id]
    return itemData?.status === 'concluido'
  }).length

  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0
  const allDone = items.length > 0 && completedCount === items.length

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Checklist</h2>
        <span className="text-sm text-gray-500 font-medium">
          {Math.round(progress)}% completo
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map(item => {
          const itemData = checklist[item.id]
          const isDone = itemData?.status === 'concluido'

          return (
            <label
              key={item.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer transition"
            >
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => toggleItem(item.id)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className={`flex-1 ${isDone ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {item.label}
              </span>
              {isDone && (
                <span className="text-green-500 text-sm">✓</span>
              )}
            </label>
          )
        })}
      </div>

      {allDone && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm font-medium">
            ✓ Todos os itens concluídos! Você pode avançar para a próxima fase.
          </p>
        </div>
      )}
    </div>
  )
}
