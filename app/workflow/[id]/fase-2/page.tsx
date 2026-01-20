'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Fase2Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notas, setNotas] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadWorkflow() {
      try {
        const { data } = await supabase
          .from('workflows')
          .select('*')
          .eq('id', params.id)
          .single();
        if (data) setWorkflow(data);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    }
    loadWorkflow();
  }, [params.id]);

  const handleAprovar = async () => {
    setSubmitting(true);
    try {
      await supabase
        .from('workflows')
        .update({
          status: 'aprovado',
          aprovado_em: new Date().toISOString(),
          notas_aprovacao: notas
        })
        .eq('id', params.id);
      router.push(`/workflow/${params.id}/fase-3`);
    } catch (error) {
      console.error('Erro:', error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📋 Fase 2: Preview & Aprovação</h1>
          <p className="text-gray-600">Revise o PostPack antes de produzir</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className={`px-4 py-2 rounded-full text-sm font-medium text-white ${
              workflow?.formato === 'reel' ? 'bg-purple-600' :
              workflow?.formato === 'carrossel' ? 'bg-blue-600' : 'bg-pink-600'
            }`}>
              {workflow?.formato?.toUpperCase()}
            </span>
            <span className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
              {workflow?.objetivo}
            </span>
            <span className="bg-green-100 px-4 py-2 rounded-full text-sm font-medium text-green-700">
              {workflow?.procedimento}
            </span>
          </div>

          {workflow?.gancho_data && (
            <div className="mb-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <h3 className="font-semibold text-yellow-800 mb-1">🎣 Gancho</h3>
              <p className="text-gray-800">{workflow.gancho_data.texto}</p>
            </div>
          )}

          {workflow?.legenda_data && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h3 className="font-semibold text-blue-800 mb-1">📝 Legenda</h3>
              <p className="text-gray-800">{workflow.legenda_data.texto}</p>
            </div>
          )}

          {workflow?.cta_data && (
            <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h3 className="font-semibold text-green-800 mb-1">🎯 CTA</h3>
              <p className="text-gray-800">{workflow.cta_data.texto}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">📝 Notas de Ajuste</label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Adicione observações..."
            className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push(`/workflow/${params.id}/fase-1`)}
            disabled={submitting}
            className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50"
          >
            ← Voltar
          </button>
          <button
            onClick={handleAprovar}
            disabled={submitting}
            className="flex-1 py-4 px-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            ✅ Aprovar → Fase 3
          </button>
        </div>
      </div>
    </div>
  );
}
