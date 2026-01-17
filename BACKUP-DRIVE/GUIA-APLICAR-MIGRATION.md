# 🗄️ GUIA: Aplicar Migration Composicao no Supabase

## 📋 O QUE FAZ ESSA MIGRATION?

A migration `003_add_composicao_field.sql` adiciona:
- ✅ Campo `composicao` (JSONB) na tabela `postpack_workflows`
- ✅ Índice GIN para queries rápidas
- ✅ Comentários e documentação
- ✅ Exemplos de uso

---

## 🚀 OPÇÃO 1: Via Supabase Dashboard (RECOMENDADO)

### Passo a passo:

1. **Acesse o Supabase Dashboard:**
   - https://app.supabase.com
   - Selecione seu projeto: `daily-prophet-gamified`

2. **Abra o SQL Editor:**
   - Menu lateral: `SQL Editor`
   - Clique em `+ New query`

3. **Cole o conteúdo da migration:**
   - Abra o arquivo: `supabase/migrations/003_add_composicao_field.sql`
   - Copie TODO o conteúdo (Ctrl+A, Ctrl+C)
   - Cole no SQL Editor

4. **Execute a migration:**
   - Clique em `Run` (ou F5)
   - Aguarde mensagem de sucesso

5. **Verifique os logs:**
   - Você deve ver:
     ```
     ✅ Coluna composicao criada com sucesso!
     ✅ Índice idx_postpack_workflows_composicao criado com sucesso!
     ```

---

## 🖥️ OPÇÃO 2: Via Supabase CLI

```bash
# 1. Entrar no diretório do projeto
cd C:/Users/lucas/Desktop/09_DAILY_PROPHET/daily-prophet-gamified

# 2. Verificar conexão com Supabase
supabase status

# 3. Aplicar migration
supabase db push

# OU aplicar migration específica
supabase migration up 003_add_composicao_field
```

---

## ✅ VALIDAÇÃO

Após aplicar a migration, valide com estas queries:

### 1. Verificar se coluna existe:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'postpack_workflows'
  AND column_name = 'composicao';
```

**Resultado esperado:**
```
column_name | data_type | is_nullable
------------|-----------|-------------
composicao  | jsonb     | YES
```

### 2. Verificar índice:
```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'postpack_workflows'
  AND indexname = 'idx_postpack_workflows_composicao';
```

**Resultado esperado:**
```
indexname                            | indexdef
-------------------------------------|--------------------------------------------------
idx_postpack_workflows_composicao    | CREATE INDEX ... USING gin (composicao)
```

### 3. Testar inserção de dados:
```sql
-- Criar workflow de teste
INSERT INTO postpack_workflows (
  id,
  postpack_id,
  status,
  composicao
) VALUES (
  gen_random_uuid(),
  'postpack-id-existente',
  'composicao',
  '{
    "reels": {
      "montarScript": true,
      "script": "Teste de script"
    }
  }'::jsonb
)
RETURNING id, composicao;
```

### 4. Testar query JSONB:
```sql
-- Buscar workflows com reels
SELECT
  id,
  composicao->'reels'->>'montarScript' as montar_script,
  composicao->'reels'->>'script' as script
FROM postpack_workflows
WHERE composicao ? 'reels'
LIMIT 5;
```

---

## 🔧 TROUBLESHOOTING

### Erro: "column already exists"
**Solução:** A coluna já existe, pode ignorar ou executar:
```sql
ALTER TABLE postpack_workflows
DROP COLUMN IF EXISTS composicao CASCADE;
-- Depois execute a migration novamente
```

### Erro: "permission denied"
**Solução:** Verifique se você está logado como admin no Supabase:
- Dashboard > Settings > Database > Connection string
- Certifique-se de usar a role `postgres`

### Erro: "index already exists"
**Solução:** O índice já existe, pode ignorar ou executar:
```sql
DROP INDEX IF EXISTS idx_postpack_workflows_composicao;
-- Depois execute a migration novamente
```

---

## 📊 QUERIES ÚTEIS PÓS-MIGRATION

### Ver todos workflows com composição:
```sql
SELECT
  id,
  status,
  composicao,
  created_at
FROM postpack_workflows
WHERE composicao IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
```

### Estatísticas por tipo de composição:
```sql
SELECT
  COUNT(*) FILTER (WHERE composicao ? 'reels') as total_reels,
  COUNT(*) FILTER (WHERE composicao ? 'carrossel') as total_carrossel,
  COUNT(*) FILTER (WHERE composicao ? 'stories') as total_stories,
  COUNT(*) FILTER (WHERE composicao IS NULL) as sem_composicao
FROM postpack_workflows;
```

### Workflows que escolheram montar script:
```sql
SELECT
  id,
  composicao->'reels'->>'montarScript' as montou_script
FROM postpack_workflows
WHERE composicao->'reels'->>'montarScript' = 'true';
```

### Temas mais usados em carrosséis:
```sql
SELECT
  composicao->'carrossel'->>'tema' as tema,
  COUNT(*) as total
FROM postpack_workflows
WHERE composicao ? 'carrossel'
GROUP BY composicao->'carrossel'->>'tema'
ORDER BY total DESC;
```

---

## 🔄 ROLLBACK (SE NECESSÁRIO)

Se precisar reverter a migration:

```sql
-- Remover índice
DROP INDEX IF EXISTS idx_postpack_workflows_composicao;

-- Remover coluna
ALTER TABLE postpack_workflows
DROP COLUMN IF EXISTS composicao;

-- Verificar
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'postpack_workflows'
  AND column_name = 'composicao';
-- Deve retornar vazio
```

---

## 🎯 PRÓXIMOS PASSOS

Após aplicar a migration:

1. ✅ Testar aplicação em produção
2. ✅ Criar workflow novo
3. ✅ Navegar para /composicao
4. ✅ Preencher dados
5. ✅ Verificar se salvou no Supabase:
   ```sql
   SELECT id, composicao
   FROM postpack_workflows
   ORDER BY created_at DESC
   LIMIT 1;
   ```

---

## 📞 SUPORTE

**Problemas ao aplicar?**
- Documentação Supabase: https://supabase.com/docs/guides/database/migrations
- Discord Supabase: https://discord.supabase.com

---

**Boa sorte! 🚀**
