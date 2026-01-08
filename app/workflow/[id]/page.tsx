'use client';
import { useParams, useRouter } from 'next/navigation';
import WorkflowTracker from '@/components/WorkflowTracker';

export default function WorkflowDetailPage() {
  const params = useParams();
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button onClick={() => router.push('/workflow')} className="mb-4 text-blue-500">Voltar</button>
      <h1 className="text-xl font-bold mb-4">Workflow: {params.id}</h1>
      <WorkflowTracker />
    </div>
  );
}
