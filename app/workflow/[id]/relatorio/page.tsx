'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PostpackWorkflow } from '@/types/workflow';
import { workflowService } from '@/lib/workflow-service';
import { RelatorioFinal } from '@/components/workflow';

export default function RelatorioPage() {
  const params = useParams<{ id: string }>();
  const [workflow, setWorkflow] = useState<PostpackWorkflow | null>(null);
  const id = params?.id;

  useEffect(() => {
    if (id) workflowService.getById(id).then(setWorkflow);
  }, [id]);

  if (!workflow) return <div className="p-4">Carregando...</div>;

  return (
    <RelatorioFinal
      workflow={workflow}
      postpack={
        workflow.postpack || {
          id: workflow.postpack_id,
          title: `Postpack ${workflow.postpack_id}`,
          objective: 'Informações não disponíveis',
          format: 'N/A',
          status: 'N/A',
        }
      }
    />
  );
}
