# Daily Prophet - Sistema de Conteudo Instagram

Sistema automatizado de gestao de conteudo para Instagram do Instituto Rodovansky.

## Demo

**Producao:** https://daily-prophet-gamified.vercel.app

## Funcionalidades

- Dashboard com estatisticas de posts
- Visualizacao de posts por status (pendente/aprovado/publicado)
- Preview completo com hook, legenda, CTA e hashtags
- Copiar conteudo com um clique
- Interface responsiva (desktop e mobile)
- Integracao com Supabase
- **Workflow de 5 fases para PostPacks** (novo)

## Stack Tecnologico

- **Frontend:** Next.js 16.1.1, React 18, TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Deploy:** Vercel (CI/CD automatico via GitHub)
- **Build:** Turbopack

## Banco de Dados

| Tabela | Registros | Descricao |
|--------|-----------|-----------|
| posts | 100 | Posts estrategicos completos |
| ctas | 163 | Chamadas para acao |
| hashtags | 175 | Hashtags otimizadas |
| hashtag_combos | 350 | Combinacoes prontas |
| keywords | 50 | Palavras-chave SEO |
| postpacks | - | Pacotes de posts agrupados |
| postpack_workflow | - | Workflow de 5 fases |

## Workflow de PostPacks

O sistema possui um workflow de 5 fases para gerenciar postpacks:

| Fase | Nome | Descricao |
|------|------|-----------|
| 1 | Criacao | Criacao do conteudo do post |
| 2 | Revisao | Revisao e ajustes do conteudo |
| 3 | Aprovacao | Aprovacao final pela Dra. Karina |
| 4 | Publicacao | Publicacao no Instagram |
| 5 | Metricas | Coleta e analise de metricas |

## Rodando Localmente

\`\`\`bash
# Clonar repositorio
git clone https://github.com/lucastigrereal-dev/daily-prophet-gamified.git

# Instalar dependencias
npm install

# Configurar variaveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais Supabase

# Rodar em desenvolvimento
npm run dev

# Acessar
http://localhost:3000
\`\`\`

## Variaveis de Ambiente

Crie um arquivo \`.env.local\` com:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
\`\`\`

## Estrutura do Projeto

\`\`\`
daily-prophet-gamified/
├── app/
│   ├── page.tsx              # Pagina principal
│   ├── layout.tsx            # Layout global
│   └── globals.css           # Estilos globais
├── components/
│   └── WorkflowTracker.tsx   # Componente de workflow
├── lib/
│   ├── supabase.ts           # Cliente Supabase
│   └── workflow-api.ts       # API CRUD do workflow
├── types/
│   └── workflow.ts           # Tipos TypeScript
├── scripts/
│   └── 001_create_postpack_workflow.sql  # Migration SQL
├── DOCS/                     # Documentacao do projeto
├── public/                   # Assets estaticos
├── .env.local               # Variaveis de ambiente (nao commitado)
├── .env.example             # Template de variaveis
├── .gitignore
├── next.config.ts
├── package.json
├── tailwind.config.js
└── tsconfig.json
\`\`\`

## Deploy

O projeto esta configurado para deploy automatico no Vercel.
Todo push para a branch \`master\` dispara deploy automatico.

\`\`\`bash
# Deploy manual (se necessario)
npx vercel --prod
\`\`\`

## URLs do Projeto

| Recurso | URL |
|---------|-----|
| Producao | https://daily-prophet-gamified.vercel.app |
| GitHub | https://github.com/lucastigrereal-dev/daily-prophet-gamified |
| Vercel Dashboard | https://vercel.com/lucas-projects-ffa9a1fb/daily-prophet-gamified |
| Supabase | https://supabase.com/dashboard/project/damxbdkteskryonvgvpc |

## Autor

**Instituto Rodovansky**
- Desenvolvido para Dra. Karina Rodovansky
- Gestao: Tigrao (Diretor Comercial)

## Licenca

Projeto privado - Instituto Rodovansky 2026
