# 🚀 Como Rodar o Daily Prophet Gamified

## 📋 Pré-requisitos

1. **Node.js** (versão 18 ou superior)
   - Baixe em: https://nodejs.org/
   - Verifique: `node --version`

2. **Git** (já instalado)
   - Verifique: `git --version`

3. **Conta Supabase**
   - Criar conta grátis em: https://supabase.com/

---

## ⚙️ Configuração Inicial (Primeira Vez)

### 1. Entre na pasta do projeto
```bash
cd C:\Users\lucas\daily-prophet-gamified
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente

**CRÍTICO**: Crie o arquivo `.env.local` na raiz do projeto:

```bash
# No PowerShell ou CMD:
copy .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

**Como obter as credenciais:**
1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Configure o banco de dados

Execute o schema SQL no Supabase:
1. No Supabase Dashboard, vá em **SQL Editor**
2. Abra o arquivo `supabase-schema.sql` deste projeto
3. Copie e cole todo o conteúdo
4. Clique em **Run**

### 5. Configure autenticação no Supabase

No Supabase Dashboard:
1. **Authentication** → **Providers**
2. Habilite **Email**
3. Configure:
   - ✅ Enable email provider
   - ✅ Confirm email (recomendado)
   - ✅ Secure email change (recomendado)
4. Clique **Save**

---

## ▶️ Rodando o Projeto

### Modo de Desenvolvimento

```bash
npm run dev
```

O projeto abrirá em: **http://localhost:3000**

### Primeiro Acesso

1. Acesse http://localhost:3000
2. Clique em **"Entrar"** ou acesse `/signup`
3. Crie sua conta com email/senha
4. Verifique seu email (se habilitou confirmação)
5. Faça login
6. Você será redirecionado para `/workflow`

---

## 📂 Estrutura do Projeto

```
daily-prophet-gamified/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── login/             # ← Página de login
│   │   ├── signup/            # ← Página de cadastro
│   │   ├── workflow/          # ← Páginas de workflow (protegidas)
│   │   └── layout.tsx         # ← AuthProvider wrapper
│   ├── components/
│   │   ├── Header.tsx         # ← Header com login/logout
│   │   └── workflow/          # Componentes do workflow
│   ├── contexts/
│   │   └── AuthContext.tsx    # ← Context de autenticação
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts      # Cliente browser
│   │   │   └── server.ts      # ← Cliente server (middleware/RSC)
│   │   ├── supabase-workflow.ts
│   │   └── workflow-service.ts
│   ├── types/
│   │   ├── auth.ts            # ← Tipos de autenticação
│   │   └── workflow.ts
│   └── config/
├── middleware.ts              # ← Proteção de rotas
├── .env.local                 # ← Suas credenciais (NÃO commitar!)
└── package.json
```

---

## 🔐 Funcionalidades de Autenticação

### ✅ O que está funcionando:

- ✅ Cadastro com email/senha
- ✅ Login com email/senha
- ✅ Logout
- ✅ Proteção de rotas `/workflow/*`
- ✅ Session persistente (refresh mantém login)
- ✅ Redirect automático após login
- ✅ Header com botão Login/Logout
- ✅ Mensagens de erro em português
- ✅ Mobile-first design

### 🔒 Rotas Protegidas:

Requerem login:
- `/workflow`
- `/workflow/novo`
- `/workflow/[id]/*`
- `/historico`

Públicas:
- `/` (home)
- `/login`
- `/signup`

---

## 🧪 Testando o Sistema

### Cenário 1: Novo Usuário
1. Acesse http://localhost:3000/workflow
2. Deve redirecionar para `/login?redirect=/workflow`
3. Clique "Cadastre-se"
4. Preencha email e senha → Submit
5. Veja mensagem de sucesso
6. Faça login
7. Deve redirecionar para `/workflow`

### Cenário 2: Session Persistente
1. Faça login
2. Pressione **F5** (refresh)
3. Deve continuar autenticado
4. Clique "Sair"
5. Deve redirecionar para `/login`

### Cenário 3: Criar Workflow
1. Autenticado, clique "Novo Workflow"
2. Preencha os dados
3. Workflow criado com seu `user.id` no campo `created_by`

---

## 🐛 Troubleshooting

### Erro: "Invalid login credentials"
- **Causa**: Email ou senha incorretos
- **Solução**: Verifique as credenciais ou crie nova conta

### Erro: Session não persiste
- **Causa**: Cookies bloqueados
- **Solução**:
  1. Verifique se seu navegador permite cookies
  2. Desabilite extensões de privacidade
  3. Use modo normal (não privado/anônimo)

### Erro: Redirect loop
- **Causa**: Middleware não consegue setar cookies
- **Solução**:
  1. Limpe cookies do localhost
  2. Reinicie o servidor (`Ctrl+C`, depois `npm run dev`)

### Erro: "Auth must be used within AuthProvider"
- **Causa**: Componente fora do AuthProvider
- **Solução**: Verifique que `layout.tsx` tem o `<AuthProvider>` wrapper

### Página em branco
- **Causa**: `.env.local` não configurado
- **Solução**:
  1. Verifique se `.env.local` existe
  2. Verifique se as URLs do Supabase estão corretas
  3. Reinicie o servidor

---

## 📦 Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar build de produção
npm start

# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## 🌐 Deploy (Vercel)

### Preparação:
1. Crie conta em https://vercel.com/
2. Conecte seu repositório GitHub
3. Configure as **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Deploy automático:
Toda vez que você fizer `git push`, o Vercel faz deploy automaticamente!

```bash
git add .
git commit -m "feat: minha nova feature"
git push
```

---

## 📚 Documentação Adicional

- **Supabase Auth**: https://supabase.com/docs/guides/auth
- **Next.js 14**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 💡 Próximos Passos

Após rodar o projeto pela primeira vez:

1. ✅ Configure email verification no Supabase
2. ✅ Customize email templates (Settings → Authentication → Email Templates)
3. ✅ Configure rate limiting (Settings → Authentication → Rate Limits)
4. ✅ Adicione mais usuários de teste
5. ✅ Teste todos os fluxos de workflow

---

## 🆘 Precisa de Ajuda?

Se encontrar problemas:
1. Verifique os logs no terminal (onde rodou `npm run dev`)
2. Abra o Console do navegador (F12 → Console)
3. Verifique se `.env.local` está configurado corretamente
4. Tente limpar cookies e cache do navegador

**Status do servidor**: Deve mostrar no terminal:
```
✓ Ready in Xms
○ Local:   http://localhost:3000
```
