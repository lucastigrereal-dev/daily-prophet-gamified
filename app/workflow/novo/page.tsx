'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Step = 1 | 2 | 3 | 4;

interface FormData {
  formato: string;
  tipo: string;
  procedimento: string;
}

const FORMATOS = [
  { id: 'reels', label: 'Reels', emoji: '📹', desc: 'Vídeo curto até 90s' },
  { id: 'carrossel', label: 'Carrossel', emoji: '📸', desc: 'Até 10 slides' },
  { id: 'stories', label: 'Stories', emoji: '📱', desc: 'Conteúdo 24h' },
];

const TIPOS = [
  { id: 'educativo', label: 'Educativo', emoji: '🎓', desc: 'Ensinar algo valioso' },
  { id: 'autoridade', label: 'Autoridade', emoji: '👑', desc: 'Mostrar expertise' },
  { id: 'prova_social', label: 'Prova Social', emoji: '⭐', desc: 'Depoimentos e resultados' },
  { id: 'conversao', label: 'Conversão', emoji: '💰', desc: 'Gerar agendamentos' },
  { id: 'engajamento', label: 'Engajamento', emoji: '🔥', desc: 'Interação e alcance' },
];

const PROCEDIMENTOS = [
  { id: 'intimax', label: 'Intimax', emoji: '💪', desc: 'Harmonização íntima masculina' },
  { id: 'full_face', label: 'Full Face', emoji: '👩', desc: 'Harmonização facial' },
  { id: 'gluteos', label: 'Glúteos', emoji: '🍑', desc: 'Procedimentos glúteos' },
];

export default function NovoWorkflowPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    formato: '',
    tipo: '',
    procedimento: '',
  });

  const handleSelect = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (field === 'formato') setStep(2);
    if (field === 'tipo') setStep(3);
    if (field === 'procedimento') setStep(4);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleCreate = async () => {
    if (!formData.formato || !formData.tipo || !formData.procedimento) {
      setError('Selecione todas as opções');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formatoLabel = FORMATOS.find(f => f.id === formData.formato)?.label || '';
      const tipoLabel = TIPOS.find(t => t.id === formData.tipo)?.label || '';
      const procLabel = PROCEDIMENTOS.find(p => p.id === formData.procedimento)?.label || '';
      const titulo = `${formatoLabel} ${tipoLabel} - ${procLabel}`;

      const { data: postpack, error: e1 } = await supabase
        .from('postpacks')
        .insert([{
          name: titulo,
          title: titulo,
          format: formData.formato,
          objective: formData.tipo,
          procedure: formData.procedimento,
          status: 'rascunho',
        }])
        .select()
        .single();

      if (e1) throw e1;

      const { data: workflow, error: e2 } = await supabase
        .from('postpack_workflow')
        .insert([{
          postpack_id: postpack.id,
          created_by: 'Tigrao',
          status: 'composicao',
          fase_1_status: 'pendente',
          fase_2_status: 'pendente',
          fase_3_status: 'pendente',
          fase_4_status: 'pendente',
          fase_5_status: 'pendente',
        }])
        .select()
        .single();

      if (e2) throw e2;

      router.push(`/workflow/${workflow.id}/montador`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Erro ao criar');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
              s === step
                ? 'bg-blue-600 text-white scale-110'
                : s < step
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {s < step ? '✓' : s}
          </div>
          {s < 4 && (
            <div className={`w-8 h-1 mx-1 ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderCards = <T extends { id: string; label: string; emoji: string; desc: string }>(
    options: T[],
    field: keyof FormData,
    selected: string
  ) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => handleSelect(field, opt.id)}
          disabled={loading}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            selected === opt.id
              ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
          }`}
        >
          <div className="text-4xl mb-3">{opt.emoji}</div>
          <div className="font-bold text-lg mb-1">{opt.label}</div>
          <div className="text-sm text-gray-500">{opt.desc}</div>
        </button>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2">Qual formato?</h2>
      <p className="text-gray-500 text-center mb-6">Escolha o tipo de conteúdo que vai criar</p>
      {renderCards(FORMATOS, 'formato', formData.formato)}
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2">Qual objetivo?</h2>
      <p className="text-gray-500 text-center mb-6">Defina o propósito do conteúdo</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TIPOS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect('tipo', opt.id)}
            disabled={loading}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              formData.tipo === opt.id
                ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="text-3xl mb-2">{opt.emoji}</div>
            <div className="font-bold mb-1">{opt.label}</div>
            <div className="text-sm text-gray-500">{opt.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2">Qual procedimento?</h2>
      <p className="text-gray-500 text-center mb-6">Selecione o foco do conteúdo</p>
      {renderCards(PROCEDIMENTOS, 'procedimento', formData.procedimento)}
    </div>
  );

  const renderStep4 = () => {
    const formato = FORMATOS.find(f => f.id === formData.formato);
    const tipo = TIPOS.find(t => t.id === formData.tipo);
    const proc = PROCEDIMENTOS.find(p => p.id === formData.procedimento);

    return (
      <div>
        <h2 className="text-2xl font-bold text-center mb-2">Confirmar PostPack</h2>
        <p className="text-gray-500 text-center mb-6">Revise suas escolhas antes de criar</p>
        
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">{formato?.emoji}</div>
              <div className="text-sm text-gray-500">Formato</div>
              <div className="font-bold">{formato?.label}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">{tipo?.emoji}</div>
              <div className="text-sm text-gray-500">Objetivo</div>
              <div className="font-bold">{tipo?.label}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">{proc?.emoji}</div>
              <div className="text-sm text-gray-500">Procedimento</div>
              <div className="font-bold">{proc?.label}</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all ${
            loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? 'Criando...' : '✨ Criar PostPack'}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => step === 1 ? router.back() : handleBack()}
            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
          >
            ← {step === 1 ? 'Voltar' : 'Passo anterior'}
          </button>
          <h1 className="text-xl font-bold mt-2">🗞️ Novo PostPack</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
            {error}
          </div>
        )}

        {renderStepIndicator()}

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {step > 1 && (
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {formData.formato && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {FORMATOS.find(f => f.id === formData.formato)?.emoji} {FORMATOS.find(f => f.id === formData.formato)?.label}
              </span>
            )}
            {formData.tipo && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {TIPOS.find(t => t.id === formData.tipo)?.emoji} {TIPOS.find(t => t.id === formData.tipo)?.label}
              </span>
            )}
            {formData.procedimento && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {PROCEDIMENTOS.find(p => p.id === formData.procedimento)?.emoji} {PROCEDIMENTOS.find(p => p.id === formData.procedimento)?.label}
              </span>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
