'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PostpackWorkflow } from '@/types/workflow';
import { workflowService } from '@/lib/workflow-service';
import { WorkflowStepper } from '@/components/workflow';
import { FASES_CONFIG } from '@/config/checklist-config';

export default function WorkflowDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [workflow, setWorkflow] = useState<PostpackWorkflow | null>(null);

  useEffect(() => {
    if (params.id) workflowService.getById(params.id as string).then(setWorkflow);
  }, [params.id]);

  if (!workflow) return <div className="p-4">Carregando...</div>;

  const faseAtual = workflow.status as keyof typeof FASES_CONFIG;
  const config = FASES_CONFIG[faseAtual];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <button onClick={() => router.push('/workflow')} className="mb-4">
          ← Voltar
        </button>
        <WorkflowStepper
          currentFase={faseAtual}
          workflow={workflow}
          onFaseClick={(f) =>
            router.push(`/workflow/${workflow.id}/${f.replace('_', '-')}`)
          }
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold">
          {config?.icone} {config?.nome}
        </h2>
        <button
          onClick={() =>
            router.push(`/workflow/${workflow.id}/${faseAtual.replace('_', '-')}`)
          }
          className="w-full mt-4 py-3 bg-blue-500 text-white rounded-lg"
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}
