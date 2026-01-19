-- =====================================================
-- MIGRATION 005: Fix legendas and ganchos tables
-- Daily Prophet - Instituto Rodovansky
-- Date: 2026-01-19
-- =====================================================

-- 1. Adicionar coluna tipo_legenda se não existir
ALTER TABLE legendas
ADD COLUMN IF NOT EXISTS tipo_legenda TEXT DEFAULT 'legenda';

-- 2. Adicionar coluna tipo_post se não existir
ALTER TABLE legendas
ADD COLUMN IF NOT EXISTS tipo_post TEXT;

-- 3. Adicionar coluna procedimento se não existir
ALTER TABLE legendas
ADD COLUMN IF NOT EXISTS procedimento TEXT;

-- 4. Criar tabela ganchos se não existir (para queries de ganchos)
CREATE TABLE IF NOT EXISTS ganchos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    texto TEXT NOT NULL,
    tipo_legenda TEXT DEFAULT 'gancho',
    tipo_post TEXT,
    procedimento TEXT,
    pilar TEXT,
    objetivo TEXT,
    ativo BOOLEAN DEFAULT true,
    uso_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Criar índices para performance em legendas
CREATE INDEX IF NOT EXISTS idx_legendas_tipo_legenda
ON legendas(tipo_legenda);

CREATE INDEX IF NOT EXISTS idx_legendas_tipo_post
ON legendas(tipo_post);

CREATE INDEX IF NOT EXISTS idx_legendas_procedimento
ON legendas(procedimento);

CREATE INDEX IF NOT EXISTS idx_legendas_created_at
ON legendas(created_at DESC);

-- 6. Criar índices para performance em ganchos
CREATE INDEX IF NOT EXISTS idx_ganchos_tipo_legenda
ON ganchos(tipo_legenda);

CREATE INDEX IF NOT EXISTS idx_ganchos_tipo_post
ON ganchos(tipo_post);

CREATE INDEX IF NOT EXISTS idx_ganchos_procedimento
ON ganchos(procedimento);

CREATE INDEX IF NOT EXISTS idx_ganchos_created_at
ON ganchos(created_at DESC);

-- 7. Popular legenda com dados iniciais se tabela vazia
INSERT INTO legendas (texto, tipo_legenda, tipo_post, procedimento)
SELECT 'Dica de produtividade', 'legenda', 'reel', 'fase_1'
WHERE NOT EXISTS (SELECT 1 FROM legendas LIMIT 1)
ON CONFLICT DO NOTHING;

-- 8. Popular ganchos com dados iniciais se tabela vazia
INSERT INTO ganchos (texto, tipo_legenda, tipo_post, procedimento, pilar, objetivo)
SELECT
    'Você sabia que 90% das pessoas fazem isso errado?',
    'gancho',
    'reel',
    'composicao',
    'geral',
    'autoridade'
WHERE NOT EXISTS (SELECT 1 FROM ganchos LIMIT 1)
ON CONFLICT DO NOTHING;

INSERT INTO ganchos (texto, tipo_legenda, tipo_post, procedimento, pilar, objetivo)
SELECT
    '3 erros que você comete diariamente...',
    'gancho',
    'carrossel',
    'composicao',
    'geral',
    'educativo'
WHERE (SELECT COUNT(*) FROM ganchos) < 2
ON CONFLICT DO NOTHING;

-- 9. Validação
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'legendas' AND column_name = 'tipo_legenda'
    ) THEN
        RAISE NOTICE 'OK: Coluna tipo_legenda adicionada a legendas';
    ELSE
        RAISE WARNING 'ERRO: Coluna tipo_legenda nao foi adicionada';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'ganchos'
    ) THEN
        RAISE NOTICE 'OK: Tabela ganchos criada/validada';
    ELSE
        RAISE WARNING 'ERRO: Tabela ganchos nao foi criada';
    END IF;
END $$;

-- =====================================================
-- FIM DA MIGRATION 005
-- =====================================================
