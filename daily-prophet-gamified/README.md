# 🗞️ Daily Prophet - Sistema de Workflow Gamificado

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-brightgreen?style=flat-square)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square)](https://tailwindcss.com/)

## 📝 Descrição

Daily Prophet é um sistema completo de gerenciamento de workflow para produção de conteúdo Instagram. Implementa um processo estruturado em **5 fases** (Criação → Aprovação → Produção → Publicação → Pós-Post) com gamificação, checklists, métricas e relatórios automatizados.

Projetado para equipes de marketing e criadores de conteúdo que precisam de um pipeline profissional e mensurável.

## ✨ Features Implementadas

- ✅ **Sistema de 5 Fases**: Workflow estruturado e progressivo
- ✅ **Gamificação**: Progresso visual com barras de avanço e status
- ✅ **Checklists Dinâmicos**: Por fase com validação de completude
- ✅ **Dashboard de Histórico**: Visualize todos os posts e workflows
- ✅ **Métricas Automáticas**: Coleta de dados em 24h e 7 dias
- ✅ **Relatórios**: Análise de performance por workflow
- ✅ **UI Mobile-First**: Responsiva e otimizada para todos os dispositivos
- ✅ **Autenticação Segura**: Integrada com Supabase
- ✅ **Banco de Dados PostgreSQL**: Estrutura robusta com RLS

## 🛠 Tech Stack

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **Next.js** | 14.2 | Framework React com SSR |
| **React** | 18.3 | Biblioteca UI |
| **TypeScript** | 5.5 | Type safety |
| **Tailwind CSS** | 3.4 | Styling utilitário |
| **Supabase** | 2.45 | Backend + PostgreSQL |
| **PostgreSQL** | Latest | Banco de dados |

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v18+ recomendado)
- **npm** (v9+) ou **yarn**
- **Git**
- **Conta no Supabase** (gratuita em https://supabase.com)

## 🚀 Instalação

### 1️⃣ Clonar Repositório

```bash
git clone <seu-repositorio>
cd daily-prophet-gamified
```

### 2️⃣ Instalar Dependências

```bash
npm install
```

### 3️⃣ Configurar Variáveis de Ambiente

```bash
# Copie o arquivo exemplo
cp .env.example .env.local

# Edite .env.local com suas credenciais do Supabase
# Veja SETUP.md para instruções detalhadas
```

As variáveis necessárias são:
- `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do Supabase

**⚠️ Importante**: Nunca commite `.env.local` (já está em `.gitignore`)

### 4️⃣ Configurar Banco de Dados

```bash
# Veja SETUP.md para:
# - Como criar projeto Supabase
# - Como rodar migrations
# - Como fazer seed de dados de teste
```

### 5️⃣ Rodar Localmente

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📚 Documentação

### Guias Rápidos
- **[SETUP.md](./SETUP.md)** - Guia completo de configuração inicial
- **[DATABASE.md](./DATABASE.md)** - Schema do banco de dados
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Guia de contribuição

## 🔄 Fluxo de 5 Fases

### Fase 1: Criação 🎨
Definição do conteúdo e conceito
- Objetivo da publicação
- Formato (Carrossel, Reels, Stories)
- Descrição inicial
- Checklist: Conceito aprovado

### Fase 2: Aprovação ✅
Revisão e feedback do conteúdo
- Checklist de pré-aprovação
- Feedback estruturado
- Aprovação/rejeição
- Ajustes necessários

### Fase 3: Produção 🎬
Criação dos assets visuais
- Produção de imagens/vídeos
- Edição e tratamento
- Legenda preparada
- Hashtags e CTA definidos

### Fase 4: Publicação 📤
Agendamento e publicação
- Horário de publicação
- Agendamento no Instagram
- Publicação efetiva
- URL do post registrada

### Fase 5: Pós-Post 📊
Análise de resultados
- Coleta de métricas (24h, 7d)
- Análise de performance
- Registro de aprendizados
- Workflow finalizado

## 📁 Estrutura de Pastas

```
daily-prophet-gamified/
├── src/
│   ├── app/                      # Páginas Next.js (App Router)
│   │   ├── layout.tsx           # Layout principal
│   │   ├── page.tsx             # Home/Dashboard
│   │   ├── historico/           # Página de histórico
│   │   ├── workflow/
│   │   │   ├── page.tsx         # Lista de workflows
│   │   │   ├── novo/            # Criar novo workflow
│   │   │   └── [id]/            # Detalhe do workflow
│   │   │       ├── fase-1/      # Página Fase 1
│   │   │       ├── fase-2/      # Página Fase 2
│   │   │       ├── fase-3/      # Página Fase 3
│   │   │       ├── fase-4/      # Página Fase 4
│   │   │       ├── fase-5/      # Página Fase 5
│   │   │       └── relatorio/   # Relatório final
│   │   └── ...
│   ├── components/              # Componentes React reutilizáveis
│   │   ├── workflow/           # Componentes de workflow
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── FaseChecklist.tsx
│   │   │   ├── ChecklistItem.tsx
│   │   │   └── ...
│   │   └── ...
│   ├── lib/                     # Utilitários e funcionalidades
│   │   ├── supabase/
│   │   │   ├── client.ts       # Cliente Supabase
│   │   │   ├── server.ts       # Supabase no servidor
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── public/                      # Arquivos estáticos
├── .env.example                # Template de variáveis
├── .env.local                  # Variáveis locais (não commitado)
├── package.json               # Dependências e scripts
├── tsconfig.json              # Configuração TypeScript
├── tailwind.config.js         # Configuração Tailwind
├── next.config.js             # Configuração Next.js
├── vercel.json                # Configuração Vercel
└── supabase-schema.sql        # Schema do banco de dados
```

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev       # Rodar servidor de desenvolvimento
npm run build     # Fazer build para produção
npm start         # Rodar servidor de produção

# Qualidade
npm run lint      # Executar ESLint
```

> 💡 Veja **[SETUP.md](./SETUP.md)** para mais scripts úteis

## 🌐 Deploy

### Deploy no Vercel (Recomendado)

O projeto está pré-configurado para Vercel. Para fazer deploy:

1. **Push seu código para GitHub**
   ```bash
   git push origin main
   ```

2. **Acesse [vercel.com](https://vercel.com)**
   - Faça login
   - Clique em "Add New..." → "Project"
   - Selecione seu repositório
   - Clique em "Import"

3. **Configure as Variáveis de Ambiente**
   - Em "Environment Variables", adicione:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde a conclusão

Seu app estará live em poucos minutos!

## 🔐 Segurança

### Variáveis de Ambiente
- ✅ Públicas (`NEXT_PUBLIC_*`) são expostas ao cliente intencionalmente
- ✅ Privadas são mantidas apenas no servidor
- ✅ Nunca commit `.env.local`

### RLS (Row Level Security)
- ✅ PostgreSQL com RLS habilitado
- ✅ Políticas de acesso configuradas por tabela
- ✅ Dados protegidos por usuário

### Autenticação
- ✅ Integrada com Supabase Auth
- ✅ Tokens gerenciados automaticamente
- ✅ Refresh automático de sessões

## 🐛 Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### "NEXT_PUBLIC_SUPABASE_URL is not defined"
- Certifique-se de que `.env.local` existe
- Reinicie o servidor de desenvolvimento (`npm run dev`)
- Verifique se as variáveis estão preenchidas corretamente

### Conexão com Supabase falha
- Confirme que a URL e a chave estão corretas
- Verifique a conexão de internet
- Veja se o projeto Supabase está ativo

### Build falha com erros de tipo
```bash
npm run build     # Ver erro completo
# Corrija conforme indicado, geralmente em tsconfig.json
```

Para mais ajuda, abra uma issue no GitHub!

## 📖 Recursos Externos

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contribuindo

Contributions são bem-vindas! Por favor:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para mais detalhes.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ por Lucas

---

**Última atualização**: Janeiro 2025
