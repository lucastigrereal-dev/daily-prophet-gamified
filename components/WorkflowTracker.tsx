// Componente WorkflowTracker
"use client";
import { useState } from "react";
import type { PostpackWorkflowRow, FaseNumero } from "../types/workflow";
import { FASES_CONFIG } from "../config/checklist-config";

type FaseStatusRow = "pendente" | "em_progresso" | "concluido" | "incompleto";

interface WorkflowTrackerProps {
  workflow?: PostpackWorkflowRow;
  onFaseClick?: (fase: number) => void;
  onAvancar?: (fase: number) => void;
}

const DEMO_WORKFLOW: PostpackWorkflowRow = {
  id: "demo-001", postpack_id: "postpack-001", status: "fase_2",
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  completed_at: undefined, created_by: "Tigrao", approved_by: undefined,
  fase_1_status: "concluido", fase_1_completed_at: new Date().toISOString(), fase_1_checklist: {},
  fase_2_status: "em_progresso", fase_2_completed_at: undefined, fase_2_checklist: {}, fase_2_feedback: undefined,
  fase_3_status: "pendente", fase_3_completed_at: undefined, fase_3_checklist: {},
  fase_4_status: "pendente", fase_4_completed_at: undefined, fase_4_checklist: {}, fase_4_published_url: undefined, fase_4_published_at: undefined,
  fase_5_status: "pendente", fase_5_completed_at: undefined, fase_5_checklist: {},
  metricas_24h: undefined, metricas_7d: undefined, notas: "Post de exemplo",
};

const STATUS_COLORS: Record<FaseStatusRow, string> = {
  pendente: "bg-gray-200 text-gray-600", em_progresso: "bg-blue-500 text-white",
  concluido: "bg-green-500 text-white", incompleto: "bg-orange-500 text-white",
};
const STATUS_ICONS: Record<FaseStatusRow, string> = { pendente: "○", em_progresso: "◐", concluido: "✓", incompleto: "⚠" };

export default function WorkflowTracker({ workflow = DEMO_WORKFLOW, onFaseClick, onAvancar }: WorkflowTrackerProps) {
  const [expandedFase, setExpandedFase] = useState<number | null>(null);
  const fases = [1, 2, 3, 4, 5].map(num => ({
    num, status: (workflow as any)[`fase_${num}_status`] as FaseStatusRow,
    completed: (workflow as any)[`fase_${num}_completed_at`], checklist: (workflow as any)[`fase_${num}_checklist`]
  }));
  const getFaseConfig = (num: number) => FASES_CONFIG[(`fase_${num}`) as FaseNumero];

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Workflow do PostPack</h2>
        <p className="text-sm text-gray-500">Status: <span className="font-semibold">{workflow.status.replace("_", " ").toUpperCase()}</span></p>
      </div>
      <div className="relative">
        <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200 z-0">
          <div className="h-full bg-green-500" style={{ width: `${(fases.filter(f => f.status === "concluido").length / 5) * 100}%` }} />
        </div>
        <div className="relative z-10 flex justify-between">
          {fases.map((fase) => {
            const config = getFaseConfig(fase.num);
            const isExpanded = expandedFase === fase.num;
            return (
              <div key={fase.num} className="flex flex-col items-center">
                <button onClick={() => { setExpandedFase(isExpanded ? null : fase.num); onFaseClick?.(fase.num); }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${STATUS_COLORS[fase.status]}`}>
                  {STATUS_ICONS[fase.status]}
                </button>
                <span className="mt-2 text-sm font-medium text-gray-700">{config.nome}</span>
                {fase.completed && <span className="text-xs text-gray-400">{new Date(fase.completed).toLocaleDateString("pt-BR")}</span>}
                {isExpanded && (
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-64 bg-white rounded-lg shadow-xl p-4 z-20">
                    <h3 className="font-bold text-gray-800 mb-2">{config.nome}</h3>
                    <p className="text-sm text-gray-500 mb-3">{config.descricao}</p>
                    <div className="space-y-2">
                      {config.items.map((item) => (
                        <label key={item.id} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={fase.checklist?.[item.id]?.status === "concluido"} readOnly className="rounded" />
                          <span className="text-gray-600">{item.label}</span>
                        </label>
                      ))}
                    </div>
                    {fase.status === "em_progresso" && onAvancar && (
                      <button onClick={() => onAvancar(fase.num)} className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg">Avancar</button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {workflow.notas && <div className="mt-4 p-3 bg-yellow-50 rounded-lg"><p className="text-sm text-yellow-700">{workflow.notas}</p></div>}
    </div>
  );
}