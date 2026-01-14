# 🗄️ DAILY PROPHET - DOCUMENTAÇÃO DO BANCO DE DADOS

> **Projeto:** Daily Prophet Gamified
> **Banco:** Supabase (PostgreSQL)
> **ID do Projeto:** damxbdkteskryonvgvpc
> **Última atualização:** 2026-01-11

---

## 📊 VISÃO GERAL

O banco de dados do Daily Prophet é composto por **14 tabelas principais** que armazenam todo o conteúdo necessário para gerar posts otimizados para Instagram.

### Estrutura Modular

```
📦 BANCO DE DADOS
├─ 🎯 Configurações (objetivos, formatos, procedimentos, horarios)
├─ 💡 Conteúdo (ideias, ganchos, legendas, ctas, hashtags)
├─ 📋 Organização (hashtag_combos, roteiros, protocolos)
└─ ✅ Execução (checklist_items)
```

---

## 🎯 TABELA: objetivos

Armazena os objetivos de marketing que um post pode ter.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | UUID | Identificador único | PRIMARY KEY |
| `code` | VARCHAR | Código identificador (ex: "engajamento") | UNIQUE, NOT NULL |
| `name` | VARCHAR | Nome exibido | NOT NULL |
| `description` | TEXT | Descrição detalhada | NULL |
| `icon` | VARCHAR | Emoji ou ícone | NULL |
| `cor` | VARCHAR | Cor em HEX | NULL |
| `ordem` | INTEGER | Ordem de exibição | NOT NULL |
| `is_active` | BOOLEAN | Status ativo/inativo | DEFAULT true |

**Exemplos de registros:**
- Engajamento
- Educação
- Autoridade
- Vendas
- Networking

---

## 📱 TABELA: formatos

Define os formatos de conteúdo do Instagram.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | UUID | Identificador único | PRIMARY KEY |
| `code` | VARCHAR | Código do formato (ex: "reels") | UNIQUE, NOT NULL |
| `name` | VARCHAR | Nome exibido | NOT NULL |
| `description` | TEXT | Descrição do formato | NULL |
| `icon` | VARCHAR | Emoji ou ícone | NULL |
| `duracao_media` | VARCHAR | Duração típica | NULL |
| `ordem` | INTEGER | Ordem de exibição | NOT NULL |
| `is_active` | BOOLEAN | Status ativo/inativo | DEFAULT true |

**Formatos suportados:**
- Reels
- Carrossel
- Stories
- Foto única

---

## 🔧 TABELA: procedimentos

Procedimentos específicos do Instituto Rodovansky.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | UUID | Identificador único | PRIMARY KEY |
| `code` | VARCHAR | Código do procedimento | UNIQUE, NOT NULL |
| `name` | VARCHAR | Nome do procedimento | NOT NULL |
| `description` | TEXT | Descrição detalhada | NULL |
| `icon` | VARCHAR | Emoji ou ícone | NULL |
| `palavras_chave` | TEXT[] | Array de palavras-chave | NULL |
| `prioridade` | INTEGER | Nível de prioridade | NOT NULL |
| `is_active` | BOOLEAN | Status ativo/inativo | DEFAULT true |

**Exemplos:**
- Preenchimento labial
- Harmonização facial
- Toxina botulínica
- Bioestimuladores

---

## ⏰ TABELA: horarios

Horários recomendados para publicação.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | UUID | Identificador único | PRIMARY KEY |
| `horario` | TIME | Hora da publicação | NOT NULL |
| `label` | VARCHAR | Rótulo (ex: "Manhã") | NULL |
| `descricao` | TEXT | Descrição do horário | NULL |
| `is_active` | BOOLEAN | Status ativo/inativo | DEFAULT true |

---

## 💡 TABELA: ideias

Banco de ideias de conteúdo para posts.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | UUID | Identificador único | PRIMARY KEY |
| `titulo` | VARCHAR | Título da ideia | NOT NULL |
| `descricao` | TEXT | Descrição completa | NULL |
| `procedimento_id` | UUID | FK para procedimentos | NULL |
| `objetivo_id` | UUID | FK para objetivos | NULL |
| `formato_recomendado` | VARCHAR | Formato sugerido | NULL |
| `palavras_chave` | TEXT[] | Palavras-chave | NULL |
| `nivel_dificuldade` | ENUM | facil, medio, dificil | NULL |
| `tempo_producao` | VARCHAR | Tempo estimado | NULL |
| `vezes_usado` | INTEGER | Contador de uso | DEFAULT 0 |
| `performance_media` | NUMERIC | Média de performance | NULL |
| `is_active` | BOOLEAN | Status ativo/inativo | DEFAULT true |
| `created_at` | TIMESTAMPTZ | Data de criação | DEFAULT NOW() |

**Relacionamentos:**
- `procedimento_id` → `procedimentos(id)`
- `objetivo_id` → `objetivos(id)`

---

## 🎣 TABELA: ganchos

Ganchos/hooks para início de conteúdo.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | UUID | Identificador único | PRIMARY KEY |
| `conteudo` | TEXT | Texto do gancho | NOT NULL |
| `tipo` | ENUM | pergunta, estatistica, controverso, historia, curiosidade | NOT NULL |
| `procedimento_id` | UUID | FK para procedimentos | NULL |
| `objetivo_id` | UUID | FK para objetivos | NULL |
| `formato_id` | UUID | FK para formatos | NULL |
| `palavras_chave` | TEXT[] | Palavras-chave | NULL |
| `vezes_usado` | INTEGER | Contador de uso | DEFAULT 0 |
| `performance_media` | NUMERIC | Média de performance | NULL |
| `is_active` | BOOLEAN | Status ativo/inativo | DEFAULT true |
| `created_at` | TIMESTAMPTZ | Data de criação | DEFAULT NOW() |

**Relacionamentos:**
- `procedimento_id` → `procedimentos(id)`
- `objetivo_id` → `objetivos(id)`
- `formato_id` → `formatos(id)`

---

## 📝 TABELA: legendas

Legendas prontas organizadas por tipo E-E-A-T.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | UUID | Identificador único | PRIMARY KEY |
| `conteudo` | TEXT | Texto da legenda | NOT NULL |
| `tipo` | ENUM | abertura, meio_eeat, meio_viral, meio_emocional, fechamento | NOT NULL |
| `categoria` | VARCHAR | Categoria adicional | NULL |
| `pilar` | VARCHAR | Pilar de conteúdo | NULL |
| `procedimento_id` | UUID | FK para procedimentos | NULL |
| `palavras_chave` | TEXT[] | Palavras-chave | NULL |
| `caracteres` | INTEGER | Tamanho da legenda | NULL |
| `vezes_usado` | INTEGER | Contador de uso | DEFAULT 0 |
| `performance_media` | NUMERIC | Média de performance | NULL |
| `is_active` | BOOLEAN | Status ativo/inativo | DEFAULT true |
| `created_at` | TIMESTAMPTZ | Data de criação | DEFAULT NOW() |

**Tipos de legenda (E-E-A-T):**
- `abertura`: Início chamativo
- `meio_eeat`: Expertise/Autoridade/Confiança
- `meio_viral`: Conteúdo viral
- `meio_emocional`: Apelo emocional
- `fechamento`: Conclusão

**Relacionamentos:**
- `procedimento_id` → `procedimentos(id)`

---

## 🎯 TABELA: ctas

Chamadas para ação (CTAs) organizadas por categoria.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | UUID | Identificador único | PRIMARY KEY |
| `conteudo` | TEXT | Texto do CTA | NOT NULL |
| `categoria` | ENUM | salvamento, comentario, compartilhamento, dm, link | NOT NULL |
| `intensidade` | ENUM | suave, medio, direto | NOT NULL |
| `objetivo_id` | UUID | FK para objetivos | NULL |
| `formato_id` | UUID | FK para formatos | NULL |
| `posicao` | ENUM | inicio, final, ambos | NULL |
| `vezes_usado` | INTEGER | Contador de uso | DEFAULT 0 |
| `performance_media` | NUMERIC | Média de performance | NULL |
| `is_active` | BOOLEAN | Status ativo/inativo | DEFAULT true |
| `created_at` | TIMESTAMPTZ | Data de criação | DEFAULT NOW() |

**Categorias de CTA:**
1. Salvamento - Incentiva salvar o post
2. Comentário - Pede interação nos comentários
3. Compartilhamento - Incentiva compartilhar
4. DM - Direciona para Direct
5. Link - Direciona para link na bio

**Relacionamentos:**
- `objetivo_id` → `objetivos(id)`
- `formato_id` → `formatos(id)`

---

## #️⃣ TABELA: hashtags

Banco de hashtags categorizadas por alcance.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | UUID | Identificador único | PRIMARY KEY |
| `conteudo` | VARCHAR | Hashtag (com #) | NOT NULL, UNIQUE |
| `categoria` | VARCHAR | Categoria da hashtag | NULL |
| `alcance` | ENUM | pequena, media, grande | NOT NULL |
| `volume_posts` | INTEGER | Quantidade de posts | NULL |
| `procedimento_id` | UUID | FK para procedimentos | NULL |
| `is_shadowbanned` | BOOLEAN | Se está shadowbanned | DEFAULT false |
| `ultima_verificacao` | TIMESTAMPTZ | Última verificação | NULL |
| `is_active` | BOOLEAN | Status ativo/inativo | DEFAULT true |

**Alcances:**
- `pequena`: < 10.000 posts
- `media`: 10.000 - 50.000 posts
- `grande`: > 50.000 posts

**Relacionamentos:**
- `procedimento_id` → `procedimentos(id)`

---

## 📦 TABELA: hashtag_combos

Combos prontos de hashtags otimizadas.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | UUID | Identificador único | PRIMARY KEY |
| `nome` | VARCHAR | Nome do combo | NOT NULL |
| `descricao` | TEXT | Descrição do combo | NULL |
| `hashtags` | TEXT[] | Array de hashtags | NOT NULL |
| `procedimento_id` | UUID | FK para procedimentos | NULL |
| `objetivo_id` | UUID | FK para objetivos | NULL |
| `total_hashtags` | INTEGER | Quantidade de hashtags | NOT NULL |
| `vezes_usado` | INTEGER | Contador de uso | DEFAULT 0 |
| `is_active` | BOOLEAN | Status ativo/inativo | DEFAULT true |

**Relacionamentos:**
- `procedimento_id` → `procedimentos(id)`
- `objetivo_id` → `objetivos(id)`

---

## 📋 TABELA: roteiros

Roteiros/templates estruturados por formato.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | UUID | Identificador único | PRIMARY KEY |
| `nome` | VARCHAR | Nome do roteiro | NOT NULL |
| `descricao` | TEXT | Descrição | NULL |
| `formato_code` | VARCHAR | Código do formato | NOT NULL |
| `estrutura` | JSONB | Estrutura em JSON | NOT NULL |
| `exemplo` | TEXT | Exemplo de aplicação | NULL |
| `quando_usar` | TEXT | Orientação de uso | NULL |
| `vezes_usado` | INTEGER | Contador de uso | DEFAULT 0 |
| `is_active` | BOOLEAN | Status ativo/inativo | DEFAULT true |

**Estrutura JSON exemplo:**
```json
{
  "partes": ["gancho", "desenvolvimento", "cta"]
}
```

---

## ✅ TABELA: checklist_items

Itens de checklist para produção de conteúdo.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | UUID | Identificador único | PRIMARY KEY |
| `titulo` | VARCHAR | Título do item | NOT NULL |
| `descricao` | TEXT | Descrição detalhada | NULL |
| `formato` | VARCHAR | Formato aplicável | NOT NULL |
| `fase` | ENUM | pre_producao, gravacao, edicao, publicacao, pos_publicacao | NOT NULL |
| `ordem` | INTEGER | Ordem de execução | NOT NULL |
| `obrigatorio` | BOOLEAN | Se é obrigatório | DEFAULT true |
| `dica` | TEXT | Dica/observação | NULL |
| `is_active` | BOOLEAN | Status ativo/inativo | DEFAULT true |
| `created_at` | TIMESTAMPTZ | Data de criação | DEFAULT NOW() |

**Fases do checklist:**
1. `pre_producao`: Planejamento
2. `gravacao`: Captura de conteúdo
3. `edicao`: Edição e pós-produção
4. `publicacao`: Publicação
5. `pos_publicacao`: Acompanhamento

---

## 🔧 TABELA: protocols

Protocolos de procedimentos estéticos.

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | UUID | Identificador único | PRIMARY KEY |
| `code` | VARCHAR | Código do protocolo | UNIQUE, NOT NULL |
| `name` | VARCHAR | Nome do protocolo | NOT NULL |
| `description` | TEXT | Descrição | NULL |
| `category` | VARCHAR | Categoria | NOT NULL |
| `isactive` | BOOLEAN | Status ativo/inativo | DEFAULT true |
| `createdat` | TIMESTAMPTZ | Data de criação | DEFAULT NOW() |
| `updatedat` | TIMESTAMPTZ | Última atualização | DEFAULT NOW() |

---

## 📊 ESTATÍSTICAS DO BANCO

### Contagem Estimada de Registros

| Tabela | Estimativa | Status |
|--------|------------|--------|
| objetivos | ~10 | ✅ Populado |
| formatos | ~4 | ✅ Populado |
| procedimentos | ~20-30 | ✅ Populado |
| horarios | ~12-15 | ✅ Populado |
| ideias | ~100+ | ✅ Populado |
| ganchos | ~50+ | ✅ Populado |
| legendas | ~100+ | ✅ Populado |
| ctas | ~50+ | ✅ Populado |
| hashtags | ~200+ | ✅ Populado |
| hashtag_combos | ~30+ | ✅ Populado |
| roteiros | ~20+ | ✅ Populado |
| protocols | ~20+ | ✅ Populado |
| checklist_items | A criar | ⚠️ Pendente |

---

## 🔗 DIAGRAMA DE RELACIONAMENTOS

```
objetivos ──┬─── ideias
            ├─── ganchos
            ├─── ctas
            └─── hashtag_combos

formatos ───┬─── ganchos
            ├─── ctas
            └─── roteiros

procedimentos ──┬─── ideias
                ├─── ganchos
                ├─── legendas
                ├─── hashtags
                └─── hashtag_combos
```

---

## 🔐 SEGURANÇA E ACESSO

### Row Level Security (RLS)

- **Status:** Ativado em todas as tabelas
- **Políticas:** Leitura pública para dados ativos
- **Restrições:** Escrita apenas para usuários autenticados

### Índices

Índices criados em:
- `code` (objetivos, formatos, procedimentos)
- `is_active` (todas as tabelas)
- Foreign keys (todos os relacionamentos)
- `tipo`, `categoria` (tabelas de conteúdo)

---

## 📝 OBSERVAÇÕES IMPORTANTES

### Campos Comuns

Todas as tabelas de conteúdo possuem:
- ✅ `is_active` - Controle de soft delete
- ✅ `created_at` - Timestamp de criação
- ✅ `vezes_usado` - Métricas de uso
- ✅ `performance_media` - Análise de performance

### Convenções

- **IDs:** Sempre UUID v4
- **Timestamps:** Sempre com timezone (TIMESTAMPTZ)
- **Soft Delete:** Usar `is_active = false` ao invés de DELETE
- **Arrays:** Usar tipo TEXT[] do PostgreSQL
- **JSON:** Usar JSONB para melhor performance

### Próximas Melhorias

- [ ] Adicionar tabela `postpack_checklist` para tracking
- [ ] Implementar tabela de analytics
- [ ] Criar views materializadas para queries complexas
- [ ] Adicionar tabela de histórico de uso

---

**Documentado por:** Dashboard Orquestrador
**Versão:** 1.0
**Data:** 2026-01-11
