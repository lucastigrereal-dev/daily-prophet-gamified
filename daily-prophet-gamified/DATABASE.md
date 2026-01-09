# 🗄️ Documentação do Banco de Dados - Daily Prophet

Documentação completa do schema PostgreSQL do Daily Prophet Gamified.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Tabela: postpacks](#tabela-postpacks)
3. [Tabela: postpack_workflow](#tabela-postpack_workflow)
4. [Relacionamentos](#relacionamentos)
5. [Campos JSONB](#campos-jsonb)
6. [Row Level Security (RLS)](#row-level-security)
7. [Queries Comuns](#queries-comuns)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O Daily Prophet usa um modelo relacional simples com PostgreSQL:

```
┌─────────────────┐
│   postpacks     │
│  (conteúdos)    │
└────────┬────────┘
         │
         │ (1:N)
         ↓
┌─────────────────────────┐
│  postpack_workflow      │
│  (workflows/processos)  │
└─────────────────────────┘
```

- **postpacks**: Armazena informações dos conteúdos
- **postpack_workflow**: Rastreia o progresso através das 5 fases

---

## 📄 Tabela: postpacks

A tabela de **conteúdos** (posts) do Instagram.

### Estrutura

```sql
CREATE TABLE postpacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  objective TEXT,
  format TEXT,
  status TEXT DEFAULT 'draft',
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Colunas

| Coluna | Tipo | Descrição | Exemplo |
|--------|------|-----------|---------|
| **id** | UUID | Identificador único | `550e8400-e29b-41d4-a716-446655440000` |
| **title** | TEXT | Título do post | `"Dicas de Produtividade"` |
| **objective** | TEXT | Objetivo da publicação | `"Engajamento"`, `"Conversão"`, `"Branding"` |
| **format** | TEXT | Formato do conteúdo | `"Carrossel"`, `"Reels"`, `"Stories"` |
| **status** | TEXT | Status atual | `"draft"`, `"in_progress"`, `"published"` |
| **content** | JSONB | Dados flexíveis do post | Ver [Campos JSONB](#campos-jsonb) |
| **created_at** | TIMESTAMPTZ | Data/hora de criação | `2025-01-09T10:30:00+00:00` |
| **updated_at** | TIMESTAMPTZ | Última atualização | `2025-01-09T14:45:00+00:00` |

### Dados de Teste

```sql
INSERT INTO postpacks (title, objective, format, status) VALUES
  ('Dicas de Produtividade', 'Engajamento', 'Carrossel', 'draft'),
  ('Lancamento Produto X', 'Conversao', 'Reels', 'draft'),
  ('Behind the Scenes', 'Branding', 'Stories', 'pending_approval');
```

---

## 📊 Tabela: postpack_workflow

Rastreia o **progresso dos workflows** através das 5 fases.

### Estrutura Completa

```sql
CREATE TABLE postpack_workflow (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  postpack_id UUID REFERENCES postpacks(id),
  status TEXT DEFAULT 'fase_1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_by TEXT,
  approved_by TEXT,

  -- Fase 1: Criação
  fase_1_status TEXT DEFAULT 'pendente',
  fase_1_completed_at TIMESTAMPTZ,
  fase_1_checklist JSONB DEFAULT '{}',

  -- Fase 2: Aprovação
  fase_2_status TEXT DEFAULT 'pendente',
  fase_2_completed_at TIMESTAMPTZ,
  fase_2_checklist JSONB DEFAULT '{}',
  fase_2_feedback TEXT,

  -- Fase 3: Produção
  fase_3_status TEXT DEFAULT 'pendente',
  fase_3_completed_at TIMESTAMPTZ,
  fase_3_checklist JSONB DEFAULT '{}',

  -- Fase 4: Publicação
  fase_4_status TEXT DEFAULT 'pendente',
  fase_4_completed_at TIMESTAMPTZ,
  fase_4_checklist JSONB DEFAULT '{}',
  fase_4_published_url TEXT,
  fase_4_published_at TIMESTAMPTZ,

  -- Fase 5: Pós-Post
  fase_5_status TEXT DEFAULT 'pendente',
  fase_5_completed_at TIMESTAMPTZ,
  fase_5_checklist JSONB DEFAULT '{}',

  -- Métricas
  metricas_24h JSONB,
  metricas_7d JSONB,
  notas TEXT
);
```

### Colunas Principais

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| **id** | UUID | Identificador único do workflow |
| **postpack_id** | UUID | Referência ao post (foreign key) |
| **status** | TEXT | Fase atual: `fase_1`, `fase_2`, `fase_3`, `fase_4`, `fase_5` |
| **created_at** | TIMESTAMPTZ | Quando o workflow começou |
| **updated_at** | TIMESTAMPTZ | Última atualização |
| **completed_at** | TIMESTAMPTZ | Quando foi finalizado (NULL se em progresso) |
| **created_by** | TEXT | Usuário que criou |
| **approved_by** | TEXT | Usuário que aprovou |

### Colunas Por Fase

Cada fase tem:
- `fase_X_status`: `pendente`, `em_progresso`, `concluido`, `rejeitado`
- `fase_X_completed_at`: Timestamp de conclusão
- `fase_X_checklist`: Array de itens do checklist (JSONB)

**Exemplo de Fase 1:**
```
fase_1_status: 'concluido'
fase_1_completed_at: '2025-01-09T11:30:00+00:00'
fase_1_checklist: [
  { item: "Conceito aprovado", done: true },
  { item: "Briefing preenchido", done: true }
]
```

**Exemplo de Fase 2 (com feedback):**
```
fase_2_status: 'em_progresso'
fase_2_feedback: "Ajustar tom para mais informal"
```

**Exemplo de Fase 4 (publicado):**
```
fase_4_status: 'concluido'
fase_4_published_url: 'https://instagram.com/p/ABC123XYZ'
fase_4_published_at: '2025-01-09T14:00:00+00:00'
```

### Colunas de Métricas

```sql
-- Coletadas após publicação (Fase 5)
metricas_24h JSONB,   -- Dados após 24h
metricas_7d JSONB     -- Dados após 7 dias
```

**Exemplo de conteúdo:**
```json
{
  "impressoes": 1250,
  "alcance": 950,
  "engajamento": 125,
  "cliques": 45,
  "taxa_engajamento": 13.2,
  "salvamentos": 30,
  "compartilhamentos": 15,
  "comentarios": 20,
  "likes": 60
}
```

---

## 🔗 Relacionamentos

### Chave Estrangeira (Foreign Key)

```sql
postpack_id UUID REFERENCES postpacks(id)
```

- Cada workflow está vinculado a **exatamente um** postpack
- Um postpack pode ter **múltiplos** workflows
- Se deletar um postpack, os workflows também são deletados (cascata)

### Exemplo de Relação

```
Postpack: "Dicas de Produtividade"
├── Workflow 1: Jan/2025 (finalizado)
├── Workflow 2: Fev/2025 (em fase 3)
└── Workflow 3: Mar/2025 (acabou de iniciar)
```

---

## 📦 Campos JSONB

JSONB permite armazenar dados flexíveis sem schema rígido.

### postpacks.content

Dados opcionais do conteúdo:

```json
{
  "descricao": "Post sobre produtividade e foco",
  "hashtags": ["#produtividade", "#foco", "#trabalho"],
  "cta": "Comente sua maior distração!",
  "target_audience": "Profissionais e empreendedores",
  "tom": "Inspirador e prático",
  "imagens": ["link1.jpg", "link2.jpg"],
  "video_url": "https://..."
}
```

### Checklists (fase_X_checklist)

Array de itens com status:

```json
[
  {
    "id": "check_1",
    "item": "Conceito aprovado",
    "done": true,
    "completed_at": "2025-01-09T10:30:00+00:00"
  },
  {
    "id": "check_2",
    "item": "Briefing preenchido",
    "done": true,
    "completed_at": "2025-01-09T10:45:00+00:00"
  },
  {
    "id": "check_3",
    "item": "Revisor designado",
    "done": false,
    "completed_at": null
  }
]
```

### Métricas (metricas_24h / metricas_7d)

Dados de performance do Instagram:

```json
{
  "impressoes": 5420,
  "alcance": 4125,
  "engajamento": 580,
  "cliques": 230,
  "taxa_engajamento": 14.1,
  "salvamentos": 120,
  "compartilhamentos": 80,
  "comentarios": 180,
  "likes": 200,
  "horario_pico": "19:30",
  "dispositivo_principal": "mobile"
}
```

---

## 🔐 Row Level Security (RLS)

O Daily Prophet usa PostgreSQL RLS para proteção de dados.

### Políticas Atuais

```sql
-- Acesso público (para desenvolvimento)
CREATE POLICY "Allow all postpacks" ON postpacks FOR ALL USING (true);
CREATE POLICY "Allow all workflows" ON postpack_workflow FOR ALL USING (true);
```

### ⚠️ Para Produção

Em produção, você deve implementar políticas mais restritivas:

```sql
-- Exemplo: Apenas o criador pode ver seus posts
CREATE POLICY "Users can see own postpacks" ON postpacks
  FOR SELECT
  USING (auth.uid()::text = created_by);

-- Exemplo: Apenas certos usuários podem atualizar
CREATE POLICY "Team leads can approve" ON postpack_workflow
  FOR UPDATE
  USING (auth.uid()::text IN (SELECT id FROM team_leads));
```

---

## 🔍 Queries Comuns

### 1. Ver Todos os Posts

```sql
SELECT id, title, objective, format, status, created_at
FROM postpacks
ORDER BY created_at DESC;
```

### 2. Ver Workflows em Progresso

```sql
SELECT
  w.id,
  p.title,
  w.status,
  w.created_by,
  w.updated_at
FROM postpack_workflow w
JOIN postpacks p ON w.postpack_id = p.id
WHERE w.completed_at IS NULL
ORDER BY w.updated_at DESC;
```

### 3. Workflows Concluídos na Semana

```sql
SELECT
  p.title,
  w.status,
  w.completed_at,
  w.metricas_7d
FROM postpack_workflow w
JOIN postpacks p ON w.postpack_id = p.id
WHERE w.completed_at >= NOW() - INTERVAL '7 days'
  AND w.completed_at IS NOT NULL
ORDER BY w.completed_at DESC;
```

### 4. Posts Publicados com Métricas

```sql
SELECT
  p.title,
  w.fase_4_published_url,
  w.metricas_24h->>'impressoes' as impressoes,
  w.metricas_24h->>'taxa_engajamento' as taxa_engajamento,
  w.metricas_7d->>'likes' as likes_7d
FROM postpack_workflow w
JOIN postpacks p ON w.postpack_id = p.id
WHERE w.fase_4_published_at IS NOT NULL
ORDER BY w.fase_4_published_at DESC;
```

### 5. Checklist Item Concluído

```sql
-- Verificar se item específico foi marcado
SELECT
  (w.fase_1_checklist @> '[{"item": "Conceito aprovado", "done": true}]')
  as conceito_aprovado
FROM postpack_workflow w
WHERE w.id = 'seu-workflow-id';
```

### 6. Atualizar Métrica

```sql
UPDATE postpack_workflow
SET metricas_24h = jsonb_set(
  metricas_24h,
  '{impressoes}',
  '5420'::jsonb
)
WHERE id = 'seu-workflow-id';
```

### 7. Adicionar Item ao Checklist

```sql
UPDATE postpack_workflow
SET fase_1_checklist = fase_1_checklist || jsonb_build_array(
  jsonb_build_object(
    'id', 'check_novo',
    'item', 'Novo item',
    'done', false
  )
)
WHERE id = 'seu-workflow-id';
```

---

## 📊 Estatísticas Úteis

### Performance de Posts

```sql
-- Top 10 posts por impressões
SELECT
  p.title,
  (w.metricas_7d->>'impressoes')::INT as impressoes,
  (w.metricas_7d->>'taxa_engajamento')::FLOAT as engajamento
FROM postpack_workflow w
JOIN postpacks p ON w.postpack_id = p.id
WHERE w.metricas_7d IS NOT NULL
ORDER BY (w.metricas_7d->>'impressoes')::INT DESC
LIMIT 10;
```

### Distribuição por Formato

```sql
SELECT
  p.format,
  COUNT(*) as total,
  AVG((w.metricas_7d->>'taxa_engajamento')::FLOAT) as eng_media
FROM postpack_workflow w
JOIN postpacks p ON w.postpack_id = p.id
GROUP BY p.format
ORDER BY total DESC;
```

### Tempo Médio por Fase

```sql
SELECT
  'Fase 1' as fase,
  AVG(EXTRACT(EPOCH FROM (fase_1_completed_at - created_at))/3600)::INT as horas_media
FROM postpack_workflow
WHERE fase_1_completed_at IS NOT NULL
UNION ALL
SELECT 'Fase 2', AVG(EXTRACT(EPOCH FROM (fase_2_completed_at - fase_1_completed_at))/3600)::INT FROM postpack_workflow WHERE fase_2_completed_at IS NOT NULL
-- ... (repetir para fase_3, fase_4, fase_5)
ORDER BY 1;
```

---

## 🗑️ Operações Administrativas

### Backup do Banco

**Via Supabase Dashboard:**
1. Settings → Database → Backups
2. Clique em "Save a Manual Backup"
3. Aguarde 5-10 minutos

**Via CLI:**
```bash
supabase db pull  # Salva schema em migrations/
```

### Restaurar de Backup

1. Acesse Supabase Dashboard
2. Settings → Database → Backups
3. Clique em "Restore" no backup desejado
4. Confirme (⚠️ irá sobrescrever dados atuais!)

### Limpar Dados de Teste

```sql
-- Delete todos os workflows
DELETE FROM postpack_workflow;

-- Delete todos os posts
DELETE FROM postpacks;
```

---

## 🆘 Troubleshooting

### Erro: "permission denied for schema public"

**Causa**: Permissões de RLS muito restritivas

**Solução**:
```sql
-- Verificar políticas
SELECT * FROM pg_policies;

-- Se necessário, permitir tudo temporariamente
DROP POLICY IF EXISTS "Allow all postpacks" ON postpacks;
CREATE POLICY "Allow all postpacks" ON postpacks FOR ALL USING (true);
```

### Erro: "foreign key violation"

**Causa**: Tentou criar workflow com postpack_id inválido

**Solução**:
```sql
-- Verificar postpacks disponíveis
SELECT id, title FROM postpacks;

-- Usar um id válido
INSERT INTO postpack_workflow (postpack_id, ...)
VALUES ('id-valido', ...);
```

### Dados JSONB não aparecem

**Causa**: Campo JSONB pode ser NULL ou vazio

**Solução**:
```sql
-- Verificar valor
SELECT fase_1_checklist FROM postpack_workflow WHERE id = 'seu-id';

-- Se NULL ou '{}', inicializar:
UPDATE postpack_workflow
SET fase_1_checklist = '[]'::jsonb
WHERE fase_1_checklist IS NULL;
```

### Slow Query

**Solução**: Adicionar índices

```sql
-- Índices para queries comuns
CREATE INDEX idx_workflow_postpack ON postpack_workflow(postpack_id);
CREATE INDEX idx_workflow_status ON postpack_workflow(status);
CREATE INDEX idx_workflow_created ON postpack_workflow(created_at DESC);
CREATE INDEX idx_postpack_status ON postpacks(status);
```

---

## 📚 Referências

- [PostgreSQL JSONB Docs](https://www.postgresql.org/docs/current/datatype-json.html)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Database Guide](https://supabase.com/docs/guides/database)

---

**Última atualização**: Janeiro 2025
