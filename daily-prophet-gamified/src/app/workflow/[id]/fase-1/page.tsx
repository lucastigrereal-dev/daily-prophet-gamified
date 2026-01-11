'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import LoadingPage from '@/components/ui/LoadingPage';

export default function Fase1Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState({
    item1: false,
    item2: false,
    item3: false,
  });

  const handleCheckboxChange = async (item: keyof typeof checklist) => {
    const newChecklist = {
      ...checklist,
      [item]: !checklist[item],
    };
    setChecklist(newChecklist);

    // Simulação de salvamento - substituir por chamada real ao backend
    try {
      // await updateWorkflow({ fase_1_checklist: newChecklist })
      success('Checklist salvo com sucesso!');
    } catch (err) {
      error('Erro ao salvar checklist');
    }
  };

  const handleAvancar = async () => {
    try {
      setLoading(true);
      // await avancarFase()
      success('✓ Avançado para Fase 2!');
      if (params?.id) router.push(`/workflow/${params.id}/fase-2`);
    } catch (err) {
      error('Erro ao avançar de fase');
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage message="Carregando workflow..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Fase 1 - Criação
          </h1>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="item1"
                checked={checklist.item1}
                onChange={() => handleCheckboxChange('item1')}
                className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="item1" className="text-gray-700 cursor-pointer">
                Item 1: Definir objetivo do postpack
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="item2"
                checked={checklist.item2}
                onChange={() => handleCheckboxChange('item2')}
                className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="item2" className="text-gray-700 cursor-pointer">
                Item 2: Escolher formato do conteúdo
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="item3"
                checked={checklist.item3}
                onChange={() => handleCheckboxChange('item3')}
                className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="item3" className="text-gray-700 cursor-pointer">
                Item 3: Revisar informações básicas
              </label>
            </div>
          </div>

          <button
            onClick={handleAvancar}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Avançar para Fase 2
          </button>
        </div>
      </div>
    </div>
  );
}
