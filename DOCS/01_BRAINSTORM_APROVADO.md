# RELATÓRIO GERAL — SISTEMA OPERACIONAL DE CONTEÚDO (APROVADO)

**Salvo em:** 2025-01-04
**Status:** Brainstorm inicial - aguardando escopo completo

---

## 1) O que o sistema É (aprovado)

Um **"personal trainer de post"**: um sistema que transforma a intenção humana em **execução consistente**, guiando o usuário passo a passo para montar um post dentro dos protocolos.

Ele é, na prática:

* **linha de montagem** (com peças reutilizáveis)
* **memória organizada** (pra não recomeçar do zero todo dia)
* **motor operacional** (Post do Dia → PostPack → QA → Pós → Métricas → Aprendizado)

✅ O sistema foi aprovado como **infraestrutura**, não "ferramenta criativa solta".

---

## 2) Princípios e limites (aprovado)

### ✅ Sistema NÃO-decisório (regra-mãe)

O sistema:

* **não decide estratégia**
* **não escolhe objetivo do mês sozinho**
* **não adapta plano sozinho**
* **não cria hype automaticamente**
* **não substitui o humano**

O humano (você) governa:

* objetivo do mês
* estratégia mensal
* leitura de contexto
* diagnóstico de "por que não performou"

---

## 3) Objetivo não-negociável do projeto (aprovado)

O que **não pode acontecer**, mesmo que cresça:

* **não ter constância**
* **não seguir protocolos**
* **não seguir as estratégias definidas**

A dor que o sistema resolve foi cravada:

> "Tenho tudo, mas toda vez parece que estou começando do zero."

---

## 4) Perfis e uso (aprovado)

* **Fase 1:** DraKarina + A Gente Viaja Brasil
* Usuários atuais: **você e Karina**
* Futuro: **pode virar produto** (sem definir pra quem "não é" ainda) → **LACUNA**

---

## 5) Cadência e mix editorial (aprovado como referência)

* **Vídeos curtos (Reels):** 5–6 por semana
* **Carrosséis:** ~2 por semana
* **Stories:** diários, **5–8** seguindo protocolo

**Mix mensal (referência):**

* **60% Autoridade**
* **20% Crescimento**
* **20% Conversão**

**Quem decide o objetivo mensal:** você. ✅

---

## 6) Prioridades de temas/procedimentos (aprovado)

* Prioridade: **íntimo** (masc + fem) com peso alto
* Depois: **glúteo**
* Depois: **full face**
* E uma cauda: ~**10% procedimentos tradicionais**

Percentual exato do íntimo: "pode ser 60%–70%", mas **não fechado** → **LACUNA**

---

## 7) O ciclo central (aprovado)

**Post do Dia → Montagem guiada → PostPack → Aprovação humana → Publicação → Pós-post → Métricas → Aprendizado/versão**

Detalhe importante:
* O fluxo do dia **começa no Post do Dia**, não no objetivo do mês.
* O objetivo do mês existe e guia, mas **não é o gatilho diário**.

---

## 8) Modos de uso (aprovado)

### Modo A — "Sem ideia"
* sistema puxa **5 ideias** do banco conforme objetivo/formato/procedimento
* botão de paginação: **"mais 5"**
* escolheu ideia → entra na montagem guiada

### Modo B — "Tive uma ideia"
* você/Karina entram com a ideia
* sistema encaixa no mesmo pipeline (protocolos + peças)

### Modo C — "Viral/alcance"
* existe como exceção (interrupção)
* entra no mesmo fluxo, só acelerado

---

## 9) Peças do PostPack (aprovado)

PostPack = **kit do post** e **ativo histórico reutilizável**

Peças obrigatórias:
* **Headline/Gancho**
* **Legenda (SEOgram)**
* **Palavras-chave**
* **Hashtags**
* **CTA**
* **Evergreen**
* **Checklist de protocolos** (ex.: áudio em alta, gancho 0–3s, etc.)
* **Lembretes operacionais** (pós-post, responder comentários 0–30min)
* **Registro de performance**
* **Anotação causal** ("não performou por X")

✅ "Perfeito" pra publicar = dentro da estratégia + kit completo conforme protocolos.

---

## 10) Protocolos (aprovado)

Protocolos são **micro-regras combináveis**:
* por **formato** (Reels/Carrossel/Stories)
* por **objetivo** (autoridade/crescimento/conversão)
* por **timing** (0–30min pós-post, horários de stories)
* por **operação** (DM, rotinas)

Quando um protocolo melhora:
* **não substitui** o antigo
* **convive** e fica consultável (Instagram é cíclico)

---

## 11) Qualidade e controle humano (aprovado)

* **aprovação/reprovação humana** com **motivo**
* Pós-post obrigatório: **responder comentários nos primeiros 30 min**

---

## 12) Métricas e "memória ativa" (aprovado parcialmente)

✅ Ao abrir o sistema: ver **os números primeiro** (dashboard)
✅ Sistema deve ter: **memória ativa** (lembrar o que você esqueceu)

**LACUNAS:**
* quais métricas exatas entram no dashboard
* como a memória ativa aparece (alerta/notificação/painel)

---

# BANCO DE DADOS — DIREÇÃO APROVADA

## 13) Direção do banco

* **Supabase / PostgreSQL** como banco
* **Notion NÃO é fonte da verdade**
* Interface pode ser **painel web** e/ou **Notion depois**
* Saída: **HTML e Notion a princípio**

O banco precisa guardar:
* **protocolos históricos**
* **memória/histórico**
* **decisões mensais**
* **postpacks já usados**
* **performance + anotação causal**

## 14) NÃO aprovado ainda

❌ Schema/tabelas/campos/relacionamentos → **LACUNA**
❌ Regras de repetição/saturação → **LACUNA**
❌ Métricas mínimas → **LACUNA**
❌ Permissões por papel → **LACUNA**
❌ Se IA entra na fase 1 → **LACUNA**

---

# INTERFACE / TELAS — APROVADO

## 15) Painel front-end como prioridade

* "**o front-end é o mais importante**"
* fluxo: escolher → montar → checklist → salvar PostPack → aprovar

## 16) Protótipos visuais

2 imagens geradas:
1. **4 fluxos** (sem ideia / tive ideia / viral / o que postar hoje)
2. **6 telas** (dashboard, entrada, legenda, hashtags, protocolos, histórico)

---

# RESUMO: FECHADO vs ABERTO

## ✅ FECHADO (aprovado)

- Sistema = personal trainer de post (linha de montagem + memória)
- Regra-mãe: sistema **não decide estratégia**
- Ciclo: Post do Dia → PostPack → QA → Pós → Métricas → Aprendizado
- PostPack é **histórico reutilizável**
- Protocolos = micro-regras combináveis e versionáveis
- Cadência base e mix 60/20/20
- Você decide objetivo mensal
- Dashboard começa com números
- Memória ativa é obrigatória

## ⚠️ ABERTO (lacunas)

- Schema Supabase (tabelas/campos/índices/permissões)
- Métricas mínimas do dashboard
- Regra de repetição/saturação
- Como a memória ativa aparece
- Se IA entra na fase 1
- Papéis e permissões
- Canal final de saída definitivo
