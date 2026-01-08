# ESCOPO DE ENGENHARIA (DevCN) — SISTEMA OPERACIONAL DE CONTEÚDO

**Salvo em:** 2025-01-04
**Status:** Semi-aprovado (aberto a considerações)

---

# 0) Regras de projeto (pra não virar bagunça)

1. **Um repositório só** (por enquanto). Nada de 5 repositórios e "cadê o arquivo?".
2. **Três camadas separadas** (claras):
   * **Aplicativo** (interface)
   * **Servidor** (regras + integração)
   * **Banco de dados** (estrutura + migrações + funções)
3. **Documentação como memória externa**: decisões, fluxos e versões.
4. **Versões de protocolos convivem** (não apaga histórico).
5. **Sem automação antes do MVP rodar**: primeiro o "treinador de post" em pé.

---

# 1) Escopo do sistema (fluxos que viram código)

## Fluxo 1 — "Sem ideia"
* Post do Dia → puxar 5 ideias → escolher → montar por peças → gerar PostPack → QA → publicar (fora) → pós → métricas → anotação causal

## Fluxo 2 — "Tive uma ideia"
* Entrada de ideia manual → mesma montagem guiada → PostPack → QA → etc.

## Fluxo 3 — "Quero alcance (viral)"
* Entrada rápida → montagem acelerada (gancho/CTA/legenda/checklist) → PostPack → QA → etc.

## Fluxo 4 — "Quero autoridade"
* Mesmo pipeline, só muda objetivo/protocolos.

## Fluxo 5 — "Quero conversão"
* Mesmo pipeline, só muda objetivo/protocolos.

> Tradução: **um pipeline só**, com modos diferentes. Hype não vira outro sistema.

---

# 2) Estrutura de pastas e arquivos (repositório)

```txt
sistema-operacional-instagram/
├─ README.md
├─ DECISOES.md
├─ ROADMAP.md
├─ LICENCA.md
├─ .gitignore
├─ .env.exemplo
│
├─ documentos/
│  ├─ 00-visao-geral.md
│  ├─ 01-fluxos-principais.md
│  ├─ 02-regras-nao-decisorio.md
│  ├─ 03-taxonomia-tags.md
│  ├─ 04-protocolos-versionamento.md
│  ├─ 05-qualidade-e-aprovacao.md
│  ├─ 06-metricas-minimas.md
│  └─ 07-compliance-clinica.md
│
├─ design/
│  ├─ telas/
│  │  ├─ painel.png
│  │  ├─ montar-post-entrada.png
│  │  ├─ montar-post-legenda.png
│  │  ├─ montar-post-hashtags.png
│  │  ├─ montar-post-protocolos.png
│  │  └─ historico-postpack.png
│  └─ fluxos/
│     └─ quatro-fluxos.png
│
├─ aplicativo/                      # Interface (painel)
│  ├─ web/
│  │  ├─ package.json
│  │  ├─ src/
│  │  │  ├─ paginas/
│  │  │  │  ├─ painel/
│  │  │  │  │  └─ pagina.tsx
│  │  │  │  ├─ post-do-dia/
│  │  │  │  │  ├─ entrada.tsx
│  │  │  │  │  ├─ sem-ideia.tsx
│  │  │  │  │  ├─ tive-uma-ideia.tsx
│  │  │  │  │  ├─ montagem/
│  │  │  │  │  │  ├─ gancho.tsx
│  │  │  │  │  │  ├─ legenda-seogram.tsx
│  │  │  │  │  │  ├─ hashtags.tsx
│  │  │  │  │  │  ├─ cta.tsx
│  │  │  │  │  │  ├─ protocolos.tsx
│  │  │  │  │  │  └─ resumo-postpack.tsx
│  │  │  │  │  └─ enviar-para-aprovacao.tsx
│  │  │  │  ├─ aprovacao/
│  │  │  │  │  ├─ fila.tsx
│  │  │  │  │  └─ detalhe.tsx
│  │  │  │  ├─ biblioteca/
│  │  │  │  │  ├─ ideias.tsx
│  │  │  │  │  ├─ protocolos.tsx
│  │  │  │  │  ├─ hashtags.tsx
│  │  │  │  │  ├─ ctAs.tsx
│  │  │  │  │  └─ headlines.tsx
│  │  │  │  ├─ historico/
│  │  │  │  │  ├─ lista.tsx
│  │  │  │  │  └─ postpack.tsx
│  │  │  │  └─ metricas/
│  │  │  │     ├─ resumo.tsx
│  │  │  │     └─ detalhe-post.tsx
│  │  │  ├─ componentes/
│  │  │  ├─ estados/
│  │  │  ├─ servicos/
│  │  │  ├─ validacoes/
│  │  │  └─ estilos/
│  │  └─ testes/
│  └─ compartilhado/
│     ├─ tipos/
│     ├─ validadores/
│     └─ utilitarios/
│
├─ servidor/                        # Regras, consultas, integrações
│  ├─ api/
│  │  ├─ package.json
│  │  ├─ src/
│  │  │  ├─ rotas/
│  │  │  │  ├─ painel.ts
│  │  │  │  ├─ post-do-dia.ts
│  │  │  │  ├─ ideias.ts
│  │  │  │  ├─ protocolos.ts
│  │  │  │  ├─ componentes.ts
│  │  │  │  ├─ postpack.ts
│  │  │  │  ├─ aprovacao.ts
│  │  │  │  ├─ pos-post.ts
│  │  │  │  └─ metricas.ts
│  │  │  ├─ regras/
│  │  │  │  ├─ recomendacao-v0.ts
│  │  │  │  ├─ evitar-repeticao.ts
│  │  │  │  ├─ gerar-postpack.ts
│  │  │  │  ├─ validacao-protocolos.ts
│  │  │  │  └─ compliance-sinalizador.ts
│  │  │  ├─ repositorios/
│  │  │  ├─ autenticacao/
│  │  │  ├─ integracoes/
│  │  │  │  ├─ armazenamento-midias.ts
│  │  │  │  └─ coletor-metricas.ts
│  │  │  └─ utilitarios/
│  │  └─ testes/
│  └─ tarefas/
│     ├─ coletar-metricas-diario.ts
│     ├─ gerar-alertas-diarios.ts
│     └─ importar-banco-inicial.ts
│
├─ banco-de-dados/                  # Supabase/Postgres
│  ├─ migracoes/
│  │  ├─ 0001_base.sql
│  │  ├─ 0002_protocolos.sql
│  │  ├─ 0003_componentes.sql
│  │  ├─ 0004_postpack.sql
│  │  ├─ 0005_aprovacao.sql
│  │  ├─ 0006_metricas.sql
│  │  └─ 0007_permissoes.sql
│  ├─ politicas/
│  │  ├─ leitura-por-papel.sql
│  │  └─ escrita-por-papel.sql
│  ├─ funcoes/
│  │  ├─ recomendacao_v0.sql
│  │  ├─ evitar_repeticao.sql
│  │  └─ score_post.sql
│  ├─ sementes/
│  │  ├─ protocolos_iniciais.json
│  │  ├─ ideias_iniciais.json
│  │  ├─ hashtags_iniciais.json
│  │  ├─ ctas_iniciais.json
│  │  └─ headlines_iniciais.json
│  └─ armazenamento/
│     └─ midias.md
│
├─ automacoes/                      # n8n e tarefas programadas (depois do MVP)
│  ├─ n8n/
│  │  ├─ fluxos/
│  │  └─ credenciais.md
│  └─ agendamentos.md
│
└─ scripts/
   ├─ subir-ambiente-local.sh
   ├─ validar-banco.sh
   ├─ importar-sementes.sh
   └─ exportar-postpack-html.sh
```

---

# 3) Como os fluxos "viram telas" (mapeamento de interface)

### Tela 1 — **Painel (dashboard)**
* números primeiro (aprovado)
* "hoje: objetivo + formato"
* alertas (memória ativa) **(estrutura aprovada; detalhes de alertas = lacuna)**

### Tela 2 — **Post do Dia (entrada)**
* "sem ideia / tive uma ideia / enviar vídeo ou rascunho"
* botão "começar"

### Telas 3 a 7 — **Montagem guiada**
* gancho/headline
* legenda SEOgram (por template ou ajuste assistido)
* hashtags
* CTA
* protocolos (checklist consolidado)
* resumo: "PostPack do dia"

### Tela 8 — **Aprovação**
* fila
* reprovar com motivo
* aprovar e liberar "publicar fora"

### Tela 9 — **Pós-post**
* checklist (comentários 30 min etc.)
* marcar concluído

### Tela 10 — **Métricas + anotação causal**
* registrar números
* registrar "por que deu ruim / por que deu bom"

### Tela 11 — **Histórico**
* lista de PostPacks
* abrir um PostPack e reutilizar

---

# 4) Como os fluxos "viram rotas" (servidor)

Rotas mínimas do servidor (v0.1):

* `GET /painel` → dados do dashboard
* `POST /post-do-dia/iniciar`
* `GET /ideias/recomendar?objetivo=&formato=&procedimento=`
* `POST /postpack` → salvar kit
* `POST /aprovacao/enviar` → cria item de aprovação
* `POST /aprovacao/decidir` → aprova/reprova com motivo
* `POST /pos-post/concluir`
* `POST /metricas/registrar`
* `POST /anotacao-causal/registrar`
* `GET /historico/postpacks`

---

# 5) Convenções de arquivos e nomes

## Identificadores (IDs) e versão

* Protocolos: `PROTOCOLO_0001`, `PROTOCOLO_0002`…
* Versão: `v1`, `v2`, `v3` (convivem; nunca apaga)
* PostPack: `POSTPACK_YYYYMMDD_###`
* Ideias: `IDEIA_####`

## Taxonomia mínima

* objetivo: `autoridade | crescimento | conversao`
* formato: `reels | carrossel | stories`
* procedimento/tema: `intimo_masc | intimo_fem | gluteo | full_face | tradicional`
* pilar: `autoridade | alcance | conversao | comunidade` (se quiser manter)

---

# 6) Backlog técnico de criação do esqueleto

1. Criar repositório com a árvore acima + docs-base (visão, regras, fluxos).
2. Subir o **aplicativo web** com as páginas vazias (só navegação).
3. Subir o **servidor** com rotas "mockadas" (retornando dados falsos) pra interface andar.
4. Criar pasta **banco-de-dados/migracoes** com placeholders (sem schema final).
5. Criar "sementes" (arquivos json) pra popular ideias/protocolos/hashtags/ctas/headlines.
6. Conectar interface → servidor → (depois) banco.

---

# 7) Perguntas pendentes

1. **Nome final do repositório** (curto e oficial).
2. **Os papéis de acesso** (mínimo): você, Karina, editor, aprovador — quais existem no v0.1?
3. **Onde o vídeo entra no fluxo**: upload no começo ou só link/rascunho na fase 1?
4. **Canal de saída do PostPack**: copiar/colar (texto), exportar HTML, ou ambos?
