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

## Stack Tecnologico

- **Frontend:** Next.js 16.1.1, React 18, TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Deploy:** Vercel
- **Build:** Turbopack

## Banco de Dados

| Tabela | Registros | Descricao |
|--------|-----------|-----------|
| posts | 100 | Posts estrategicos completos |
| ctas | 163 | Chamadas para acao |
| hashtags | 175 | Hashtags otimizadas |
| hashtag_combos | 350 | Combinacoes prontas |
| keywords | 50 | Palavras-chave SEO |

## Rodando Localmente

\`\`\`bash
# Clonar repositorio
git clone https://github.com/SEU_USUARIO/daily-prophet-gamified.git

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
│   ├── page.tsx          # Pagina principal
│   ├── layout.tsx        # Layout global
│   └── globals.css       # Estilos globais
├── public/               # Assets estaticos
├── .env.local           # Variaveis de ambiente (nao commitado)
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
\`\`\`

## Deploy

O projeto esta configurado para deploy automatico no Vercel.

\`\`\`bash
# Deploy manual
npx vercel --prod
\`\`\`

## Autor

**Instituto Rodovansky**
- Desenvolvido para Dra. Karina Rodovansky
- Gestao: Tigrao (Diretor Comercial)

## Licenca

Projeto privado - Instituto Rodovansky 2026
