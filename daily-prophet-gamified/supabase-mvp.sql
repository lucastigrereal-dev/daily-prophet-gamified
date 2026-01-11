-- ==========================================
-- DAILY PROPHET - SCHEMA MVP SIMPLIFICADO
-- ABA 2: DATABASE & SUPABASE
-- SEM AUTENTICAÇÃO - RLS PÚBLICO
-- ==========================================

-- Limpar tabelas existentes
DROP TABLE IF EXISTS postpack_workflow CASCADE;
DROP TABLE IF EXISTS postpacks CASCADE;

-- ==========================================
-- TABELA: postpacks
-- ==========================================
CREATE TABLE postpacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  objective TEXT NOT NULL,
  format TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  content JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- TABELA: postpack_workflow (SIMPLIFICADA)
-- ==========================================
CREATE TABLE postpack_workflow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  postpack_id UUID REFERENCES postpacks(id) ON DELETE CASCADE,

  -- Fase 1: Criação
  fase_1_checklist JSONB DEFAULT '{}'::jsonb,

  -- Fase 3: Produção
  fase_3_checklist JSONB DEFAULT '{}'::jsonb,

  -- Fase 4: Revisão
  fase_4_checklist JSONB DEFAULT '{}'::jsonb,

  -- Fase 5: Publicação
  fase_5_checklist JSONB DEFAULT '{}'::jsonb,
  fase_5_metricas JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- RLS: POLÍTICAS PÚBLICAS
-- ==========================================

-- Habilitar RLS
ALTER TABLE postpacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE postpack_workflow ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (acesso total sem autenticação)
CREATE POLICY "public_access_postpacks" ON postpacks
  FOR ALL USING (true);

CREATE POLICY "public_access_workflow" ON postpack_workflow
  FOR ALL USING (true);

-- ==========================================
-- TRIGGERS: Updated_at automático
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_postpacks_updated_at
  BEFORE UPDATE ON postpacks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_updated_at
  BEFORE UPDATE ON postpack_workflow
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- SEEDS: 5 Postpacks Iniciais
-- ==========================================

INSERT INTO postpacks (title, objective, format, content) VALUES
  ('Dicas de Produtividade para Criadores', 'Engajamento', 'Carrossel', '{"description": "5 dicas rápidas para otimizar sua rotina de criação de conteúdo"}'),
  ('Lançamento: Novo Produto Digital', 'Conversão', 'Reels', '{"description": "Vídeo promocional do novo curso online"}'),
  ('Behind the Scenes: Rotina', 'Branding', 'Stories', '{"description": "Bastidores do dia a dia de criação"}'),
  ('Tutorial: Setup Minimalista', 'Educação', 'Carrossel', '{"description": "Passo a passo para montar um home office produtivo"}'),
  ('Case de Sucesso', 'Credibilidade', 'Reels', '{"description": "Depoimento de cliente sobre resultados obtidos"}');

-- ==========================================
-- VERIFICAÇÃO
-- ==========================================

-- Verificar postpacks criados
SELECT
  id,
  title,
  objective,
  format,
  status,
  created_at
FROM postpacks
ORDER BY created_at DESC;
