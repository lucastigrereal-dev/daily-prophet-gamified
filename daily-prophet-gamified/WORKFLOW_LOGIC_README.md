# Workflow Logic & Integration - Sprint 2

## Visão Geral

Este documento descreve a nova arquitetura de workflow implementada no Sprint 2, incluindo hooks customizados, componentes reutilizáveis e integração completa das 5 fases.

## Estrutura

```
src/
├── hooks/
│   └── useWorkflow.ts          # Hook para gerenciamento de estado do workflow
├── components/workflow/
│   ├── ChecklistManager.tsx    # Componente de checklist com auto-save
│   ├── ProgressBar.tsx         # Barra de progresso visual das 5 fases
│   └── index.ts               # Exports centralizados
├── types/
│   └── workflow.ts            # Tipos TypeScript do workflow
└── app/workflow/[id]/
    ├── fase-1/
    │   ├── page.tsx           # Implementação atual
    │   └── page.example.tsx   # Template de exemplo
    ├── fase-2/
    │   └── page.example.tsx
    ├── fase-3/
    │   └── page.example.tsx
    ├── fase-4/
    │   └── page.example.tsx
    └── fase-5/
        └── page.example.tsx
```

## Componentes Principais

### 1. useWorkflow Hook

Hook customizado para gerenciar o estado do workflow.

**Funcionalidades:**
- Fetch automático do workflow por ID
- Atualização otimista de estado
- Validação de avanço de fase
- Auto-refresh após updates

**Uso:**
```typescript
const {
  workflow,        // Dados do workflow
  loading,         // Estado de carregamento
  error,           // Erros
  updateWorkflow,  // Atualizar workflow
  avancarFase,     // Avançar para próxima fase
  podeAvancar,     // Validar se pode avançar
  refresh          // Recarregar dados
} = useWorkflow(workflowId)
```

### 2. ChecklistManager

Componente de checklist com auto-save e feedback visual.

**Features:**
- Auto-save com debounce de 500ms
- Progress bar integrada
- Feedback visual de conclusão
- Suporte a itens obrigatórios

**Uso:**
```typescript
<ChecklistManager
  items={FASE_ITEMS}              // Configuração dos itens
  data={workflow.fase_1.checklist} // Dados atuais
  onChange={handleChecklistChange} // Callback de mudança
  autoSave={true}                 // Auto-save ativado
/>
```

### 3. ProgressBar

Visualização das 5 fases do workflow.

**Features:**
- Indicação visual de fase atual
- Fases completadas em verde
- Animações de transição
- Ícones temáticos por fase

**Uso:**
```typescript
<ProgressBar currentPhase={1} />
```

## Fluxo de Navegação

```
Fase 1 (Criação)     → Fase 2 (Revisão)     → Fase 3 (Produção) →
Fase 4 (Publicação)  → Fase 5 (Métricas)    → Concluído
```

## Validação de Avanço

O sistema valida automaticamente se pode avançar verificando:
1. Todos os itens obrigatórios estão concluídos
2. Status do item é 'concluido' ou 'na' (não aplicável)
3. Checklist está completo

## Templates de Exemplo

Cada fase tem um arquivo `.example.tsx` mostrando:
- Como usar o hook `useWorkflow`
- Integração com `ChecklistManager`
- Navegação entre fases
- Validação de avanço
- UI consistente

## Auto-Save

O sistema implementa auto-save com debounce:
- Delay de 500ms após última alteração
- Evita requests excessivos à API
- Feedback visual de salvamento
- Retry automático em caso de erro

## Tipos TypeScript

Todos os componentes são fortemente tipados:
- `PostpackWorkflow`: Workflow completo
- `WorkflowStatus`: Estados possíveis
- `FaseData`: Dados de cada fase
- `ChecklistItemData`: Item individual da checklist
- `ChecklistItemConfig`: Configuração do item

## Exemplos de Uso

### Criar Nova Página de Fase

```typescript
'use client';

import { useRouter, useParams } from 'next/navigation';
import { useWorkflow } from '@/hooks/useWorkflow';
import { ChecklistManager, ProgressBar } from '@/components/workflow';

const ITEMS = [
  { id: 'item1', label: 'Item 1', descricao: 'Descrição', obrigatorio: true }
];

export default function FasePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { workflow, updateWorkflow, avancarFase, podeAvancar } = useWorkflow(params.id);

  const handleChecklistChange = async (checklist) => {
    await updateWorkflow({ fase_X: { ...workflow.fase_X, checklist } });
  };

  const handleAvancar = async () => {
    if (!podeAvancar()) return;
    await avancarFase();
    router.push(`/workflow/${params.id}/proxima-fase`);
  };

  return (
    <div>
      <ProgressBar currentPhase={X} />
      <ChecklistManager
        items={ITEMS}
        data={workflow.fase_X.checklist}
        onChange={handleChecklistChange}
      />
      <button onClick={handleAvancar} disabled={!podeAvancar()}>
        Avançar
      </button>
    </div>
  );
}
```

## Próximos Passos

1. Implementar testes unitários para hooks
2. Adicionar animações de transição entre fases
3. Implementar histórico de mudanças
4. Adicionar notificações de auto-save
5. Criar dashboard de overview do workflow

## Contribuindo

Ao adicionar novas funcionalidades:
1. Mantenha a consistência com os componentes existentes
2. Use os tipos TypeScript definidos
3. Implemente auto-save quando apropriado
4. Adicione validações necessárias
5. Documente mudanças significativas
