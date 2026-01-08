'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PostpackWorkflow } from '@/types/workflow';
import { workflowService } from '@/lib/workflow-service';
import { RelatorioFinal } from '@/components/workflow';

export default function RelatorioPage() {
  const params = useParams();
  const [workflow, setWorkflow] = useState<PostpackWorkflow | null>(null);

  useEffect(() => {
    if (params.id) workflowService.getById(params.id as string).then(setWorkflow);
  }, [params.id]);

  if (!workflow) return <div className="p-4">Carregando...</div>;

  return (
    <RelatorioFinal
      workflow={workflow}
      postpack={{
        id: workflow.postpack_id,
        title: '',
        objective: '',
        format: '',
        status: '',
      }}
    />
  );
}
