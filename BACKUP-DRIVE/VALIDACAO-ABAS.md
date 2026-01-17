# 🔍 GUIA DE VALIDAÇÃO - COORDENADOR ABA 1

## ⚠️ ALERTAS CRÍTICOS

### ALERTA ABA 4 (TYPES):
O hook `useWorkflow.ts` linha 73 tem hardcoded:
```typescript
const fases: FaseNumero[] = ['fase_1', 'fase_2', 'fase_3', 'fase_4', 'fase_5']
```

**AÇÃO NECESSÁRIA:**
1. Atualizar tipo `FaseNumero` para incluir 'composicao'
2. Atualizar array de fases: `['composicao', 'fase_1', 'fase_2', 'fase_3', 'fase_4', 'fase_5']`
3. Adicionar interface `WorkflowComposicao`
4. Adicionar campo `composicao?: WorkflowComposicao` em PostpackWorkflow
5. Adicionar campos composicao_* em PostpackWorkflowRow

### ALERTA ABA 3 (COMPONENTES):
Aguardar ABA 4 finalizar types antes de começar, para evitar erros de TypeScript.

### ALERTA ABA 2 (ROTA):
Navegação deve ser:
- Botão "Voltar": router.push('/workflow')
- Botão "Avançar": router.push(`/workflow/${workflowId}/fase-1`)

---

## ✅ CHECKLIST VALIDAÇÃO ABA 4

Após ABA 4 reportar conclusão, verificar:

```bash
# 1. Ler types/workflow.ts
cat types/workflow.ts | grep -A 5 "WorkflowComposicao"
cat types/workflow.ts | grep "FaseNumero"

# 2. Verificar se PostpackWorkflow tem campo composicao
cat types/workflow.ts | grep -A 2 "composicao"

# 3. Verificar PostpackWorkflowRow (compatibilidade DB)
cat types/workflow.ts | grep "composicao_status"
```

**Critérios de Aprovação:**
- [ ] Interface `WorkflowComposicao` existe
- [ ] Tipo `FaseNumero` inclui 'composicao'
- [ ] `PostpackWorkflow` tem campo `composicao?: WorkflowComposicao`
- [ ] `PostpackWorkflowRow` tem campos `composicao_status`, `composicao_data`, etc.
- [ ] Hook `useWorkflow.ts` atualizado (array de fases)
- [ ] `npx tsc --noEmit` passa sem erros

---

## ✅ CHECKLIST VALIDAÇÃO ABA 3

Após ABA 3 reportar conclusão, verificar:

```bash
# 1. Verificar se pasta foi criada
ls -la components/workflow/composicao/

# 2. Verificar se componentes existem
ls components/workflow/composicao/*.tsx

# 3. Verificar exports no index.ts
cat components/workflow/composicao/index.ts
```

**Critérios de Aprovação:**
- [ ] ComposicaoReels.tsx criado
- [ ] ComposicaoCarrossel.tsx criado
- [ ] ComposicaoStories.tsx criado
- [ ] index.ts exporta todos os componentes
- [ ] Props estão tipadas (usam WorkflowComposicao da ABA 4)
- [ ] Cada componente tem estrutura básica:
  - 'use client' no topo
  - Interface Props definida
  - useState para gerenciar dados locais
  - onChange callback para enviar dados ao parent
- [ ] `npx tsc --noEmit` passa sem erros

---

## ✅ CHECKLIST VALIDAÇÃO ABA 2

Após ABA 2 reportar conclusão, verificar:

```bash
# 1. Verificar se rota foi criada
ls -la app/workflow/[id]/composicao/

# 2. Verificar conteúdo
cat app/workflow/[id]/composicao/page.tsx | head -20
```

**Critérios de Aprovação:**
- [ ] page.tsx criado em app/workflow/[id]/composicao/
- [ ] Importa componentes de ABA 3: `from '@/components/workflow/composicao'`
- [ ] Usa useWorkflow hook
- [ ] Usa useRouter e useParams
- [ ] Tem botão "Voltar" (router.push('/workflow'))
- [ ] Tem botão "Avançar" (router.push(`/workflow/${workflowId}/fase-1`))
- [ ] Integra com sistema de salvamento (updateWorkflow)
- [ ] `npx tsc --noEmit` passa sem erros

---

## 🔄 MONITORAMENTO CONTÍNUO

### A cada 2 minutos, executar:

```bash
# Status do git
git status --short

# Verificar novos arquivos
ls components/workflow/composicao/ 2>/dev/null || echo "ABA 3: ainda não criou"
ls app/workflow/[id]/composicao/ 2>/dev/null || echo "ABA 2: ainda não criou"

# Verificar modificações em types
git diff types/workflow.ts | head -30
```

### Atualizar PROGRESS-COMPOSICAO.md:

```markdown
## ÚLTIMO CHECK: [HORA]

- ABA 4: ⬜ Não iniciado | 🟡 Em progresso | ✅ Completo
- ABA 3: ⬜ | 🟡 | ✅
- ABA 2: ⬜ | 🟡 | ✅

## PROBLEMAS DETECTADOS:
[listar aqui]
```

---

## 🚨 TROUBLESHOOTING COMUM

### Problema: ABA 2 importa componente que ABA 3 não criou ainda

```bash
# ERRO: Cannot find module '@/components/workflow/composicao'

# SOLUÇÃO:
# 1. Criar index.ts temporário vazio
mkdir -p components/workflow/composicao
echo "// Aguardando ABA 3" > components/workflow/composicao/index.ts

# 2. Avisar ABA 2 para aguardar
# 3. Quando ABA 3 terminar, sobrescrever index.ts
```

### Problema: Types incompatíveis entre ABA 3 e ABA 4

```bash
# ERRO: Property 'montarScript' does not exist on type 'WorkflowComposicao'

# SOLUÇÃO:
# 1. Verificar definição em types/workflow.ts
# 2. Verificar uso em componentes
# 3. Decidir qual está correto
# 4. Atualizar o arquivo errado
```

### Problema: Hook useWorkflow não atualizado

```bash
# ERRO: Type 'composicao' is not assignable to type FaseNumero

# SOLUÇÃO:
# 1. Verificar se ABA 4 atualizou type FaseNumero
# 2. Verificar se array de fases foi atualizado em useWorkflow.ts
# 3. Se não foi, avisar ABA 4 ou fazer você mesmo
```

---

## 🎯 CRITÉRIO FINAL DE SUCESSO

Marcar como COMPLETO apenas quando:

```bash
# 1. Build passa
npm run build

# 2. TypeScript OK
npx tsc --noEmit

# 3. Dev roda
npm run dev
# Abrir http://localhost:3000 e testar

# 4. Navegação funciona
# - Criar workflow novo
# - Entrar em /composicao
# - Preencher dados
# - Avançar para fase-1
# - Voltar e verificar dados persistidos
```

---

## 📞 QUANDO INTERVIR

**Intervir imediatamente se:**
- Aba travada por mais de 5 minutos sem progresso
- Erro de TypeScript que bloqueia outras abas
- Conflito de arquivos (duas abas editam mesmo arquivo)
- Incompatibilidade de tipos/interfaces
- Qualquer erro de build

**NÃO intervir se:**
- Aba está trabalhando normalmente
- Pequenos erros sendo corrigidos pela própria aba
- Progresso visível a cada check

---

**ÚLTIMA ATUALIZAÇÃO:** 14/01/2026 - 05:45
