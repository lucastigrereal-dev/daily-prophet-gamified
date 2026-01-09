-- Tabela de PostPacks (conteudo Instagram)
CREATE TABLE IF NOT EXISTS postpacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  objective TEXT,
  format TEXT,
  status TEXT DEFAULT 'draft',
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Workflows
CREATE TABLE IF NOT EXISTS postpack_workflow (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  postpack_id UUID REFERENCES postpacks(id),
  status TEXT DEFAULT 'fase_1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_by TEXT,
  approved_by TEXT,

  -- Fase 1: Criacao
  fase_1_status TEXT DEFAULT 'pendente',
  fase_1_completed_at TIMESTAMPTZ,
  fase_1_checklist JSONB DEFAULT '{}',

  -- Fase 2: Aprovacao
  fase_2_status TEXT DEFAULT 'pendente',
  fase_2_completed_at TIMESTAMPTZ,
  fase_2_checklist JSONB DEFAULT '{}',
  fase_2_feedback TEXT,

  -- Fase 3: Producao
  fase_3_status TEXT DEFAULT 'pendente',
  fase_3_completed_at TIMESTAMPTZ,
  fase_3_checklist JSONB DEFAULT '{}',

  -- Fase 4: Publicacao
  fase_4_status TEXT DEFAULT 'pendente',
  fase_4_completed_at TIMESTAMPTZ,
  fase_4_checklist JSONB DEFAULT '{}',
  fase_4_published_url TEXT,
  fase_4_published_at TIMESTAMPTZ,

  -- Fase 5: Pos-Post
  fase_5_status TEXT DEFAULT 'pendente',
  fase_5_completed_at TIMESTAMPTZ,
  fase_5_checklist JSONB DEFAULT '{}',

  -- Metricas
  metricas_24h JSONB,
  metricas_7d JSONB,
  notas TEXT
);

-- Dados de teste
INSERT INTO postpacks (title, objective, format, status) VALUES
  ('Dicas de Produtividade', 'Engajamento', 'Carrossel', 'draft'),
  ('Lancamento Produto X', 'Conversao', 'Reels', 'draft'),
  ('Behind the Scenes', 'Branding', 'Stories', 'pending_approval');

-- Habilitar RLS
ALTER TABLE postpacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE postpack_workflow ENABLE ROW LEVEL SECURITY;

-- Politicas publicas (para teste)
CREATE POLICY "Allow all postpacks" ON postpacks FOR ALL USING (true);
CREATE POLICY "Allow all workflows" ON postpack_workflow FOR ALL USING (true);
