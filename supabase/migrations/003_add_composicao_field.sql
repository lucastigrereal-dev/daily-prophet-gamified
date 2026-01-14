-- =====================================================
-- MIGRATION 003: Adicionar campo 'composicao'
-- =====================================================
-- Descrição: Adiciona etapa de composição antes da fase-1
-- Data: 2026-01-14
-- Autor: Coordenador ABA 1 + Time
-- =====================================================

-- Adicionar coluna composicao à tabela postpack_workflows
ALTER TABLE postpack_workflows
ADD COLUMN IF NOT EXISTS composicao JSONB;

-- Adicionar comentário explicativo
COMMENT ON COLUMN postpack_workflows.composicao IS
'Dados da etapa de composição (pré-fase-1).
Estrutura:
{
  "reels": { "montarScript": boolean, "script": string },
  "carrossel": { "tema": string, "textosGerados": string[] },
  "stories": { "estrategia": string, "exemplos": array }
}';

-- Criar índice GIN para queries eficientes em JSONB
CREATE INDEX IF NOT EXISTS idx_postpack_workflows_composicao
ON postpack_workflows USING GIN (composicao);

-- =====================================================
-- EXEMPLOS DE DADOS
-- =====================================================

-- Exemplo 1: Composição para Reels (escolheu montar script)
-- UPDATE postpack_workflows
-- SET composicao = '{
--   "reels": {
--     "montarScript": true,
--     "script": "Script gerado pela IA..."
--   }
-- }'::jsonb
-- WHERE id = 'uuid-aqui';

-- Exemplo 2: Composição para Carrossel (definiu tema)
-- UPDATE postpack_workflows
-- SET composicao = '{
--   "carrossel": {
--     "tema": "Benefícios do Pilates",
--     "textosGerados": [
--       "Card 1: Melhora a postura",
--       "Card 2: Fortalece o core",
--       "Card 3: Aumenta a flexibilidade"
--     ]
--   }
-- }'::jsonb
-- WHERE id = 'uuid-aqui';

-- Exemplo 3: Composição para Stories (escolheu estratégia)
-- UPDATE postpack_workflows
-- SET composicao = '{
--   "stories": {
--     "estrategia": "enquete",
--     "exemplos": [
--       {"pergunta": "Você pratica exercícios?", "opcoes": ["Sim", "Não"]},
--       {"pergunta": "Quantas vezes por semana?", "opcoes": ["1-2x", "3-4x", "5+"]}
--     ]
--   }
-- }'::jsonb
-- WHERE id = 'uuid-aqui';

-- =====================================================
-- QUERIES ÚTEIS
-- =====================================================

-- Buscar workflows que escolheram montar script (Reels)
-- SELECT id, composicao->'reels'->>'montarScript' as montar_script
-- FROM postpack_workflows
-- WHERE composicao->'reels'->>'montarScript' = 'true';

-- Buscar workflows por tema de carrossel
-- SELECT id, composicao->'carrossel'->>'tema' as tema
-- FROM postpack_workflows
-- WHERE composicao->>'carrossel' IS NOT NULL;

-- Buscar workflows por estratégia de stories
-- SELECT id, composicao->'stories'->>'estrategia' as estrategia
-- FROM postpack_workflows
-- WHERE composicao->'stories'->>'estrategia' IS NOT NULL;

-- Contar workflows por tipo de composição
-- SELECT
--   COUNT(*) FILTER (WHERE composicao ? 'reels') as total_reels,
--   COUNT(*) FILTER (WHERE composicao ? 'carrossel') as total_carrossel,
--   COUNT(*) FILTER (WHERE composicao ? 'stories') as total_stories
-- FROM postpack_workflows;

-- =====================================================
-- VALIDAÇÃO
-- =====================================================

-- Verificar se coluna foi criada
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'postpack_workflows'
    AND column_name = 'composicao'
  ) THEN
    RAISE NOTICE '✅ Coluna composicao criada com sucesso!';
  ELSE
    RAISE EXCEPTION '❌ Erro: Coluna composicao não foi criada';
  END IF;
END $$;

-- Verificar se índice foi criado
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE tablename = 'postpack_workflows'
    AND indexname = 'idx_postpack_workflows_composicao'
  ) THEN
    RAISE NOTICE '✅ Índice idx_postpack_workflows_composicao criado com sucesso!';
  ELSE
    RAISE NOTICE '⚠️ Aviso: Índice não foi criado (pode ser ignorado se já existir)';
  END IF;
END $$;

-- =====================================================
-- ROLLBACK (se necessário)
-- =====================================================

-- Para reverter esta migration, execute:
-- DROP INDEX IF EXISTS idx_postpack_workflows_composicao;
-- ALTER TABLE postpack_workflows DROP COLUMN IF EXISTS composicao;

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================
