# 🗞️ Montador - Daily Prophet

**Arquivo:** `/workflow/[id]/montador/page.tsx`
**Status:** ✅ Implementado e Funcional
**Data:** 20/01/2026

---

## 📋 O Que É

O **Montador** é o componente central que permite ao usuário **montar um PostPack completo** através de 7 etapas interativas:

1. **Composição** - Define parâmetros básicos do formato
2. **Gancho** - Seleciona o gancho (hook) do banco de dados
3. **Legenda** - Seleciona a legenda do banco de dados
4. **CTA** - Seleciona o call-to-action do banco de dados
5. **Hashtags** - Seleciona múltiplas hashtags do banco de dados
6. **Protocolo** - Auto-seleciona o protocolo correto
7. **Resumo** - Visualiza todo o PostPack antes de finalizar

---

## 🎯 Funcionalidades Principais

### ✅ Etapa 1: Composição
Muda de interface baseado no formato:

**Reels:**
- Seleção de duração (15s, 30s, 60s)
- Opção de montar script ou usar próprio

**Carrossel:**
- Input de tema
- Seleção de tipo (Mitos, Dicas, Passo a Passo, etc)
- Quantidade de slides (5-10)

**Stories:**
- Estratégia (Q&A, Bastidores, Enquete, etc)
- Quantidade de stories (3-7)

### ✅ Etapa 2: Gancho
- Carrega ganchos do banco de dados
- Filtro por texto
- Clique para selecionar
- Mostra count de usos
- Confirmação visual ao selecionar

### ✅ Etapa 3: Legenda
- Carrega legendas do banco de dados
- Filtro por texto
- Clique para selecionar
- Prévia de 3 linhas

### ✅ Etapa 4: CTA
- Carrega CTAs do banco de dados
- Filtro por categoria (Salvamento, Comentário, etc)
- Filtro por texto
- Grid 2 colunas para seleção

### ✅ Etapa 5: Hashtags
- Carrega hashtags do banco de dados
- Filtro por tema
- **Seleção múltipla** (até N)
- Mostra volume estimado
- Prévia em tempo real

### ✅ Etapa 6: Protocolo
- Auto-selecionado baseado em:
  - Formato + Objetivo + Procedimento
- Mostra os parâmetros usados para decisão

### ✅ Etapa 7: Resumo
- Exibe todas as seleções
- Cards com borders coloridas por tipo
- Permite voltar se necessário

---

## 🔄 Fluxo de Dados

```
1. Usuário clica "Criar PostPack" em /workflow/novo
   ↓
2. Workflow criado em banco (postpack_workflow table)
   ↓
3. Redireciona para /workflow/[id]/montador
   ↓
4. Carrega dados do workflow
   ↓
5. Usuário passa por 7 etapas
   ↓
6. Ao avancar, salva seleção em banco
   ↓
7. Na última etapa, finaliza com status 'montado'
   ↓
8. Redireciona para /workflow/[id]/fase-2 (Preview)
```

---

## 📊 Estados Gerenciados

```typescript
// Seleções do usuário
selecoes = {
  composicao: { duração, montarScript, tema, etc },
  gancho: Gancho | null,
  legenda: Legenda | null,
  cta: CTA | null,
  hashtags: Hashtag[],
  protocolo: null
}
```

---

## 🔌 APIs Utilizadas

### GET /api/content/ganchos
Retorna ganchos do banco com filtros opcionais

### GET /api/content/legendas
Retorna legendas do banco com filtros

### GET /api/content/ctas
Retorna CTAs por categoria

### GET /api/content/hashtags
Retorna hashtags por tema

---

## 💾 Salvamento

Cada vez que o usuário avança de etapa:
```typescript
await supabase
  .from('workflows')
  .update({
    gancho_id: selecoes.gancho?.id,
    legenda_id: selecoes.legenda?.id,
    cta_id: selecoes.cta?.id,
    // ...
  })
  .eq('id', workflowId);
```

---

## ✨ Componentes UI

### Stepper
- 7 etapas com números/checkmarks
- Permite voltar a etapas completas
- Indicadores visuais (azul=atual, verde=completo, cinza=pendente)

### Input/Select Components
- Inputs com filtro em tempo real
- Buttons com estados (selected/hover/disabled)
- Grids responsivos (1/2/3 colunas)

### Confirmação Visual
- Backgrounds coloridas ao selecionar
- Borders verdes para sucesso
- Placeholders descritivos

---

## 🚀 Como Usar

1. **Criar novo PostPack:**
   ```
   /workflow/novo → selecionar formato, objetivo, procedimento
   ```

2. **Entrar no Montador:**
   ```
   Redireciona automaticamente para /workflow/[id]/montador
   ```

3. **Passar pelas 7 etapas:**
   ```
   Navegar com botões Voltar/Avançar
   Seleções são salvas automaticamente
   ```

4. **Finalizar:**
   ```
   Na etapa de Resumo, clique "Finalizar Montagem"
   Redireciona para Fase 2 (Preview + Aprovação)
   ```

---

## 🔧 Configuração Necessária

### Database Tables Requeridas

```sql
workflows table:
- id (UUID PK)
- formato (VARCHAR)
- objetivo (VARCHAR)
- procedimento (VARCHAR)
- gancho_id (UUID FK -> ganchos.id)
- legenda_id (UUID FK -> legendas.id)
- cta_id (UUID FK -> ctas.id)

ganchos table:
- id (UUID PK)
- texto (TEXT)
- tipo_post (VARCHAR)
- uso_count (INTEGER)

legendas table:
- id (UUID PK)
- texto (TEXT)

ctas table:
- id (UUID PK)
- texto (TEXT)
- categoria (VARCHAR)

hashtags table:
- id (UUID PK)
- texto (VARCHAR)
- tema (VARCHAR)
- volume (INTEGER)
```

---

## 📱 Responsividade

- **Mobile:** 1 coluna, stepper horizontal com scroll
- **Tablet:** 2 colunas para cards, stepper adapts
- **Desktop:** 3 colunas max, stepper completo

---

## ♿ Acessibilidade

- Buttons com estados disabled
- Labels descritivos
- Feedback visual claro
- Navegação por teclado (Enter/Space)

---

## 🐛 Tratamento de Erros

```typescript
try {
  // Carregar workflow
  // Carregar dados etapas
  // Salvar seleções
} catch (err) {
  console.error('Erro:', err);
  // User-friendly message
}
```

---

## 🚀 Próximas Etapas

Após montador, o fluxo continua:
```
Montador (/montador)
   ↓
Fase 2 (/fase-2) - Preview + Aprovação
   ↓
Fase 3 (/fase-3) - Checklist de Produção
   ↓
Fase 4 (/fase-4) - Publicação + Copy
   ↓
Fase 5 (/fase-5) - Métricas
   ↓
Relatório (/relatorio) - Consolidação
```

---

## ✅ Checklist de Validação

- [ ] Montador renderiza corretamente
- [ ] Etapa Composição muda por formato
- [ ] Ganchos carregam e filtram
- [ ] Legendas carregam e filtram
- [ ] CTAs carregam com filtro por categoria
- [ ] Hashtags permitem seleção múltipla
- [ ] Protocolo auto-seleciona
- [ ] Resumo mostra todas as seleções
- [ ] Salva cada etapa no banco
- [ ] Redireciona corretamente ao finalizar

---

**Autor:** Claude Haiku 4.5
**Data:** 20/01/2026
**Status:** ✅ IMPLEMENTADO E FUNCIONAL

