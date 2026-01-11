# 🎨 Guia de Integração UX

## Components Disponíveis

### Toast Notifications

```typescript
import { useToast } from '@/hooks/useToast'

function MyComponent() {
  const { success, error, warning, info } = useToast()

  // Exemplo de uso
  success('Operação concluída!')
  error('Erro ao processar')
  warning('Atenção: Campos pendentes')
  info('Informação importante')
}
```

### Loading States

```typescript
import LoadingPage from '@/components/ui/LoadingPage'

function MyComponent() {
  const [loading, setLoading] = useState(true)

  if (loading) return <LoadingPage message="Carregando dados..." />

  return <div>Conteúdo carregado</div>
}
```

### Validations

```typescript
import { validateUrl, validateRequired } from '@/lib/validations'

function handleSubmit() {
  const urlError = validateUrl(url)
  if (urlError) {
    error(urlError)
    return
  }

  const fieldError = validateRequired(field, 'Campo obrigatório')
  if (fieldError) {
    error(fieldError)
    return
  }

  // Prosseguir com submit
}
```

### Progress Bar

```typescript
import ProgressBar from '@/components/ui/ProgressBar'

function MyComponent() {
  const [progress, setProgress] = useState(0)

  return (
    <ProgressBar
      progress={progress}
      label="Processando..."
    />
  )
}
```

## Integrado em:

- ✅ **Fase 1 - Criação**: Toast notifications e loading states
- ✅ **Fase 2 - Revisão**: Toast feedback e validações
- ✅ **Fase 3 - Produção**: Progress tracking e validações
- ✅ **Fase 4 - Publicação**: Validação de URL e feedback
- ✅ **Fase 5 - Métricas**: Formulário de métricas + workflow completion celebration
- ✅ **/workflow/novo**: Criação de workflow com validações

## Layout Global

O `ToastContainer` está configurado globalmente no `src/app/layout.tsx`, permitindo que todas as páginas da aplicação utilizem o sistema de notificações sem precisar importar o container individualmente.

```typescript
// src/app/layout.tsx
import ToastContainer from '@/components/ui/ToastContainer'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <ToastContainer />
        {children}
      </body>
    </html>
  )
}
```

## Boas Práticas

1. **Toast Messages**: Use mensagens curtas e objetivas
   - ✅ "Workflow criado com sucesso!"
   - ❌ "O workflow foi criado com sucesso e você pode agora prosseguir para a próxima fase"

2. **Loading States**: Sempre forneça feedback visual durante operações assíncronas
   - Use `LoadingPage` para carregamentos de página inteira
   - Use spinners menores para operações pontuais

3. **Validações**: Valide inputs antes de enviar ao servidor
   - Valide no frontend para melhor UX
   - Sempre mantenha validação no backend também

4. **Celebração**: Use emojis e mensagens positivas em momentos de conclusão
   - 🎉 "Workflow completo! Métricas salvas."
   - ✅ "Post publicado com sucesso!"

## Estrutura de Arquivos

```
src/
├── components/
│   ├── ui/
│   │   ├── ToastContainer.tsx
│   │   ├── LoadingPage.tsx
│   │   └── ProgressBar.tsx
│   └── workflow/
├── hooks/
│   └── useToast.ts
├── lib/
│   └── validations.ts
└── app/
    ├── layout.tsx (ToastContainer global)
    └── workflow/
        └── [id]/
            ├── fase-1/
            ├── fase-2/
            ├── fase-3/
            ├── fase-4/
            └── fase-5/ (com formulário de métricas)
```

## 🚀 Próximos Passos

Para continuar expandindo a integração UX:

1. Adicionar animações de transição entre fases
2. Implementar skeleton loaders para listas
3. Adicionar confirmações visuais para ações destrutivas
4. Criar biblioteca de componentes reutilizáveis
5. Implementar dark mode

---

**Desenvolvido por**: ABA 10 - Integração UX
**Data**: 2026-01-11
