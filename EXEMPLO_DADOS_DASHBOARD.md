# Exemplos de Dados do Dashboard

## Visualização Esperada

### 1. Estatísticas Gerais (Topo do Dashboard)

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   📊 Total   │  │   ⚡ Ativos  │  │ ✅ Concluídos│  │🔥 Engajamento│
│      15      │  │      12      │  │       3      │  │    1,234     │
│  Workflows   │  │Em Andamento  │  │  Taxa: 20%   │  │  Média 24h   │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

### 2. Distribuição por Status

```
📝 Composição    ████░░░░░░░░░░░░  2
1️⃣ Fase 1        ██████░░░░░░░░░░  4
2️⃣ Fase 2        ████░░░░░░░░░░░░  3
3️⃣ Fase 3        ██░░░░░░░░░░░░░░  1
4️⃣ Fase 4        ██░░░░░░░░░░░░░░  1
5️⃣ Fase 5        ██░░░░░░░░░░░░░░  1
✅ Concluído     ████░░░░░░░░░░░░  3
```

### 3. Distribuição por Formato

```
🎬 Reels        [8]
📸 Carrossel    [5]
📱 Stories      [2]
```

### 4. Distribuição por Procedimento

```
💉 Estético     [7]
✨ Resultado    [5]
📚 Educação     [3]
```

---

## Exemplo de Card de Workflow

### Card Completo (com métricas)

```
┌─────────────────────────────────────────────┐
│ [🎬 Reel]                          [⋮ Menu] │
│                                              │
│ Como clarear manchas de melasma             │
│ Educar público sobre tratamento eficaz      │
│                                              │
│ [1️⃣ Fase 1] [💉 Procedimento Estético]      │
│                                              │
│ Progresso                            25%     │
│ ████████░░░░░░░░░░░░░░░░░░░░                │
│                                              │
│ ┌─────────────────────────────────────────┐ │
│ │ Métricas 24h                            │ │
│ │ 👁️ Views  ❤️ Likes  💾 Saves            │ │
│ │   1,245     320      89                 │ │
│ │ Total: 1,654 engajamentos               │ │
│ └─────────────────────────────────────────┘ │
│                                              │
│ Criado em 15 jan, 2026                       │
│                                              │
│ [▶️ Continuar Workflow]                      │
│                                              │
│ ┌─────────────────────────────────────────┐ │
│ │ 📝 Notas                                 │ │
│ │ Priorizar para essa semana               │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Card Simples (sem métricas)

```
┌─────────────────────────────────────────────┐
│ [📸 Carrossel]                     [⋮ Menu] │
│                                              │
│ 5 dicas de skincare para pele oleosa        │
│ Aumentar engajamento com dicas práticas     │
│                                              │
│ [📝 Composição] [📚 Educação Pública]       │
│                                              │
│ Progresso                            5%      │
│ ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░              │
│                                              │
│ Criado em 18 jan, 2026                       │
│                                              │
│ [▶️ Continuar Workflow]                      │
└─────────────────────────────────────────────┘
```

### Card Concluído

```
┌─────────────────────────────────────────────┐
│ [📱 Stories]                       [⋮ Menu] │
│                                              │
│ Antes e depois: tratamento facial           │
│ Demonstrar resultados reais                 │
│                                              │
│ [✅ Concluído] [✨ Resultado Paciente]       │
│                                              │
│ Progresso                           100%     │
│ ████████████████████████████████████        │
│                                              │
│ ┌─────────────────────────────────────────┐ │
│ │ Métricas 24h                            │ │
│ │ 👁️ Views  ❤️ Likes  💾 Saves            │ │
│ │   3,450     892     234                 │ │
│ │ Total: 4,576 engajamentos               │ │
│ └─────────────────────────────────────────┘ │
│                                              │
│ Criado em 10 jan, 2026                       │
│                                              │
│ [▶️ Continuar Workflow]                      │
└─────────────────────────────────────────────┘
```

---

## Exemplo de Dados do Supabase

### Query Executada

```sql
SELECT
  postpack_workflow.*,
  postpacks.*
FROM postpack_workflow
LEFT JOIN postpacks ON postpack_workflow.postpack_id = postpacks.id
ORDER BY postpack_workflow.created_at DESC;
```

### Exemplo de Retorno JSON

```json
[
  {
    "id": "wf_001",
    "postpack_id": "pp_001",
    "status": "fase_1",
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-01-15T14:22:00Z",
    "created_by": "user_001",
    "notas": "Priorizar para essa semana",
    "metricas_24h": {
      "views": 1245,
      "likes": 320,
      "saves": 89,
      "comments": 0,
      "shares": 0
    },
    "fase_1_status": "em_progresso",
    "postpacks": {
      "id": "pp_001",
      "title": "Como clarear manchas de melasma",
      "objective": "Educar público sobre tratamento eficaz",
      "format": "reel",
      "procedure": "procedimento_estetico",
      "pillar": "educativo",
      "created_at": "2026-01-15T10:30:00Z"
    }
  },
  {
    "id": "wf_002",
    "postpack_id": "pp_002",
    "status": "composicao",
    "created_at": "2026-01-18T09:15:00Z",
    "updated_at": "2026-01-18T09:15:00Z",
    "created_by": "user_002",
    "notas": null,
    "metricas_24h": null,
    "fase_1_status": "pendente",
    "postpacks": {
      "id": "pp_002",
      "title": "5 dicas de skincare para pele oleosa",
      "objective": "Aumentar engajamento com dicas práticas",
      "format": "carrossel",
      "procedure": "educacao_publica",
      "pillar": "educativo",
      "created_at": "2026-01-18T09:15:00Z"
    }
  },
  {
    "id": "wf_003",
    "postpack_id": "pp_003",
    "status": "concluido",
    "created_at": "2026-01-10T08:00:00Z",
    "updated_at": "2026-01-14T16:45:00Z",
    "completed_at": "2026-01-14T16:45:00Z",
    "created_by": "user_001",
    "notas": null,
    "metricas_24h": {
      "views": 3450,
      "likes": 892,
      "saves": 234,
      "comments": 45,
      "shares": 12
    },
    "fase_5_status": "concluido",
    "postpacks": {
      "id": "pp_003",
      "title": "Antes e depois: tratamento facial",
      "objective": "Demonstrar resultados reais",
      "format": "stories",
      "procedure": "resultado_paciente",
      "pillar": "prova_social",
      "created_at": "2026-01-10T08:00:00Z"
    }
  }
]
```

---

## Exemplo de Filtros Aplicados

### Filtro: Formato = "Reels"

**Query modificada no cliente:**
```typescript
workflows.filter(w => w.postpacks?.format?.toLowerCase() === 'reel')
```

**Resultado esperado:**
- Mostra apenas workflows com formato "reel"
- Cards com badge rosa 🎬
- Estatísticas recalculadas

### Filtro: Status = "Fase 1"

**Query modificada no cliente:**
```typescript
workflows.filter(w => w.status === 'fase_1')
```

**Resultado esperado:**
- Mostra apenas workflows em Fase 1
- Cards com badge roxo 1️⃣
- Progresso aproximadamente 5-20%

### Filtro: Busca = "melasma"

**Query modificada no cliente:**
```typescript
workflows.filter(w => {
  const query = 'melasma';
  const title = w.postpacks?.title?.toLowerCase() || '';
  const objective = w.postpacks?.objective?.toLowerCase() || '';
  return title.includes(query) || objective.includes(query);
})
```

**Resultado esperado:**
- Mostra apenas workflows que contém "melasma" no título ou objetivo
- Pode retornar 0 a N workflows

---

## Exemplo de Estatísticas Calculadas

### Cálculo de Engajamento Médio

```typescript
// Workflows com métricas
const workflowsComMetricas = [
  { metricas_24h: { views: 1245, likes: 320, saves: 89 } },  // Total: 1654
  { metricas_24h: { views: 3450, likes: 892, saves: 234 } }, // Total: 4576
  { metricas_24h: null } // Ignorado
];

// Cálculo
const totalEngajamento = 1654 + 4576; // 6230
const quantidadeComMetricas = 2;
const media = Math.round(6230 / 2); // 3115

// Exibido
"3,115" // com formatação de locale
```

### Cálculo de Taxa de Conclusão

```typescript
// Workflows
const total = 15;
const concluidos = 3;

// Cálculo
const taxa = Math.round((3 / 15) * 100); // 20

// Exibido
"20%" // com símbolo de porcentagem
```

### Cálculo de Progresso Individual

```typescript
// Status e mapeamento de progresso
const progressMap = {
  'composicao': 5,
  'fase_1': 20,
  'fase_2': 40,
  'fase_3': 60,
  'fase_4': 80,
  'fase_5': 90,
  'concluido': 100
};

// Workflow em fase_1
const workflow = { status: 'fase_1' };
const progresso = progressMap[workflow.status]; // 20%

// Barra visual
// ████████░░░░░░░░░░░░░░░░░░░░ (20% preenchido)
```

---

## Casos Especiais

### Workflow Sem Postpack

```json
{
  "id": "wf_999",
  "postpack_id": "pp_999",
  "status": "fase_1",
  "postpacks": null  // Postpack não encontrado
}
```

**Comportamento esperado:**
- Título: "Sem título"
- Objetivo: "Sem objetivo definido"
- Procedimento: "N/A"
- Formato: Badge padrão (reel)

### Workflow Sem Notas

```json
{
  "id": "wf_002",
  "notas": null
}
```

**Comportamento esperado:**
- Seção de notas não aparece no card
- Card fica mais compacto

### Workflow Sem Métricas

```json
{
  "id": "wf_004",
  "metricas_24h": null
}
```

**Comportamento esperado:**
- Seção de métricas não aparece no card
- Não conta para cálculo de engajamento médio

---

## Menu de Ações

### Ao Clicar no Menu (⋮)

```
┌──────────────────┐
│ ▶️ Continuar     │ → Navega para /workflow/wf_001
│ 📊 Ver Relatório │ → Navega para /workflow/wf_001#relatorio
│ 📋 Duplicar      │ → Alert: "Em desenvolvimento"
│ 🗄️ Arquivar      │ → Confirm: "Deseja arquivar?"
└──────────────────┘
```

---

## Estado de Loading

```
┌─────────────────────────────────────────────┐
│                                              │
│              [Spinner Animado]               │
│                                              │
│         Carregando workflows...              │
│                                              │
└─────────────────────────────────────────────┘
```

## Estado de Erro

```
┌─────────────────────────────────────────────┐
│                                              │
│                   ⚠️                         │
│                                              │
│           Erro ao carregar                   │
│                                              │
│   Erro ao conectar com o banco de dados:    │
│   Connection timeout after 5000ms            │
│                                              │
│         [Tentar Novamente]                   │
│                                              │
└─────────────────────────────────────────────┘
```

## Estado Vazio

```
┌─────────────────────────────────────────────┐
│                                              │
│                   📭                         │
│                                              │
│       Nenhum workflow encontrado             │
│                                              │
│   Crie seu primeiro workflow para começar    │
│                                              │
│      [Criar Primeiro Workflow]               │
│                                              │
└─────────────────────────────────────────────┘
```

---

## Responsividade

### Mobile (< 768px)

```
┌────────────────────┐
│ Total: 15          │
│ Ativos: 12         │
└────────────────────┘
┌────────────────────┐
│ [Card 1]           │
└────────────────────┘
┌────────────────────┐
│ [Card 2]           │
└────────────────────┘
```

### Tablet (768px - 1024px)

```
┌──────────────┐ ┌──────────────┐
│ Total: 15    │ │ Ativos: 12   │
└──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐
│ [Card 1]     │ │ [Card 2]     │
└──────────────┘ └──────────────┘
```

### Desktop (> 1024px)

```
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│Total  │ │Ativos │ │Concl. │ │Engaj. │
└───────┘ └───────┘ └───────┘ └───────┘
┌───────┐ ┌───────┐ ┌───────┐
│Card 1 │ │Card 2 │ │Card 3 │
└───────┘ └───────┘ └───────┘
┌───────┐ ┌───────┐ ┌───────┐
│Card 4 │ │Card 5 │ │Card 6 │
└───────┘ └───────┘ └───────┘
```

---

**Nota:** Todos os exemplos acima são representações visuais ASCII. No dashboard real, os componentes são renderizados com Tailwind CSS e incluem cores, gradientes e animações.
