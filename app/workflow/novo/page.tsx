'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovoWorkflowPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const handleCreate = async () => {
    // TODO: Criar workflow via API
    alert('Workflow criado! (implementar API)');
    router.push('/workflow');
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button onClick={() => router.back()} className="mb-4 text-blue-500">Voltar</button>
      <h1 className="text-2xl font-bold mb-4">Novo Workflow</h1>
      <input type="text" placeholder="Titulo do PostPack" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border rounded-lg mb-4" />
      <button onClick={handleCreate} className="w-full py-3 bg-green-500 text-white rounded-lg">Criar Workflow</button>
    </div>
  );
}
