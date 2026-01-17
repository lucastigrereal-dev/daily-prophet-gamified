import { useState, useEffect } from 'react'
import { PostpackWorkflow, WorkflowStatus, FaseNumero } from '@/types/workflow'

export function useWorkflow(workflowId: string) {
  const [workflow, setWorkflow] = useState<PostpackWorkflow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (workflowId) {
      fetchWorkflow()
    }
  }, [workflowId])

  async function fetchWorkflow() {
    try {
      setLoading(true)
      const res = await fetch(`/api/workflow/${workflowId}`)
      if (!res.ok) throw new Error('Failed to fetch workflow')
      const data = await res.json()
      setWorkflow(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateWorkflow(updates: Partial<PostpackWorkflow>) {
    try {
      const res = await fetch(`/api/workflow/${workflowId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (!res.ok) throw new Error('Update failed')
      const updated = await res.json()
      setWorkflow(updated)
      return updated
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  async function avancarFase() {
    if (!workflow) return

    const proximaFase = getProximaFase(workflow.status)
    if (!proximaFase) {
      // Workflow concluído
      return updateWorkflow({
        status: 'concluido',
        completed_at: new Date().toISOString()
      })
    }

    // Marcar fase atual como completa
    const faseAtual = workflow.status as FaseNumero
    const updates: any = {
      status: proximaFase,
      [faseAtual]: {
        ...workflow[faseAtual],
        status: 'concluido',
        completed_at: new Date().toISOString()
      }
    }

    return updateWorkflow(updates)
  }

  function getProximaFase(atual: WorkflowStatus): WorkflowStatus | null {
    const fases: FaseNumero[] = ['composicao', 'fase_1', 'fase_2', 'fase_3', 'fase_4', 'fase_5']
    const idx = fases.indexOf(atual as FaseNumero)
    return idx >= 0 && idx < fases.length - 1 ? fases[idx + 1] : null
  }

  function podeAvancar(): boolean {
    if (!workflow) return false

    const faseAtual = workflow.status as FaseNumero

    // Composição sempre pode avançar (não usa checklist)
    if (faseAtual === 'composicao') return true

    if (!workflow[faseAtual]) return true

    // Type guard: apenas fases têm checklist
    const faseData = workflow[faseAtual]
    if (!('checklist' in faseData)) return true

    const checklist = faseData.checklist
    if (!checklist || Object.keys(checklist).length === 0) return true

    // Verificar se todos os itens obrigatórios estão concluídos
    return Object.values(checklist).every((item: any) =>
      item.status === 'concluido' || item.status === 'na'
    )
  }

  return {
    workflow,
    loading,
    error,
    updateWorkflow,
    avancarFase,
    podeAvancar,
    refresh: fetchWorkflow
  }
}
