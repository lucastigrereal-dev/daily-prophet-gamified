'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const CHECKLISTS: Record<string, string[]> = {
  reel: ['Gancho gravado', 'Conteúdo principal', 'B-roll', 'Cortes e transições', 'Legendas', 'Áudio OK', 'Duração OK'],
  carrossel: ['Imagens selecionadas', 'Textos revisados', 'Design consistente', 'Sequência lógica', 'CTA na última', 'Exportação OK'],
  stories: ['Sequência planejada', 'Primeiro story impactante', 'Interações definidas', 'CTA claro', 'Duração OK']
};

export default function Fase3Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', params.id)
        .single();
      if (data) {
        setWorkflow(data);
        setChecklist(data.checklist || {});
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  const toggleItem = async (item: string) => {
    const newChecklist = { ...checklist, [item]: !checklist[item] };
    setChecklist(newChecklist);
    await supabase
      .from('workflows')
      .update({ checklist: newChecklist })
      .eq('id', params.id);
  };

  const formato = (workflow?.formato || 'reel').toLowerCase();
  const items = CHECKLISTS[formato] || CHECKLISTS.reel;
  const completed = Object.values(checklist).filter(Boolean).length;
  const progress = Math.round((completed / items.length) * 100);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎬 Fase 3: Produção</h1>
          <p className="text-gray-600">Complete o checklist de produção</p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Progresso</span>
            <span className="text-sm font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{completed} de {items.length} completos</p>
        </div>

        {/* Checklist */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">Checklist de Produção</h3>
          <div className="space-y-2">
            {items.map((item) => (
              <label key={item} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist[item] || false}
                  onChange={() => toggleItem(item)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600"
                />
                <span className={checklist[item] ? 'text-gray-400 line-through' : 'text-gray-700'}>
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push(`/workflow/${params.id}/fase-2`)}
            className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
          >
            ← Voltar
          </button>
          <button
            onClick={() => router.push(`/workflow/${params.id}/fase-4`)}
            disabled={progress < 100}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-colors
              ${progress === 100
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            Pronto → Fase 4
          </button>
        </div>
      </div>
    </div>
  );
}

