# 🚀 GUIA DE DEPLOY NO VERCEL

## ⚡ DEPLOY RÁPIDO (5 minutos)

### OPÇÃO 1: Deploy via Vercel Dashboard (RECOMENDADO)

#### PASSO 1: Fazer Push para GitHub (2 minutos)
```bash
cd C:\Users\lucas\daily-prophet-gamified

# Adicionar arquivos
git add .gitignore src/ vercel.json package.json package-lock.json tsconfig.json tailwind.config.js postcss.config.js next.config.js README.md

# Commit
git commit -m "chore: prepare for vercel deployment"

# Push para GitHub
git push origin master
```

Se não tiver repositório no GitHub ainda:
```bash
# Criar no GitHub primeiro: https://github.com/new
# Nome sugerido: daily-prophet-gamified

# Depois linkar
git remote add origin https://github.com/SEU-USUARIO/daily-prophet-gamified.git
git push -u origin master
```

---

#### PASSO 2: Conectar no Vercel (1 minuto)
```
1. Acesse: https://vercel.com/new
2. Faça login (GitHub, GitLab ou Email)
3. Clique em "Import Project"
4. Selecione seu repositório "daily-prophet-gamified"
5. Clique "Import"
```

---

#### PASSO 3: Configurar Variáveis de Ambiente (1 minuto)
```
Na página de configuração do Vercel:

1. Role até "Environment Variables"
2. Adicione as seguintes variáveis:

Nome: NEXT_PUBLIC_SUPABASE_URL
Valor: https://damxbdkteskryonvgvpc.supabase.co

Nome: NEXT_PUBLIC_SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbXhiZGt0ZXNrcnlvbnZndnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4ODY2OTEsImV4cCI6MjA4MjQ2MjY5MX0.cU2B2Qcwzt5DiRxzeicw68_NWfa2oh1nO3E4e5TPDus

3. Clique "Add" para cada uma
```

---

#### PASSO 4: Deploy! (1 minuto)
```
1. Clique no botão "Deploy"
2. Aguarde 1-2 minutos (Vercel faz build automaticamente)
3. Quando terminar, aparecerá:
   ✅ "Congratulations! Your project has been deployed."
4. Clique em "Visit" para ver o app no ar!
```

---

### OPÇÃO 2: Deploy via CLI (Alternativo)

#### Instalar Vercel CLI
```bash
npm install -g vercel
```

#### Deploy
```bash
cd C:\Users\lucas\daily-prophet-gamified

# Login
vercel login

# Deploy
vercel

# Seguir prompts:
# - Set up and deploy? Yes
# - Which scope? Sua conta
# - Link to existing project? No
# - Project name? daily-prophet-gamified
# - Directory? ./
# - Override settings? No

# Deploy para produção
vercel --prod
```

---

## 🔧 CONFIGURAÇÕES NO SUPABASE

Após o deploy, atualize as URLs permitidas no Supabase:

### PASSO 1: Abrir Supabase Dashboard
```
https://app.supabase.com/project/damxbdkteskryonvgvpc/auth/url-configuration
```

### PASSO 2: Adicionar URLs do Vercel
```
Na seção "Site URL", adicione:
https://seu-projeto.vercel.app

Na seção "Redirect URLs", adicione:
https://seu-projeto.vercel.app/**

Salve as alterações
```

---

## ✅ VALIDAÇÃO PÓS-DEPLOY

Após o deploy, teste:

### 1. Acessar o site
```
https://seu-projeto.vercel.app
```

### 2. Testar Cadastro
```
1. Vá para /signup
2. Crie novo usuário
3. Deve fazer login automaticamente
4. Redirecionar para /workflow
```

### 3. Testar Postpacks
```
1. Clicar em "+ Novo PostPack"
2. Ver os 5 postpacks no dropdown
3. Criar workflow
4. Verificar se salvou
```

### 4. Testar Login/Logout
```
1. Fazer logout
2. Fazer login novamente
3. Ver workflows criados
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Module not found"
**Solução:** Verificar se todas as dependências estão no `package.json`
```bash
npm install
```

### Erro: "NEXT_PUBLIC_SUPABASE_URL is not defined"
**Solução:** Verificar se as variáveis de ambiente foram adicionadas no Vercel
```
1. Vercel Dashboard → Seu projeto → Settings → Environment Variables
2. Verificar se NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão lá
3. Se não, adicionar e fazer redeploy
```

### Erro 500 ou página em branco
**Solução:**
```
1. Vercel Dashboard → Seu projeto → Deployments → Último deployment
2. Clicar em "View Function Logs"
3. Ver o erro específico
4. Me enviar o erro para debug
```

### Login não funciona em produção
**Solução:** Verificar Site URL e Redirect URLs no Supabase
```
1. https://app.supabase.com/project/damxbdkteskryonvgvpc/auth/url-configuration
2. Site URL deve ser: https://seu-projeto.vercel.app
3. Redirect URLs deve incluir: https://seu-projeto.vercel.app/**
```

---

## 🔄 REDEPLOY (Após mudanças)

### Via GitHub (Automático)
```bash
# Fazer mudanças no código
git add .
git commit -m "feat: nova funcionalidade"
git push

# Vercel detecta o push e faz redeploy automaticamente!
```

### Via CLI
```bash
vercel --prod
```

---

## 📊 MONITORAMENTO

Após deploy, você pode monitorar:

### Analytics
```
Vercel Dashboard → Seu projeto → Analytics
- Visualizações
- Usuários únicos
- Performance
```

### Logs
```
Vercel Dashboard → Seu projeto → Deployments → Ver logs
- Erros de build
- Erros de runtime
- Requests
```

### Function Logs (Supabase)
```
Supabase Dashboard → Logs
- Queries
- Erros de API
- Auth logs
```

---

## 🎯 DOMÍNIO PERSONALIZADO (Opcional)

### Adicionar domínio próprio
```
1. Comprar domínio (ex: Namecheap, GoDaddy, Registro.br)
2. Vercel Dashboard → Seu projeto → Settings → Domains
3. Clicar "Add Domain"
4. Inserir seu domínio: seusite.com
5. Seguir instruções de DNS
6. Aguardar propagação (pode levar até 48h)
```

---

## ✅ CHECKLIST PÓS-DEPLOY

- [ ] App acessível via URL do Vercel
- [ ] Cadastro funciona
- [ ] Login funciona
- [ ] Postpacks aparecem corretamente
- [ ] Workflows podem ser criados
- [ ] RLS funciona (usuários isolados)
- [ ] URLs adicionadas no Supabase
- [ ] Variáveis de ambiente configuradas

---

## 🎉 PARABÉNS!

Seu Daily Prophet Gamified está NO AR! 🚀

**URL do App:** https://seu-projeto.vercel.app
**Supabase Dashboard:** https://app.supabase.com/project/damxbdkteskryonvgvpc
**Vercel Dashboard:** https://vercel.com/dashboard

---

**Desenvolvido com Next.js 14, Supabase, TypeScript e TailwindCSS**
