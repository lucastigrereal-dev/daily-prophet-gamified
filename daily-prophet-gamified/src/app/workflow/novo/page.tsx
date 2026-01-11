'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { validateRequired } from '@/lib/validations';

export default function NovoWorkflowPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [postpackSelecionado, setPostpackSelecionado] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCriarWorkflow = async () => {
    const validationError = validateRequired(postpackSelecionado, 'Postpack');
    if (validationError) {
      showError(validationError);
      return;
    }

    try {
      setLoading(true);
      // Gerar ID temporário (será substituído por ID real do Supabase)
      // const workflow = await createWorkflow(postpackSelecionado)
      const workflowId = `wf_${Date.now()}`;

      success('✓ Workflow criado com sucesso!');
      router.push(`/workflow/${workflowId}/fase-1`);
    } catch (err) {
      showError('Erro ao criar workflow');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
        <p className="ml-4 text-gray-600">Carregando postpacks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Criar Novo Workflow
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione o Postpack
              </label>
              <select
                value={postpackSelecionado}
                onChange={(e) => setPostpackSelecionado(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">-- Escolha um postpack --</option>
                <option value="postpack-1">Postpack 1</option>
                <option value="postpack-2">Postpack 2</option>
                <option value="postpack-3">Postpack 3</option>
              </select>
            </div>

            <button
              onClick={handleCriarWorkflow}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Criar Workflow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
