'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { useWorkflow } from '@/hooks/useWorkflow';
import { ProgressBar } from '@/components/workflow';
import SeletorGancho from '@/components/fase-1/SeletorGancho';
import SeletorLegenda from '@/components/fase-1/SeletorLegenda';
import SeletorCTA from '@/components/fase-1/SeletorCTA';
import SeletorHashtags from '@/components/fase-1/SeletorHashtags';

// 6-step stepper para Fase 1 (etapas 6-10)
const FASE_1_STEPS = [
  { id: 6, label: 'Gancho', descricao: 'Selecione o gancho (hook)' },
  { id: 7, label: 'Legenda', descricao: 'Selecione a legenda (body text)' },
  { id: 8, label: 'CTA', descricao: 'Selecione a chamada para ação' },
  { id: 9, label: 'Hashtags', descricao: 'Selecione até 30 hashtags' },
  { id: 10, label: 'Protocolo', descricao: 'Protocolo definido automaticamente' },
];

export default function Fase1Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const workflowId = params?.id || '';

  const { workflow, loading, error, updateWorkflow, avancarFase } = useWorkflow(workflowId);

  const [currentStep, setCurrentStep] = useState(6);
  const [selectedGancho, setSelectedGancho] = useState<string | null>(null);
  const [selectedLegenda, setSelectedLegenda] = useState<string | null>(null);
  const [selectedCTA, setSelectedCTA] = useState<string | null>(null);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  const handleGanchoSelect = async (gancho: any) => {
    setSelectedGancho(gancho.id);
    if (!workflow) return;
    await updateWorkflow({
      fase_1: {
        ...(workflow.fase_1 || { status: 'em_progresso', checklist: {} }),
        gancho_id: gancho.id,
        gancho_data: gancho
      }
    });
  };

  const handleLegendaSelect = async (legenda: any) => {
    setSelectedLegenda(legenda.id);
    if (!workflow) return;
    await updateWorkflow({
      fase_1: {
        ...(workflow.fase_1 || { status: 'em_progresso', checklist: {} }),
        legenda_id: legenda.id,
        legenda_data: legenda
      }
    });
  };

  const handleCTASelect = async (cta: any) => {
    setSelectedCTA(cta.id);
    if (!workflow) return;
    await updateWorkflow({
      fase_1: {
        ...(workflow.fase_1 || { status: 'em_progresso', checklist: {} }),
        cta_id: cta.id,
        cta_data: cta
      }
    });
  };

  const handleHashtagsSelect = async (hashtags: string[]) => {
    setSelectedHashtags(hashtags);
    if (!workflow) return;
    await updateWorkflow({
      fase_1: {
        ...(workflow.fase_1 || { status: 'em_progresso', checklist: {} }),
        hashtags_ids: hashtags
      }
    });
  };

  const canAdvanceStep = () => {
    if (currentStep === 6) return selectedGancho !== null;
    if (currentStep === 7) return selectedLegenda !== null;
    if (currentStep === 8) return selectedCTA !== null;
    if (currentStep === 9) return selectedHashtags.length > 0;
    if (currentStep === 10) return true; // Protocolo é auto-definido
    return false;
  };

  const handleNextStep = () => {
    if (currentStep < 10 && canAdvanceStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 6) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!canAdvanceStep()) {
      alert('Complete o protocolo antes de avançar!');
      return;
    }

    await avancarFase();
    router.push(`/workflow/${workflowId}/fase-2`);
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Erro: {error}</div>;
  if (!workflow) return <div className="p-8 text-center">Workflow não encontrado</div>;

  const stepProgress = ((currentStep - 5) / 5) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar currentPhase={1} />

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fase 1 - Composição
          </h1>
          <p className="text-gray-600">
            Selecione os componentes do seu postpack
          </p>
        </div>

        {/* Postpack Info */}
        {workflow.postpack && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">{workflow.postpack.title}</h2>
            <p className="text-gray-600 text-sm">{workflow.postpack.objective}</p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                {workflow.postpack.format}
              </span>
            </div>
          </div>
        )}

        {/* 6-Step Stepper */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between mb-6">
            {FASE_1_STEPS.map((step) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <button
                  onClick={() => currentStep >= step.id && setCurrentStep(step.id)}
                  className={`w-10 h-10 rounded-full font-semibold transition-all mb-2 ${
                    currentStep === step.id
                      ? 'bg-blue-600 text-white scale-110'
                      : currentStep > step.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step.id ? '✓' : step.id}
                </button>
                <p className="text-xs font-medium text-center text-gray-700">{step.label}</p>
              </div>
            ))}
          </div>

          {/* Step Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          {currentStep === 6 && (
            <SeletorGancho
              formato={workflow.postpack?.format || ''}
              pilar={workflow.postpack?.pillar || ''}
              objetivo={workflow.postpack?.objective || ''}
              selectedId={selectedGancho}
              onSelect={handleGanchoSelect}
            />
          )}

          {currentStep === 7 && (
            <SeletorLegenda
              formato={workflow.postpack?.format || ''}
              pilar={workflow.postpack?.pillar || ''}
              objetivo={workflow.postpack?.objective || ''}
              selectedId={selectedLegenda}
              onSelect={handleLegendaSelect}
            />
          )}

          {currentStep === 8 && (
            <SeletorCTA
              formato={workflow.postpack?.format || ''}
              pilar={workflow.postpack?.pillar || ''}
              objetivo={workflow.postpack?.objective || ''}
              selectedId={selectedCTA}
              onSelect={handleCTASelect}
            />
          )}

          {currentStep === 9 && (
            <SeletorHashtags
              formato={workflow.postpack?.format || ''}
              pilar={workflow.postpack?.pillar || ''}
              objetivo={workflow.postpack?.objective || ''}
              selectedIds={selectedHashtags}
              onSelect={handleHashtagsSelect}
            />
          )}

          {currentStep === 10 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">10. Protocolo</h3>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-900 font-medium mb-2">Protocolo definido automaticamente:</p>
                <p className="text-blue-800">
                  Com base no formato "{workflow.postpack?.format}" e objetivo "{workflow.postpack?.objective}",
                  o protocolo foi definido como <span className="font-semibold">APPROVED</span>.
                </p>
                <p className="text-blue-700 text-sm mt-2">
                  Este protocolo será aplicado automaticamente ao postpack.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/workflow')}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Voltar
          </button>

          {currentStep > 6 && (
            <button
              onClick={handlePreviousStep}
              className="px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors"
            >
              ← Anterior
            </button>
          )}

          {currentStep < 10 && (
            <button
              onClick={handleNextStep}
              disabled={!canAdvanceStep()}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              Próximo →
            </button>
          )}

          {currentStep === 10 && (
            <button
              onClick={handleComplete}
              disabled={!canAdvanceStep()}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              Concluir e Avançar para Fase 2
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
