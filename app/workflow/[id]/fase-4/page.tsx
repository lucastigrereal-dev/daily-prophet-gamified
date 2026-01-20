'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Fase4Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [urlPost, setUrlPost] = useState('');
  const [copiado, setCopiado] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', params.id)
        .single();
      if (data) {
        setWorkflow(data);
        setUrlPost(data.url_publicado || '');
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  const copyToClipboard = async (text: string, tipo: string) => {
    await navigator.clipboard.writeText(text);
    setCopiado(tipo);
    setTimeout(() => setCopiado(null), 2000);
  };

  const getLegendaCompleta = () => {
    if (!workflow) return '';
    const legenda = workflow.legenda_data?.texto || '';
    const cta = workflow.cta_data?.texto || '';
    return `${legenda}\n\n${cta}`;
  };

  const handleConfirmarPublicacao = async () => {
    await supabase
      .from('workflows')
      .update({
        status: 'publicado',
        url_publicado: urlPost,
        publicado_em: new Date().toISOString()
      })
      .eq('id', params.id);

    router.push(`/workflow/${params.id}/fase-5`);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🚀 Fase 4: Publicação</h1>
          <p className="text-gray-600">Copie o conteúdo e publique</p>
        </div>

        {/* Legenda + CTA */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800">📝 Legenda + CTA</h3>
            <button
              onClick={() => copyToClipboard(getLegendaCompleta(), 'legenda')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${copiado === 'legenda'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            >
              {copiado === 'legenda' ? '✓ Copiado!' : '📋 Copiar'}
            </button>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="whitespace-pre-wrap text-gray-700 text-sm">{getLegendaCompleta()}</p>
          </div>
        </div>

        {/* URL Publicado */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">🔗 URL do Post Publicado</h3>
          <input
            type="url"
            value={urlPost}
            onChange={(e) => setUrlPost(e.target.value)}
            placeholder="https://instagram.com/p/..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
          />
          <p className="text-xs text-gray-400 mt-2">Cole aqui o link do post após publicar</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push(`/workflow/${params.id}/fase-3`)}
            className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
          >
            ← Voltar
          </button>
          <button
            onClick={handleConfirmarPublicacao}
            disabled={!urlPost}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-colors
              ${urlPost
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            ✅ Confirmar → Métricas
          </button>
        </div>
      </div>
    </div>
  );
}
