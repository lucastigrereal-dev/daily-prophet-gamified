'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WorkflowTracker from '@/components/WorkflowTracker';

export default function WorkflowListPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Workflows Ativos</h1>
      <button onClick={() => router.push('/workflow/novo')} className="w-full py-3 bg-blue-500 text-white rounded-lg mb-4">+ Novo PostPack</button>
      <WorkflowTracker />
    </div>
  );
}
