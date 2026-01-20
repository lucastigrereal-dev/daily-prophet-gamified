# Dashboard de Workflows - Daily Prophet

## Visão Geral

Dashboard completo para visualização e gerenciamento de todos os workflows do sistema Daily Prophet.

## Estrutura de Arquivos

```
app/dashboard/
├── page.tsx                          # Página principal do dashboard
└── README.md                         # Esta documentação

components/dashboard/
├── WorkflowCard.tsx                  # Card individual de workflow
└── WorkflowStats.tsx                 # Componente de estatísticas
```

## Funcionalidades

### 1. Página Principal (`page.tsx`)

**Funcionalidades:**
- Listagem completa de todos os workflows do banco
- Sistema de filtros avançado (formato, status, procedimento, busca)
- Integração direta com Supabase
- Responsivo (mobile-first)
- Dark theme (bg-gray-900)

**Filtros Disponíveis:**
- **Formato:** Todos, Reels, Carrossel, Stories
- **Status:** Todos, Composição, Fase 1-5, Concluído
- **Procedimento:** Todos, Procedimento Estético, Resultado Paciente, Educação Pública
- **Busca:** Por título, objetivo ou notas

### 2. WorkflowCard (`WorkflowCard.tsx`)

**Funcionalidades:**
- Card visual com hover effect suave
- Badge colorido por formato:
  - Reel: `bg-pink-500` 🎬
  - Carrossel: `bg-orange-500` 📸
  - Stories: `bg-yellow-500` 📱
- Badge de status:
  - Composição: `bg-gray-500` 📝
  - Fase 1: `bg-purple-500` 1️⃣
  - Fase 2: `bg-blue-500` 2️⃣
  - Fase 3: `bg-yellow-500` 3️⃣
  - Fase 4: `bg-green-500` 4️⃣
  - Fase 5: `bg-pink-500` 5️⃣
  - Concluído: `bg-purple-500` ✅

**Informações Exibidas:**
- Formato e status
- Título e objetivo
- Procedimento
- Barra de progresso visual
- Métricas de engajamento (views, likes, saves)
- Data de criação
- Notas (se existir)

**Ações Disponíveis:**
- ▶️ Continuar - Navega para o workflow
- 📊 Ver Relatório - Vai para seção de relatório
- 📋 Duplicar - Duplica o workflow (em desenvolvimento)
- 🗄️ Arquivar - Arquiva o workflow (em desenvolvimento)

### 3. WorkflowStats (`WorkflowStats.tsx`)

**Estatísticas Gerais:**
- Total de workflows
- Workflows em andamento
- Workflows concluídos
- Engajamento médio (24h)

**Estatísticas Detalhadas:**
- Distribuição por status (com barras de progresso)
- Distribuição por formato
- Distribuição por procedimento
- Taxa de conclusão

## Query Supabase

```typescript
const { data, error } = await supabase
  .from('postpack_workflow')
  .select('*, postpacks(*)')
  .order('created_at', { ascending: false });
```

## Design System

### Cores

**Badges de Formato:**
- Reel: `bg-pink-500`
- Carrossel: `bg-orange-500`
- Stories: `bg-yellow-500`

**Badges de Status:**
- Rascunho/Composição: `bg-gray-500`
- Fase 1: `bg-purple-500`
- Fase 2: `bg-blue-500`
- Fase 3: `bg-yellow-500`
- Fase 4 (Aprovado): `bg-green-500`
- Fase 5: `bg-pink-500`
- Concluído: `bg-purple-500`

**Tema Geral:**
- Background: `bg-gray-900`
- Cards: `bg-gray-800`
- Hover: `hover:scale-105` com transição suave

### Ícones

- 🎬 Reels
- 📸 Carrossel
- 📱 Stories
- 💉 Procedimento Estético
- ✨ Resultado Paciente
- 📚 Educação Pública
- 👁️ Views
- ❤️ Likes
- 💾 Saves
- 💬 Comments
- 📤 Shares

## Navegação

### Acesso ao Dashboard

```
/dashboard
```

### Ações de Navegação

- **Continuar Workflow:** `/workflow/[id]`
- **Ver Relatório:** `/workflow/[id]#relatorio`
- **Novo Workflow:** `/workflow/novo`
- **Voltar Home:** `/`

## Uso

### Visualizar Todos os Workflows

Acesse `/dashboard` para ver a listagem completa com estatísticas.

### Filtrar Workflows

Use os filtros no topo para refinar a visualização:
1. Digite no campo de busca
2. Selecione formato desejado
3. Selecione status desejado
4. Selecione procedimento desejado
5. Clique em "Limpar Filtros" para resetar

### Interagir com Workflow

1. Clique no botão "Continuar Workflow" no card
2. Ou clique no menu (três pontos) para mais opções

## Métricas Exibidas

### Métricas 24h
- Views (visualizações)
- Likes (curtidas)
- Saves (salvamentos)
- Comments (comentários)
- Shares (compartilhamentos)
- Total de engajamentos

### Progresso
- Barra visual de 0-100%
- Baseado na fase atual do workflow

## Responsividade

- **Mobile:** Layout de 1 coluna
- **Tablet:** Layout de 2 colunas
- **Desktop:** Layout de 3 colunas
- Todos os componentes adaptam-se automaticamente

## Performance

- Carregamento otimizado com `use client`
- Query única ao Supabase com JOIN
- Filtros aplicados no cliente (rápido)
- Animações suaves com Tailwind CSS

## Próximas Implementações

- [ ] Duplicar workflow (clonar completo)
- [ ] Arquivar workflow (soft delete)
- [ ] Exportar relatórios
- [ ] Filtros salvos (favoritos)
- [ ] Ordenação customizada
- [ ] Paginação para grandes volumes

## Tecnologias

- **Next.js 16.1.1** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database e queries
- **React Hooks** - State management

## Manutenção

Para adicionar novos filtros ou estatísticas:
1. Edite `page.tsx` para adicionar controles de filtro
2. Edite `WorkflowStats.tsx` para adicionar novas métricas
3. Edite `WorkflowCard.tsx` para modificar visualização do card

---

**Versão:** 1.0.0
**Data:** Janeiro 2026
**Autor:** Daily Prophet Team
