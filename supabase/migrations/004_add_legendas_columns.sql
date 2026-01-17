-- =====================================================
-- MIGRATION 004: Adicionar colunas faltantes na tabela legendas
-- =====================================================
-- Descrição: Adiciona tipo_legenda, tipo_post e procedimento
-- Data: 2026-01-17
-- Autor: Claude Code Fix
-- =====================================================

-- Adicionar coluna tipo_legenda (diferencia entre 'legenda' e 'gancho')
ALTER TABLE legendas
ADD COLUMN IF NOT EXISTS tipo_legenda VARCHAR(50) DEFAULT 'legenda';

-- Adicionar coluna tipo_post (tipo de post: reel, carrossel, story, etc)
ALTER TABLE legendas
ADD COLUMN IF NOT EXISTS tipo_post VARCHAR(50);

-- Adicionar coluna procedimento (procedimento/etapa associada)
ALTER TABLE legendas
ADD COLUMN IF NOT EXISTS procedimento VARCHAR(255);

-- Criar índices para melhor performance nas queries
CREATE INDEX IF NOT EXISTS idx_legendas_tipo_legenda
ON legendas(tipo_legenda);

CREATE INDEX IF NOT EXISTS idx_legendas_tipo_post
ON legendas(tipo_post);

CREATE INDEX IF NOT EXISTS idx_legendas_procedimento
ON legendas(procedimento);

-- =====================================================
-- COMENTÁRIOS EXPLICATIVOS
-- =====================================================

COMMENT ON COLUMN legendas.tipo_legenda IS
'Tipo de legenda: ''legenda'' para captions padrão ou ''gancho'' para hooks/ganchos de atração. Padrão: legenda';

COMMENT ON COLUMN legendas.tipo_post IS
'Tipo de post associado: reel, carrossel, story, feed, etc. Usado para filtrar legendas por formato de conteúdo.';

COMMENT ON COLUMN legendas.procedimento IS
'Procedimento ou etapa do workflow associada. Pode ser: fase_1, fase_2, composicao, etc.';

-- =====================================================
-- VALIDAÇÃO
-- =====================================================

DO $$
BEGIN
  -- Verificar coluna tipo_legenda
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'legendas'
    AND column_name = 'tipo_legenda'
  ) THEN
    RAISE NOTICE '✅ Coluna tipo_legenda criada com sucesso!';
  ELSE
    RAISE EXCEPTION '❌ Erro: Coluna tipo_legenda não foi criada';
  END IF;

  -- Verificar coluna tipo_post
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'legendas'
    AND column_name = 'tipo_post'
  ) THEN
    RAISE NOTICE '✅ Coluna tipo_post criada com sucesso!';
  ELSE
    RAISE EXCEPTION '❌ Erro: Coluna tipo_post não foi criada';
  END IF;

  -- Verificar coluna procedimento
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'legendas'
    AND column_name = 'procedimento'
  ) THEN
    RAISE NOTICE '✅ Coluna procedimento criada com sucesso!';
  ELSE
    RAISE EXCEPTION '❌ Erro: Coluna procedimento não foi criada';
  END IF;
END $$;

-- =====================================================
-- ROLLBACK (se necessário)
-- =====================================================

-- Para reverter esta migration, execute:
-- DROP INDEX IF EXISTS idx_legendas_tipo_legenda;
-- DROP INDEX IF EXISTS idx_legendas_tipo_post;
-- DROP INDEX IF EXISTS idx_legendas_procedimento;
-- ALTER TABLE legendas DROP COLUMN IF EXISTS tipo_legenda;
-- ALTER TABLE legendas DROP COLUMN IF EXISTS tipo_post;
-- ALTER TABLE legendas DROP COLUMN IF EXISTS procedimento;

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================
