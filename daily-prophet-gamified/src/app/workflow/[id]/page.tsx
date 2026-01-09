'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PostpackWorkflow } from '@/types/workflow';
import { workflowService } from '@/lib/workflow-service';
import { WorkflowStepper, PostpackInfo } from '@/components/workflow';
import { FASES_CONFIG } from '@/config/checklist-config';

export default function WorkflowDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [workflow, setWorkflow] = useState<PostpackWorkflow | null>(null);
  const id = params?.id;

  useEffect(() => {
    if (id) workflowService.getById(id).then(setWorkflow);
  }, [id]);

  if (!workflow) return <div className="p-4">Carregando...</div>;

  const faseAtual = workflow.status as keyof typeof FASES_CONFIG;
  const config = FASES_CONFIG[faseAtual];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <button
          onClick={() => router.push('/workflow')}
          className="mb-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Voltar
        </button>

        {/* Informações do Postpack */}
        <PostpackInfo
          postpack={workflow.postpack}
          postpackId={workflow.postpack_id}
          variant="full"
          className="mb-4"
        />

        {/* Stepper de Fases */}
        <WorkflowStepper
          currentFase={faseAtual}
          workflow={workflow}
          onFaseClick={(f) =>
            router.push(`/workflow/${workflow.id}/${f.replace('_', '-')}`)
          }
        />
      </div>

      {/* Fase Atual */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">
            {config?.icone} {config?.nome}
          </h2>
          <p className="text-sm text-gray-600 mb-4">{config?.descricao}</p>
          <button
            onClick={() =>
              router.push(`/workflow/${workflow.id}/${faseAtual.replace('_', '-')}`)
            }
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );
}
