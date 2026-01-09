'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function NovoWorkflowPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ titulo: '', descricao: '', criador: 'Tigrao' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.titulo.trim()) { setError('Titulo obrigatorio'); return; }

    try {
      setLoading(true);
      setError(null);

      const { data: postpack, error: e1 } = await supabase
        .from('postpacks')
        .insert([{ name: formData.titulo, description: formData.descricao }])
        .select()
        .single();
      if (e1) throw e1;

      const { data: workflow, error: e2 } = await supabase
        .from('postpack_workflow')
        .insert([{
          postpack_id: postpack.id,
          created_by: formData.criador,
          status: 'fase_1',
          fase_1_status: 'em_progresso',
          notas: formData.descricao,
        }])
        .select()
        .single();
      if (e2) throw e2;

      router.push(`/workflow/${workflow.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button onClick={() => router.back()} className="text-blue-600 hover:underline mb-2">&larr; Voltar</button>
          <h1 className="text-2xl font-bold">Novo PostPack</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Titulo *</label>
            <input type="text" value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ex: Post sobre Botox" className="w-full px-4 py-3 border rounded-lg" disabled={loading} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descricao</label>
            <textarea value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva o objetivo..." rows={4} className="w-full px-4 py-3 border rounded-lg" disabled={loading} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Criado por</label>
            <select value={formData.criador} onChange={(e) => setFormData({ ...formData, criador: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg" disabled={loading}>
              <option value="Tigrao">Tigrao</option>
              <option value="Dra. Karina">Dra. Karina</option>
              <option value="Equipe">Equipe</option>
              <option value="Sistema">Sistema (IA)</option>
            </select>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Fases do Workflow</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Criacao - Hook, legenda, CTA, hashtags</li>
              <li>2. Revisao - Ortografia e tom</li>
              <li>3. Aprovacao - Dra. Karina</li>
              <li>4. Publicacao - Instagram</li>
              <li>5. Metricas - Resultados</li>
            </ol>
          </div>

          <button type="submit" disabled={loading}
            className={`w-full py-3 rounded-lg font-medium text-white ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>
            {loading ? 'Criando...' : 'Criar PostPack'}
          </button>
        </form>
      </main>
    </div>
  );
}
