# 🤝 Guia de Contribuição - Daily Prophet

Obrigado por considerar contribuir ao Daily Prophet! Este guia ajuda novos contribuidores.

## 📋 Índice

1. [Código de Conduta](#código-de-conduta)
2. [Como Contribuir](#como-contribuir)
3. [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
4. [Code Style](#code-style)
5. [Commits](#commits)
6. [Pull Requests](#pull-requests)
7. [Testes](#testes)

---

## 📜 Código de Conduta

Por favor, seja respeitoso com outros contribuidores. Esperamos:

- ✅ Comunicação clara e respeitosa
- ✅ Colaboração ao invés de competição
- ✅ Feedback construtivo
- ✅ Respeito à diversidade

---

## 🚀 Como Contribuir

### Tipos de Contribuições

1. **Reportar Bugs** 🐛
2. **Sugerir Features** ✨
3. **Melhorar Documentação** 📚
4. **Escrever Testes** ✅
5. **Implementar Features** 💻
6. **Otimizar Performance** ⚡

### Encontrando o Que Fazer

- Verifique as [Issues](https://github.com/lucas/daily-prophet-gamified/issues)
- Procure por `good first issue` ou `help wanted`
- Sugira novas features criando uma Issue

---

## 🔄 Fluxo de Desenvolvimento

### 1. Fork o Repositório

```bash
# No GitHub:
# 1. Clique em "Fork" no canto superior direito
# 2. Clone seu fork

git clone https://github.com/seu-usuario/daily-prophet-gamified.git
cd daily-prophet-gamified
```

### 2. Criar Branch

```bash
# Atualize main primeiro
git checkout main
git pull origin main

# Crie uma branch com nome descritivo
git checkout -b feature/sua-feature
# ou
git checkout -b fix/seu-bug
# ou
git checkout -b docs/melhorias
```

**Padrão de Nome**:
- `feature/nome-da-feature` - Nova funcionalidade
- `fix/nome-do-bug` - Correção de bug
- `docs/assunto` - Documentação
- `test/descricao` - Testes
- `refactor/area` - Refatoração
- `chore/tarefa` - Manutenção

### 3. Fazer Mudanças

Edite os arquivos conforme necessário.

### 4. Testes

```bash
# Rodar linter
npm run lint

# Build de produção
npm run build

# Dev local
npm run dev
```

Verifique se nada quebrou!

### 5. Commit

```bash
# Adicionar arquivos
git add .

# Fazer commit com mensagem clara
git commit -m "type: descrição clara"
```

**Exemplos bons**:
- `feat: add workflow status badge component`
- `fix: resolve checklist not saving on phase transition`
- `docs: clarify environment setup steps`
- `test: add tests for workflow phase validation`
- `refactor: extract workflow timeline logic to hook`

**Exemplos ruins**:
- `fix bug` (muito vago)
- `update` (não descreve o quê)
- `Work in progress` (commit temporário)

### 6. Push para seu Fork

```bash
git push origin feature/sua-feature
```

### 7. Abrir Pull Request

1. **No GitHub**, vá para sua branch no seu fork
2. **Clique em "Compare & pull request"**
3. **Preencha a descrição** (veja template abaixo)
4. **Clique em "Create pull request"**

---

## 💻 Code Style

### TypeScript/React

**Indentação**: 2 espaços

```tsx
// ✅ Correto
function MyComponent() {
  return (
    <div className="flex items-center">
      <h1>Daily Prophet</h1>
    </div>
  );
}

// ❌ Errado
function MyComponent(){
    return(
        <div className="flex items-center">
            <h1>Daily Prophet</h1>
        </div>
    );
}
```

**Nomes de Variáveis**: camelCase

```tsx
// ✅ Correto
const workflowStatus = 'fase_1';
const handlePhaseChange = () => {};

// ❌ Errado
const workflow_status = 'fase_1';
const handle_phase_change = () => {};
```

**Nomes de Componentes**: PascalCase

```tsx
// ✅ Correto
function WorkflowChecklist() {}
function FaseProgressBar() {}

// ❌ Errado
function workflowChecklist() {}
function faseProgressBar() {}
```

**Propriedades**: Alfabética

```tsx
// ✅ Correto
<Component
  className="..."
  disabled={false}
  onClick={handleClick}
  title="Fase 1"
/>

// ❌ Errado
<Component
  onClick={handleClick}
  className="..."
  title="Fase 1"
  disabled={false}
/>
```

### Comentários

```tsx
// ✅ Comentários úteis
// Aguardar antes de atualizar para evitar condição de corrida
await delay(500);

// ❌ Óbvios
// Incrementar contador
count++;
```

### Imports

```tsx
// ✅ Ordenado
import React from 'react';
import { useState } from 'react';
import type { WorkflowStatus } from '@/types';
import { supabase } from '@/lib/supabase/client';
import WorkflowHeader from '@/components/workflow/Header';
import styles from './styles.module.css';

// ❌ Desordenado
import styles from './styles.module.css';
import { supabase } from '@/lib/supabase/client';
import React from 'react';
import WorkflowHeader from '@/components/workflow/Header';
```

### Tailwind CSS

```tsx
// ✅ Ordem recomendada de classes
<div className="
  flex items-center justify-between
  gap-4
  p-4
  bg-white rounded-lg
  border border-gray-200
  shadow-sm
">

// ❌ Ordem aleatória
<div className="bg-white gap-4 flex justify-between p-4 shadow-sm border items-center rounded-lg border-gray-200">
```

---

## 📝 Commits

### Formato Recomendado

```
type(scope): description

Body with more details (opcional)

Fixes #issue-number
```

**Types**:
- `feat` - Nova feature
- `fix` - Correção de bug
- `docs` - Documentação
- `style` - Formatação (sem lógica)
- `refactor` - Refatoração
- `perf` - Melhorias de performance
- `test` - Testes
- `chore` - Manutenção

**Exemplos**:

```bash
# Feature simples
git commit -m "feat: add workflow completion badge"

# Com escopo
git commit -m "feat(workflow): add automatic phase progression"

# Com detalhes
git commit -m "feat(checklist): persist checklist state to database

- Save checklist state on every change
- Restore state on page load
- Add loading indicator during save

Fixes #123"
```

---

## 🔀 Pull Requests

### Template

```markdown
## 📝 Descrição

Descreva o que essa PR faz e por quê.

## 🔗 Relacionado a

- Closes #issue-number
- Depends on #other-pr

## 🧪 Como Testar

Passos para reproduzir/testar:
1. ...
2. ...
3. ...

## ✅ Checklist

- [ ] Código segue o style guide
- [ ] Fiz self-review do meu código
- [ ] Atualizei documentação se necessário
- [ ] Sem warnings ou erros no build
- [ ] Testei localmente
- [ ] Nenhum breaking change

## 📸 Screenshots (se aplicável)

Antes e depois, ou capturas de tela da feature nova.
```

### Boas Práticas

✅ **Faça**:
- PRs menores e focadas (1 feature ou 1 bug fix)
- Descrevam claramente o quê e o porquê
- Referenciem issues relacionadas
- Comentem código complexo
- Responsáveis pelos testes

❌ **Não faça**:
- PRs gigantes com múltiplas features
- Mudanças sem descrição
- Mergear sem review
- Commits com "WIP" ou "temp"
- Pushear para main diretamente

---

## 🧪 Testes

### Estrutura

```bash
# Testes estão em __tests__/ ao lado dos componentes
src/
├── components/
│   ├── workflow/
│   │   ├── Checklist.tsx
│   │   └── __tests__/
│   │       └── Checklist.test.tsx
```

### Rodando Testes

```bash
# Rodar tudo
npm test

# Modo watch
npm test -- --watch

# Com cobertura
npm test -- --coverage
```

### Exemplo de Teste

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ChecklistItem from '../ChecklistItem';

describe('ChecklistItem', () => {
  it('marca como completo ao clicar', () => {
    const { container } = render(
      <ChecklistItem
        item={{ id: '1', text: 'Test', done: false }}
        onToggle={jest.fn()}
      />
    );

    const checkbox = container.querySelector('input[type="checkbox"]');
    fireEvent.click(checkbox);

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('desabilita quando loading', () => {
    const { container } = render(
      <ChecklistItem
        item={{ id: '1', text: 'Test', done: false }}
        loading={true}
        onToggle={jest.fn()}
      />
    );

    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeDisabled();
  });
});
```

---

## 🏗️ Arquitetura

### Convenções do Projeto

**Estrutura de Pastas**:
```
src/
├── app/           # Next.js pages (App Router)
├── components/    # React components
├── lib/           # Utilities, helpers
│   ├── supabase/  # Database
│   └── types.ts   # TypeScript types
├── hooks/         # Custom React hooks
└── styles/        # Global styles
```

**Componentes**:
- Um componente por arquivo
- Use `index.ts` para exports
- Props com interfaces TypeScript
- Prefer functional components

**Tipos**:
- Centralizados em `lib/types.ts` ou colaterais
- Nomear com `I` prefix (ex: `IWorkflow`)
- Exportar de `index.ts` no pasta

---

## 🚫 O Que NÃO Fazer

❌ **Não modifique**:
- `package-lock.json` sem motivo
- Configurações do banco sem PR separada
- `.env.local` (nunca commit)
- Código não relacionado na mesma PR

❌ **Não commita**:
- Segredos ou credenciais
- `node_modules/`
- Arquivos build (`dist/`, `.next/`)
- Arquivos IDE (`.vscode/`, `.idea/`)

---

## 🎯 Boas Práticas

### Performance

```tsx
// ✅ Usar useMemo para computações pesadas
const processedData = useMemo(
  () => expensiveOperation(data),
  [data]
);

// ✅ Lazy load componentes grandes
const ReportComponent = dynamic(
  () => import('./Report'),
  { loading: () => <div>Loading...</div> }
);
```

### Acessibilidade

```tsx
// ✅ Labels em inputs
<label htmlFor="title">Título</label>
<input id="title" />

// ✅ ARIA attributes quando necessário
<button aria-label="Próxima fase">→</button>

// ✅ Semantic HTML
<main>
  <article>
    <h1>Título</h1>
  </article>
</main>
```

### Segurança

```tsx
// ✅ Sanitizar inputs
const sanitized = input.replace(/[<>]/g, '');

// ✅ Validar no servidor
// (nunca confie apenas em validação client)

// ✅ Use HTTPS
// (automático no Vercel)
```

---

## 📚 Recursos

- [Setup Guide](./SETUP.md)
- [Database Docs](./DATABASE.md)
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## ❓ Dúvidas?

- 💬 Abra uma Discussion no GitHub
- 🐛 Abra uma Issue para bugs
- 📧 Envie um email para lucas@example.com

---

Obrigado por contribuir! 🎉

**Última atualização**: Janeiro 2025
