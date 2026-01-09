# 🚀 Guia Completo de Setup - Daily Prophet Gamified

Este guia detalha todos os passos para colocar o Daily Prophet rodando em sua máquina.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação Local](#instalação-local)
3. [Configurar Supabase](#configurar-supabase)
4. [Configurar Variáveis de Ambiente](#configurar-variáveis-de-ambiente)
5. [Rodar Migrations](#rodar-migrations)
6. [Seed de Dados](#seed-de-dados)
7. [Rodar Localmente](#rodar-localmente)
8. [Verificação Final](#verificação-final)
9. [Deploy no Vercel](#deploy-no-vercel)

---

## 🔧 Pré-requisitos

### Sistema Operacional
- Windows, macOS ou Linux
- Bash ou PowerShell

### Software Necessário

```bash
# Verificar Node.js (v18+)
node --version

# Verificar npm (v9+)
npm --version

# Verificar Git
git --version
```

Se não tiver instalado, faça o download em:
- **Node.js**: https://nodejs.org/
- **Git**: https://git-scm.com/

### Conta Supabase

1. Acesse https://supabase.com
2. Clique em "Sign Up"
3. Use GitHub, Google ou email
4. Verifique seu email (importante!)
5. Pronto! Conta criada

> 💡 A conta gratuita do Supabase é suficiente para desenvolvimento

---

## 📦 Instalação Local

### 1️⃣ Clonar o Repositório

```bash
# Via HTTPS
git clone https://github.com/lucas/daily-prophet-gamified.git

# Via SSH (se preferir)
git clone git@github.com:lucas/daily-prophet-gamified.git

# Entrar no diretório
cd daily-prophet-gamified
```

### 2️⃣ Instalar Dependências

```bash
npm install
```

Isso vai:
- ✅ Instalar todas as bibliotecas do `package.json`
- ✅ Criar pasta `node_modules/`
- ✅ Gerar `package-lock.json`

> ⏱️ Pode levar 2-5 minutos na primeira vez

### 3️⃣ Verificar Instalação

```bash
npm list @supabase/supabase-js
npm list next
```

Você deve ver as versões instaladas sem erros.

---

## 🗄️ Configurar Supabase

### Passo 1: Criar Novo Projeto

1. **Acesse o Dashboard do Supabase**
   - https://app.supabase.com
   - Clique em "New Project"

2. **Configure o Projeto**
   - **Name**: `daily-prophet` (ou seu nome preferido)
   - **Database Password**: Crie uma senha forte (salve em local seguro!)
   - **Region**: Selecione a mais próxima de você
     - Para Brasil: `sa-east-1` (São Paulo)
   - **Pricing Plan**: `Free` é suficiente

3. **Aguarde Criação**
   - O Supabase vai criar o projeto (pode levar ~2 minutos)
   - Você será redirecionado quando estiver pronto

### Passo 2: Obter Credenciais

1. **Acesse Project Settings**
   - No painel do Supabase, clique em ⚙️ (Settings)
   - Ou use a URL: `https://app.supabase.com/project/[PROJECT_ID]/settings/api`

2. **Encontre as Chaves**
   - **Project URL**: Copie (ex: `https://seu-projeto.supabase.co`)
   - **Anon Public key**: Copie (chave longa começando com `eyJ...`)

3. **Salve Temporariamente**
   ```
   URL: https://seu-projeto.supabase.co
   ANON_KEY: eyJ... (copie inteiro)
   ```

   > ⚠️ Nunca compartilhe a ANON_KEY publicamente!

### Passo 3: Criar Tabelas

O schema já está pronto em `supabase-schema.sql`. Você tem 2 opções:

#### Opção A: SQL Editor (Recomendado para iniciantes)

1. **Acesse SQL Editor**
   - No dashboard, vá para "SQL Editor"
   - Clique em "+ New Query"

2. **Cole o Schema**
   - Abra o arquivo `supabase-schema.sql` em seu editor de texto
   - Copie TODO o conteúdo
   - Cole no SQL Editor do Supabase

3. **Execute**
   - Clique em "Run"
   - Você deve ver: "Success. No rows returned"

#### Opção B: Linha de Comando (para avançados)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Fazer login
supabase login

# Rodar migrations
supabase db push
```

### Passo 4: Verificar Tabelas

1. **Acesse Database**
   - No painel do Supabase, vá para "Database" → "Tables"

2. **Você deve ver**:
   - ✅ `postpacks` (tabela de conteúdo)
   - ✅ `postpack_workflow` (tabela de workflows)

3. **Verificar Dados de Teste**
   - Clique em `postpacks`
   - Você deve ver 3 posts de exemplo:
     - "Dicas de Produtividade"
     - "Lançamento Produto X"
     - "Behind the Scenes"

---

## 🔐 Configurar Variáveis de Ambiente

### Passo 1: Criar Arquivo .env.local

```bash
# Copiar template
cp .env.example .env.local
```

### Passo 2: Preenchê-lo

Abra `.env.local` em seu editor e preencha:

```env
# Cole a URL do seu projeto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co

# Cole a ANON_KEY que você copiou
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGc... (chave inteira)

# Isto é preenchido automaticamente pelo Vercel (deixe como está)
NODE_ENV=development
```

### Passo 3: Validar

```bash
# Verificar que o arquivo existe
cat .env.local

# Você deve ver as variáveis preenchidas
# Se estiver vazio ou com "your-*", voltou a faltar dados
```

### ⚠️ Importância de .env.local

```bash
# .env.local NUNCA deve ser commitado!
# Verifique se está em .gitignore
cat .gitignore | grep "\.env"

# Você deve ver:
# .env
# .env.local
# .env.development.local
# .env.production.local
```

---

## 📊 Rodar Migrations

As migrations já estão no `supabase-schema.sql` que você rodou antes. Mas se precisar rodá-las novamente:

### Via SQL Editor (Supabase Dashboard)

```sql
-- Executar o schema novamente
-- Irá criar as tabelas se não existirem
-- Não haverá erro mesmo se rodado 2x (IF NOT EXISTS)
```

### Via CLI (linha de comando)

```bash
# Se instalou Supabase CLI
supabase db push

# Ou para ver o status
supabase migration list
```

---

## 🌱 Seed de Dados

Os dados de teste já foram inseridos quando você rodou o `supabase-schema.sql`. Mas você pode adicionar mais dados:

### Via Dashboard Supabase

1. Acesse **Database** → **Tables** → **postpacks**
2. Clique em **"Insert row"**
3. Preencha:
   - **title**: Nome do conteúdo
   - **objective**: Objetivo (Engajamento, Conversão, etc)
   - **format**: Formato (Carrossel, Reels, Stories)
   - **status**: Deixe como `draft`
4. Clique **"Save"**

### Via Insert Manual (SQL)

```sql
INSERT INTO postpacks (title, objective, format, status) VALUES
  ('Meu Novo Post', 'Engajamento', 'Reels', 'draft'),
  ('Outro Post', 'Conversão', 'Carrossel', 'draft');
```

---

## 💻 Rodar Localmente

### Passo 1: Iniciar Servidor

```bash
npm run dev
```

Você deve ver:
```
> next dev

▲ Next.js 14.2.5
- Local:        http://localhost:3000
- Environments: .env.local
```

### Passo 2: Abrir Navegador

Acesse: **http://localhost:3000**

Você deve ver:
- ✅ Dashboard do Daily Prophet
- ✅ Lista de workflows
- ✅ Botão para criar novo workflow
- ✅ Histórico de posts

### Passo 3: Testar Funcionalidades

```
1. Home page (/)
   └─ Clique em "Novo Workflow"

2. Criar Workflow (/workflow/novo)
   └─ Preencha título, objetivo, formato
   └─ Clique em "Criar"

3. Fase 1 (/workflow/[id]/fase-1)
   └─ Preencha detalhes
   └─ Marque checklist
   └─ Clique em "Próxima Fase"

4. Continue pelas 5 fases...

5. Relatório Final (/workflow/[id]/relatorio)
   └─ Veja as métricas coletadas
```

### Passo 4: Parar Servidor

```bash
# No terminal, pressione:
Ctrl + C

# Você voltará ao prompt
```

---

## ✅ Verificação Final

### Checklist de Instalação

Execute na raiz do projeto:

```bash
# 1. Verificar dependências instaladas
npm list --depth=0

# Você deve ver:
# ├── next@14.2.5
# ├── react@18.3.1
# ├── @supabase/supabase-js@2.45.0
# └── ... (outros)

# 2. Verificar Node/npm
node --version  # Deve ser v18+
npm --version   # Deve ser v9+

# 3. Verificar .env.local
cat .env.local  # Deve mostrar as variáveis preenchidas

# 4. Verificar conexão com Supabase
npm run dev     # Se iniciar sem erros, está OK
```

### Erros Comuns

| Erro | Solução |
|------|---------|
| `Cannot find module '@supabase/supabase-js'` | Execute: `npm install` |
| `NEXT_PUBLIC_SUPABASE_URL is not defined` | Verifique `.env.local` |
| `Port 3000 already in use` | Use: `npm run dev -- -p 3001` |
| `Connection refused` | Verifique URL e chave Supabase |
| `ENOSPC` (no space) | Limpe cache: `npm cache clean --force` |

---

## 🌐 Deploy no Vercel

### Pré-requisitos

- ✅ Projeto no GitHub
- ✅ Conta Vercel (gratuita)
- ✅ Supabase rodando (projeto criado)

### Passo 1: Push para GitHub

```bash
# Adicionar arquivos
git add .

# Criar commit
git commit -m "Initial commit: Daily Prophet setup"

# Fazer push
git push origin main
```

### Passo 2: Conectar com Vercel

1. **Acesse https://vercel.com**
2. **Clique em "Add New..." → "Project"**
3. **Selecione seu repositório GitHub**
4. **Clique em "Import"**

Vercel vai detectar automaticamente que é um projeto Next.js.

### Passo 3: Configurar Variáveis

1. **Na página de import, vá para "Environment Variables"**
2. **Adicione**:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://seu-projeto.supabase.co`
   - Clique em "Add"

3. **Adicione novamente**:
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: `eyJ0eXAi...` (sua chave)
   - Clique em "Add"

### Passo 4: Deploy

1. **Clique em "Deploy"**
2. **Aguarde** (demora ~2-5 minutos)
3. **Veja a URL do seu site**: `https://seu-projeto.vercel.app`

### Passo 5: Testar

Acesse `https://seu-projeto.vercel.app` e verifique se:
- ✅ Página carrega
- ✅ Supabase está conectado
- ✅ Consegue criar workflows

---

## 📚 Próximos Passos

Agora que tudo está rodando:

1. **Leia [DATABASE.md](./DATABASE.md)**
   - Entenda o schema completo
   - Saiba o que cada tabela faz

2. **Leia [CONTRIBUTING.md](./CONTRIBUTING.md)**
   - Como adicionar novos features
   - Code style e boas práticas

3. **Explore o Código**
   - Pastas `src/app/` para páginas
   - Pastas `src/components/` para componentes
   - `src/lib/supabase/` para configuração do DB

4. **Customize**
   - Adicione seus próprios workflows
   - Modifique checklists
   - Integre com suas ferramentas

---

## 🆘 Precisa de Ajuda?

### Recursos

- 📖 [README.md](./README.md) - Overview do projeto
- 📊 [DATABASE.md](./DATABASE.md) - Schema do banco
- 🤝 [CONTRIBUTING.md](./CONTRIBUTING.md) - Como contribuir
- 🔗 [Supabase Docs](https://supabase.com/docs)
- 🔗 [Next.js Docs](https://nextjs.org/docs)

### Suporte

1. Verifique os [erros comuns](#erros-comuns) acima
2. Veja a seção de Troubleshooting no [README.md](./README.md)
3. Abra uma issue no GitHub

---

**Última atualização**: Janeiro 2025
