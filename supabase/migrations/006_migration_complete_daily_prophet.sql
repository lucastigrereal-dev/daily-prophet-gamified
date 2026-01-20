-- =====================================================
-- MIGRATION 006: MIGRAÇÃO COMPLETA - DAILY PROPHET
-- Instituto Rodovansky
-- Data: 2026-01-19
-- 
-- OBJETIVO: 
-- 1. Migrar dados de `components` → tabelas separadas
-- 2. Importar conteúdo adicional dos arquivos JSON/CSV
-- =====================================================

-- =====================================================
-- PARTE 1: CRIAR/VALIDAR TABELAS SEPARADAS
-- =====================================================

-- 1.1 TABELA CTAs
CREATE TABLE IF NOT EXISTS ctas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    texto TEXT NOT NULL,
    categoria TEXT,                       -- 'Salvamento', 'Comentário', 'Compartilhamento', etc
    tipo_post TEXT,                       -- 'reel', 'carrossel', 'stories'
    pilar TEXT,                           -- 'intimax', 'fullface', 'gluteos', 'geral'
    objetivo TEXT,                        -- 'autoridade', 'engajamento', 'conversao'
    procedimento TEXT,
    observacao TEXT,
    ativo BOOLEAN DEFAULT true,
    uso_count INTEGER DEFAULT 0,
    source_file TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 TABELA HASHTAGS
CREATE TABLE IF NOT EXISTS hashtags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    texto TEXT NOT NULL,
    tema TEXT,                            -- 'autoridade', 'procedimento', 'local', etc
    volume TEXT,                          -- '16.9M', '500k', 'trending'
    volume_numeric INTEGER,               -- Para ordenação numérica
    intencao TEXT,                        -- 'descoberta', 'autoridade', 'comunidade'
    risco_compliance TEXT DEFAULT 'baixo',
    tipo_post TEXT,                       -- 'reel', 'carrossel', 'stories'
    pilar TEXT,
    objetivo TEXT,
    justificativa TEXT,
    ativo BOOLEAN DEFAULT true,
    source_file TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3 TABELA GANCHOS (já criada na migration 005, garantir estrutura)
CREATE TABLE IF NOT EXISTS ganchos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    texto TEXT NOT NULL,
    tipo_legenda TEXT DEFAULT 'gancho',
    tipo_gancho TEXT,                     -- 'curiosidade', 'mito', 'transformacao', etc
    tipo_post TEXT,                       -- 'reel', 'carrossel', 'stories'
    procedimento TEXT,
    pilar TEXT,
    objetivo TEXT,
    observacao TEXT,
    ativo BOOLEAN DEFAULT true,
    uso_count INTEGER DEFAULT 0,
    source_file TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.4 TABELA LEGENDAS (garantir estrutura completa)
ALTER TABLE legendas ADD COLUMN IF NOT EXISTS tipo_legenda TEXT DEFAULT 'legenda';
ALTER TABLE legendas ADD COLUMN IF NOT EXISTS tipo_post TEXT;
ALTER TABLE legendas ADD COLUMN IF NOT EXISTS procedimento TEXT;
ALTER TABLE legendas ADD COLUMN IF NOT EXISTS pilar TEXT;
ALTER TABLE legendas ADD COLUMN IF NOT EXISTS objetivo TEXT;
ALTER TABLE legendas ADD COLUMN IF NOT EXISTS observacao TEXT;
ALTER TABLE legendas ADD COLUMN IF NOT EXISTS uso_count INTEGER DEFAULT 0;
ALTER TABLE legendas ADD COLUMN IF NOT EXISTS source_file TEXT;

-- =====================================================
-- PARTE 2: CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

-- CTAs
CREATE INDEX IF NOT EXISTS idx_ctas_categoria ON ctas(categoria);
CREATE INDEX IF NOT EXISTS idx_ctas_tipo_post ON ctas(tipo_post);
CREATE INDEX IF NOT EXISTS idx_ctas_pilar ON ctas(pilar);
CREATE INDEX IF NOT EXISTS idx_ctas_objetivo ON ctas(objetivo);
CREATE INDEX IF NOT EXISTS idx_ctas_ativo ON ctas(ativo);
CREATE INDEX IF NOT EXISTS idx_ctas_texto_search ON ctas USING GIN(to_tsvector('portuguese', texto));

-- Hashtags
CREATE INDEX IF NOT EXISTS idx_hashtags_tema ON hashtags(tema);
CREATE INDEX IF NOT EXISTS idx_hashtags_tipo_post ON hashtags(tipo_post);
CREATE INDEX IF NOT EXISTS idx_hashtags_pilar ON hashtags(pilar);
CREATE INDEX IF NOT EXISTS idx_hashtags_volume_numeric ON hashtags(volume_numeric DESC);
CREATE INDEX IF NOT EXISTS idx_hashtags_ativo ON hashtags(ativo);
CREATE INDEX IF NOT EXISTS idx_hashtags_texto_search ON hashtags USING GIN(to_tsvector('portuguese', texto));

-- Ganchos
CREATE INDEX IF NOT EXISTS idx_ganchos_tipo_gancho ON ganchos(tipo_gancho);
CREATE INDEX IF NOT EXISTS idx_ganchos_tipo_post ON ganchos(tipo_post);
CREATE INDEX IF NOT EXISTS idx_ganchos_pilar ON ganchos(pilar);
CREATE INDEX IF NOT EXISTS idx_ganchos_objetivo ON ganchos(objetivo);
CREATE INDEX IF NOT EXISTS idx_ganchos_ativo ON ganchos(ativo);
CREATE INDEX IF NOT EXISTS idx_ganchos_uso_count ON ganchos(uso_count DESC);
CREATE INDEX IF NOT EXISTS idx_ganchos_texto_search ON ganchos USING GIN(to_tsvector('portuguese', texto));

-- =====================================================
-- PARTE 3: MIGRAR DADOS DE COMPONENTS → TABELAS SEPARADAS
-- =====================================================

-- 3.1 Migrar CTAs de components
INSERT INTO ctas (texto, categoria, tipo_post, pilar, objetivo, observacao, ativo, source_file)
SELECT 
    text AS texto,
    category AS categoria,
    LOWER(format) AS tipo_post,
    LOWER(pillar) AS pilar,
    LOWER(objective) AS objetivo,
    notes AS observacao,
    CASE WHEN status = 'active' THEN true ELSE false END AS ativo,
    source_file
FROM components 
WHERE type = 'cta'
AND NOT EXISTS (
    SELECT 1 FROM ctas WHERE ctas.texto = components.text
)
ON CONFLICT DO NOTHING;

-- 3.2 Migrar Hashtags de components
INSERT INTO hashtags (texto, tema, volume, tipo_post, pilar, objetivo, intencao, justificativa, ativo, source_file)
SELECT 
    text AS texto,
    category AS tema,
    volume,
    LOWER(format) AS tipo_post,
    LOWER(pillar) AS pilar,
    LOWER(objective) AS objetivo,
    intent AS intencao,
    justification AS justificativa,
    CASE WHEN status = 'active' THEN true ELSE false END AS ativo,
    source_file
FROM components 
WHERE type = 'hashtag'
AND NOT EXISTS (
    SELECT 1 FROM hashtags WHERE hashtags.texto = components.text
)
ON CONFLICT DO NOTHING;

-- 3.3 Migrar Ganchos de components
INSERT INTO ganchos (texto, tipo_legenda, tipo_post, pilar, objetivo, observacao, ativo, source_file)
SELECT 
    text AS texto,
    'gancho' AS tipo_legenda,
    LOWER(format) AS tipo_post,
    LOWER(pillar) AS pilar,
    LOWER(objective) AS objetivo,
    notes AS observacao,
    CASE WHEN status = 'active' THEN true ELSE false END AS ativo,
    source_file
FROM components 
WHERE type = 'gancho'
AND NOT EXISTS (
    SELECT 1 FROM ganchos WHERE ganchos.texto = components.text
)
ON CONFLICT DO NOTHING;


-- =====================================================
-- PARTE 4: IMPORTAR CTAs NOVOS (120_CTAs_Premium_Intimax.json)
-- =====================================================

-- CTAs de SALVAMENTO
INSERT INTO ctas (texto, categoria, tipo_post, pilar, objetivo, observacao, source_file) VALUES
('Salva esse post 📌 — você vai precisar depois', 'Salvamento', 'reel', 'geral', 'autoridade', 'CTA simplificado, funciona melhor em vídeos educativos. Alto volume de saves = autoridade', '120_CTAs_Premium_Intimax.json'),
('Marca esse aqui ⭐ para rever depois', 'Salvamento', 'carrossel', 'geral', 'autoridade', 'Variação para carousel com múltiplos slides educativos', '120_CTAs_Premium_Intimax.json'),
('Guarde esse conteúdo — referência importante', 'Salvamento', 'stories', 'geral', 'autoridade', 'Tom mais profissional, elegante, sem apelo visual gritante', '120_CTAs_Premium_Intimax.json'),
('Esse é o tipo de informação que você salva e volta a consultar', 'Salvamento', 'reel', 'geral', 'autoridade', 'Mais longo, conversacional, humaniza a marca', '120_CTAs_Premium_Intimax.json'),
('Coloca nos favoritos 📌 — material de consulta', 'Salvamento', 'carrossel', 'geral', 'autoridade', 'Variação casual porém profissional', '120_CTAs_Premium_Intimax.json'),
('Esse conteúdo merece estar nos seus salvos', 'Salvamento', 'reel', 'geral', 'autoridade', 'Implícito, sutil, tira o tom comercial direto', '120_CTAs_Premium_Intimax.json'),
('Verdade que você quer guardar?', 'Salvamento', 'stories', 'geral', 'autoridade', 'Pergunta retórica, engaja subconsciente', '120_CTAs_Premium_Intimax.json'),
('Material que vale voltar a ler', 'Salvamento', 'carrossel', 'geral', 'autoridade', 'Reforça autoridade educativa', '120_CTAs_Premium_Intimax.json')
ON CONFLICT DO NOTHING;

-- CTAs de ENGAJAMENTO (Comentário)
INSERT INTO ctas (texto, categoria, tipo_post, pilar, objetivo, observacao, source_file) VALUES
('Comenta aqui: já conhecia essa informação?', 'Engajamento', 'reel', 'geral', 'engajamento', 'Pergunta aberta, baixa pressão para responder, gera conversa genuína', '120_CTAs_Premium_Intimax.json'),
('Deixa sua dúvida nos comentários 👇', 'Engajamento', 'carrossel', 'geral', 'engajamento', 'Convite direto, específico (dúvida), qualifica quem comenta', '120_CTAs_Premium_Intimax.json'),
('Qual é a sua experiência? Comenta abaixo', 'Engajamento', 'stories', 'geral', 'engajamento', 'Humaniza, solicita prova social indireta', '120_CTAs_Premium_Intimax.json'),
('Isso acontece com você também? (Comenta SIM ou NÃO)', 'Engajamento', 'reel', 'geral', 'engajamento', 'Binária e direta, gera alto engajamento com baixa fricção', '120_CTAs_Premium_Intimax.json'),
('Conte aqui: qual foi sua descoberta?', 'Engajamento', 'carrossel', 'geral', 'engajamento', 'Abre espaço para story sharing, diferencia comentários genéricos', '120_CTAs_Premium_Intimax.json'),
('Debate aqui nos comentários — concordam?', 'Engajamento', 'reel', 'geral', 'engajamento', 'Cria tensão produtiva (debate), aumenta tempo na sessão', '120_CTAs_Premium_Intimax.json'),
('O que você mudaria nessa informação?', 'Engajamento', 'stories', 'geral', 'engajamento', 'Pergunta que valida opinião do seguidor, cria propriedade emocional', '120_CTAs_Premium_Intimax.json'),
('Escreve aqui se você já experimentou', 'Engajamento', 'carrossel', 'geral', 'engajamento', 'Menos diretivo que comenta, mais conversacional', '120_CTAs_Premium_Intimax.json'),
('Qual desses pontos mais afeta você? (Comenta o número)', 'Engajamento', 'reel', 'geral', 'engajamento', 'Facilita resposta com número, aumenta taxa de comentários', '120_CTAs_Premium_Intimax.json'),
('Essa informação te surpreendeu? Me conta', 'Engajamento', 'stories', 'geral', 'engajamento', 'Tom mais íntimo, stories tem alta taxa de resposta DM', '120_CTAs_Premium_Intimax.json')
ON CONFLICT DO NOTHING;

-- CTAs de COMPARTILHAMENTO
INSERT INTO ctas (texto, categoria, tipo_post, pilar, objetivo, observacao, source_file) VALUES
('Manda pra alguém que precisa saber disso', 'Compartilhamento', 'reel', 'geral', 'crescimento', 'Gatilho de utilidade social, share rate 2.3x maior', '120_CTAs_Premium_Intimax.json'),
('Marca quem deveria ver isso', 'Compartilhamento', 'carrossel', 'geral', 'crescimento', 'Direto, eficiente, gera menções que trazem novos olhos', '120_CTAs_Premium_Intimax.json'),
('Compartilha com quem está pensando sobre isso', 'Compartilhamento', 'stories', 'geral', 'crescimento', 'Contextualiza o compartilhamento, aumenta relevância', '120_CTAs_Premium_Intimax.json'),
('Esse conhecimento não pode ficar só com você', 'Compartilhamento', 'reel', 'geral', 'crescimento', 'Responsabilidade social implícita, gatilho de comunidade', '120_CTAs_Premium_Intimax.json'),
('Envia pra aquela amiga que sempre pergunta sobre isso', 'Compartilhamento', 'carrossel', 'geral', 'crescimento', 'Específico (amiga que pergunta), viraliza em grupos femininos', '120_CTAs_Premium_Intimax.json'),
('Repassa essa verdade', 'Compartilhamento', 'stories', 'geral', 'crescimento', 'Curto, assertivo, funciona bem em stories repostáveis', '120_CTAs_Premium_Intimax.json'),
('Conhece alguém que precisa ouvir isso?', 'Compartilhamento', 'reel', 'geral', 'crescimento', 'Pergunta retórica que incentiva ação', '120_CTAs_Premium_Intimax.json'),
('Isso é informação pra compartilhar com consciência', 'Compartilhamento', 'carrossel', 'geral', 'crescimento', 'Eleva o conteúdo, posiciona como premium', '120_CTAs_Premium_Intimax.json')
ON CONFLICT DO NOTHING;

-- CTAs de DM
INSERT INTO ctas (texto, categoria, tipo_post, pilar, objetivo, observacao, source_file) VALUES
('Quer saber mais? Me chama no direct', 'DM', 'reel', 'geral', 'conversao', 'Convite simples para conversão via DM', '120_CTAs_Premium_Intimax.json'),
('Manda um "QUERO" no direct e te respondo', 'DM', 'stories', 'geral', 'conversao', 'Gatilho de palavra-chave, facilita automação ManyChat', '120_CTAs_Premium_Intimax.json'),
('Dúvida específica? Direct aberto', 'DM', 'carrossel', 'geral', 'conversao', 'Posiciona disponibilidade sem ser invasivo', '120_CTAs_Premium_Intimax.json'),
('Sua história é única — me conta no privado', 'DM', 'reel', 'geral', 'conversao', 'Humaniza, cria intimidade, converte consultas', '120_CTAs_Premium_Intimax.json'),
('Quer a indicação certa? Me procura na DM', 'DM', 'stories', 'geral', 'conversao', 'Promete orientação personalizada', '120_CTAs_Premium_Intimax.json'),
('Precisa de ajuda? É só chamar', 'DM', 'carrossel', 'geral', 'conversao', 'Tom mais casual, acessível', '120_CTAs_Premium_Intimax.json'),
('Pode me mandar mensagem — adoro tirar dúvidas', 'DM', 'reel', 'geral', 'conversao', 'Dá permissão explícita, reduz barreira psicológica', '120_CTAs_Premium_Intimax.json'),
('Aqui no direct a gente conversa melhor', 'DM', 'stories', 'geral', 'conversao', 'Insinua exclusividade da conversa privada', '120_CTAs_Premium_Intimax.json')
ON CONFLICT DO NOTHING;

-- CTAs de AGENDAMENTO
INSERT INTO ctas (texto, categoria, tipo_post, pilar, objetivo, observacao, source_file) VALUES
('Quer uma avaliação personalizada? Link na bio', 'Agendamento', 'reel', 'geral', 'conversao', 'Direcionamento claro para link de agendamento', '120_CTAs_Premium_Intimax.json'),
('Agende sua consulta e tire todas as dúvidas pessoalmente', 'Agendamento', 'carrossel', 'geral', 'conversao', 'Promessa de atendimento completo na consulta', '120_CTAs_Premium_Intimax.json'),
('Vamos conversar? Agenda comigo', 'Agendamento', 'stories', 'geral', 'conversao', 'Tom casual, menos comercial', '120_CTAs_Premium_Intimax.json'),
('Seu caso merece atenção individual — agenda aqui', 'Agendamento', 'reel', 'geral', 'conversao', 'Valoriza individualidade do paciente', '120_CTAs_Premium_Intimax.json'),
('Primeira consulta sem compromisso — link na bio', 'Agendamento', 'carrossel', 'geral', 'conversao', 'Remove barreira de decisão', '120_CTAs_Premium_Intimax.json'),
('Quer entender o que é melhor pra você? Vem conversar', 'Agendamento', 'stories', 'geral', 'conversao', 'Consultivo, não vendedor', '120_CTAs_Premium_Intimax.json'),
('Clica no link e escolhe o melhor horário', 'Agendamento', 'reel', 'geral', 'conversao', 'Direto ao ponto, call to action claro', '120_CTAs_Premium_Intimax.json'),
('Agenda sua avaliação — zero pressão', 'Agendamento', 'carrossel', 'geral', 'conversao', 'Remove medo de ser pressionado na consulta', '120_CTAs_Premium_Intimax.json')
ON CONFLICT DO NOTHING;


-- CTAs de AUTORIDADE/EDUCAÇÃO
INSERT INTO ctas (texto, categoria, tipo_post, pilar, objetivo, observacao, source_file) VALUES
('Salva essa dica para aplicar hoje mesmo', 'Autoridade', 'reel', 'geral', 'autoridade', 'Posiciona como ação prática, não teoria pura', '120_CTAs_Premium_Intimax.json'),
('Essa informação pode mudar sua perspectiva', 'Autoridade', 'carrossel', 'geral', 'autoridade', 'Promete transformação de perspectiva, não resultado físico', '120_CTAs_Premium_Intimax.json'),
('Poucos falam sobre isso — presta atenção', 'Autoridade', 'stories', 'geral', 'autoridade', 'Cria senso de exclusividade do conteúdo', '120_CTAs_Premium_Intimax.json'),
('Informação que você não encontra em qualquer lugar', 'Autoridade', 'reel', 'geral', 'autoridade', 'Diferencia de conteúdo genérico, reforça valor', '120_CTAs_Premium_Intimax.json'),
('Quer entender de verdade? Assiste até o final', 'Autoridade', 'reel', 'geral', 'autoridade', 'Aumenta retenção, promete entendimento profundo', '120_CTAs_Premium_Intimax.json'),
('Isso é ciência, não achismo', 'Autoridade', 'carrossel', 'geral', 'autoridade', 'Valida credenciais técnicas da Karina', '120_CTAs_Premium_Intimax.json'),
('Conhecimento que faz diferença real', 'Autoridade', 'stories', 'geral', 'autoridade', 'Reforça impacto prático do conteúdo', '120_CTAs_Premium_Intimax.json'),
('Você merece essa informação completa', 'Autoridade', 'reel', 'geral', 'autoridade', 'Posiciona seguidor como merecedor de qualidade', '120_CTAs_Premium_Intimax.json')
ON CONFLICT DO NOTHING;

-- CTAs ESPECÍFICOS INTIMAX
INSERT INTO ctas (texto, categoria, tipo_post, pilar, objetivo, observacao, source_file) VALUES
('Quer conhecer o Intimax? Link na bio', 'Agendamento', 'reel', 'intimax', 'conversao', 'Direcionamento específico para procedimento principal', '120_CTAs_Premium_Intimax.json'),
('Intimax é pra quem quer resultados reais — me chama', 'DM', 'stories', 'intimax', 'conversao', 'Posiciona como solução séria, não superficial', '120_CTAs_Premium_Intimax.json'),
('Seu parceiro também vai notar a diferença', 'Compartilhamento', 'reel', 'intimax', 'crescimento', 'Gatilho de prova social relacional', '120_CTAs_Premium_Intimax.json'),
('Esse procedimento mudou a vida de muitas mulheres', 'Autoridade', 'carrossel', 'intimax', 'autoridade', 'Prova social implícita sem promessas específicas', '120_CTAs_Premium_Intimax.json'),
('Harmonização íntima é autoestima também', 'Autoridade', 'stories', 'intimax', 'autoridade', 'Conecta procedimento com bem-estar emocional', '120_CTAs_Premium_Intimax.json'),
('Quer saber se o Intimax é pra você? Vem conversar', 'DM', 'reel', 'intimax', 'conversao', 'Consultivo, não invasivo', '120_CTAs_Premium_Intimax.json'),
('Autoestima feminina começa com autoconhecimento', 'Autoridade', 'carrossel', 'intimax', 'autoridade', 'Posiciona procedimento como jornada de autoconhecimento', '120_CTAs_Premium_Intimax.json'),
('Você merece se sentir bem com seu corpo', 'Autoridade', 'stories', 'intimax', 'autoridade', 'Empoderamento sem promessa de resultado', '120_CTAs_Premium_Intimax.json')
ON CONFLICT DO NOTHING;

-- =====================================================
-- PARTE 5: IMPORTAR HASHTAGS (biblioteca_hashtags_karina)
-- =====================================================

-- TEMA 1: AUTORIDADE E EDUCAÇÃO (Broad/Amplas)
INSERT INTO hashtags (texto, tema, volume, intencao, risco_compliance, justificativa, source_file) VALUES
('#estetica', 'autoridade', '16.9M', 'descoberta', 'baixo', 'Hashtag raiz estética. Algoritmo recomenda perfis educacionais nessa categoria.', 'biblioteca_hashtags_karina.json'),
('#beleza', 'autoridade', '26.6M', 'descoberta', 'baixo', 'Macro categoria. Público feminino 25-45 anos naturalmente atraído.', 'biblioteca_hashtags_karina.json'),
('#saude', 'autoridade', '37.6M', 'autoridade', 'baixo', 'Valida expertise médica. Algoritmo associa com conteúdo científico.', 'biblioteca_hashtags_karina.json'),
('#skincare', 'autoridade', 'trending', 'descoberta', 'baixo', 'Trending 2024-2025. Audiência global + BR = crescimento exponencial.', 'biblioteca_hashtags_karina.json'),
('#bemestar', 'autoridade', '9.5M', 'autoridade', 'baixo', 'Posiciona como lifestyle, não apenas procedimentos.', 'biblioteca_hashtags_karina.json'),
('#autoestima', 'autoridade', '12.3M', 'autoridade', 'baixo', 'Tema central Karina. Compliance 100%.', 'biblioteca_hashtags_karina.json'),
('#cuidadocomapele', 'autoridade', '2.1M', 'educacao', 'baixo', 'Nicho educativo skincare. Share rate alto.', 'biblioteca_hashtags_karina.json')
ON CONFLICT DO NOTHING;

-- TEMA 1: AUTORIDADE E EDUCAÇÃO (Medium)
INSERT INTO hashtags (texto, tema, volume, intencao, risco_compliance, justificativa, source_file) VALUES
('#medicaestetica', 'autoridade', '890k', 'autoridade', 'baixo', 'Posiciona como médica, não esteticista comum.', 'biblioteca_hashtags_karina.json'),
('#esteticafacial', 'autoridade', '1.2M', 'educacao', 'baixo', 'Específico facial, separa de body procedures.', 'biblioteca_hashtags_karina.json'),
('#biomedica', 'autoridade', '450k', 'autoridade', 'baixo', 'Identifica profissão regulamentada.', 'biblioteca_hashtags_karina.json'),
('#harmonizacaofacial', 'autoridade', '1.8M', 'educacao', 'baixo', 'Termo técnico popular, alta busca.', 'biblioteca_hashtags_karina.json'),
('#especialistaempele', 'autoridade', '380k', 'autoridade', 'baixo', 'Posiciona como especialista, não generalista.', 'biblioteca_hashtags_karina.json'),
('#dermatologiaestetica', 'autoridade', '920k', 'educacao', 'baixo', 'Valida conhecimento dermatológico.', 'biblioteca_hashtags_karina.json'),
('#tratamentofacial', 'autoridade', '750k', 'educacao', 'baixo', 'Tratamento = abordagem completa.', 'biblioteca_hashtags_karina.json')
ON CONFLICT DO NOTHING;

-- TEMA 1: AUTORIDADE E EDUCAÇÃO (Niche)
INSERT INTO hashtags (texto, tema, volume, intencao, risco_compliance, justificativa, source_file) VALUES
('#dicasdebelezanatural', 'autoridade', '180k', 'educacao', 'baixo', 'Micro nicho educativo, engajamento alto.', 'biblioteca_hashtags_karina.json'),
('#medicinaesteticaavancada', 'autoridade', '95k', 'autoridade', 'baixo', 'Diferencia de básico, posiciona como avançada.', 'biblioteca_hashtags_karina.json'),
('#especialistaharmonizacao', 'autoridade', '65k', 'autoridade', 'baixo', 'Micro nicho específico.', 'biblioteca_hashtags_karina.json'),
('#educacaoestetica', 'autoridade', '42k', 'educacao', 'baixo', 'Compliance perfeito - educação em primeiro lugar.', 'biblioteca_hashtags_karina.json'),
('#conteudoeducativo', 'autoridade', '320k', 'educacao', 'baixo', 'Algoritmo favorece creators educacionais.', 'biblioteca_hashtags_karina.json')
ON CONFLICT DO NOTHING;

-- TEMA 2: PROCEDIMENTOS
INSERT INTO hashtags (texto, tema, volume, intencao, risco_compliance, justificativa, source_file) VALUES
('#preenchimentolabial', 'procedimento', '1.5M', 'descoberta', 'medio', 'Alto volume, cuidado com promessas.', 'biblioteca_hashtags_karina.json'),
('#botox', 'procedimento', '8.2M', 'descoberta', 'medio', 'Termo mais buscado, competição alta.', 'biblioteca_hashtags_karina.json'),
('#acidohialuronico', 'procedimento', '2.1M', 'educacao', 'baixo', 'Técnico, educativo, compliance ok.', 'biblioteca_hashtags_karina.json'),
('#preenchimentofacial', 'procedimento', '1.8M', 'descoberta', 'medio', 'Termo popular, cuidado com expectativas.', 'biblioteca_hashtags_karina.json'),
('#toxinabotulinica', 'procedimento', '680k', 'educacao', 'baixo', 'Nome técnico, público qualificado.', 'biblioteca_hashtags_karina.json'),
('#rinomodelacao', 'procedimento', '420k', 'descoberta', 'medio', 'Específico, nicho de interesse.', 'biblioteca_hashtags_karina.json'),
('#liftingsemcirurgia', 'procedimento', '380k', 'descoberta', 'medio', 'Termo buscado, diferencia de cirurgia.', 'biblioteca_hashtags_karina.json'),
('#bioestimuladores', 'procedimento', '520k', 'educacao', 'baixo', 'Tendência 2024-2025.', 'biblioteca_hashtags_karina.json'),
('#microagulhamento', 'procedimento', '890k', 'educacao', 'baixo', 'Procedimento educativo, compliance ok.', 'biblioteca_hashtags_karina.json'),
('#peelingquimico', 'procedimento', '450k', 'educacao', 'baixo', 'Tratamento clássico, público engajado.', 'biblioteca_hashtags_karina.json')
ON CONFLICT DO NOTHING;


-- TEMA 3: INTIMAX / HARMONIZAÇÃO ÍNTIMA
INSERT INTO hashtags (texto, tema, volume, intencao, risco_compliance, justificativa, pilar, source_file) VALUES
('#harmonizacaointima', 'intimax', '320k', 'descoberta', 'medio', 'Termo principal do procedimento.', 'intimax', 'biblioteca_hashtags_karina.json'),
('#saudeintimafeminina', 'intimax', '280k', 'educacao', 'baixo', 'Educativo, compliance perfeito.', 'intimax', 'biblioteca_hashtags_karina.json'),
('#autoestimaFeminina', 'intimax', '450k', 'autoridade', 'baixo', 'Conecta procedimento com bem-estar.', 'intimax', 'biblioteca_hashtags_karina.json'),
('#ninfoplastia', 'intimax', '180k', 'descoberta', 'medio', 'Termo técnico específico.', 'intimax', 'biblioteca_hashtags_karina.json'),
('#rejuvenescimentointimo', 'intimax', '95k', 'descoberta', 'medio', 'Específico, público qualificado.', 'intimax', 'biblioteca_hashtags_karina.json'),
('#cuidadosfemininos', 'intimax', '520k', 'educacao', 'baixo', 'Amplo, educativo, compliance ok.', 'intimax', 'biblioteca_hashtags_karina.json'),
('#saudefeminina', 'intimax', '1.2M', 'educacao', 'baixo', 'Macro categoria saúde feminina.', 'intimax', 'biblioteca_hashtags_karina.json'),
('#bemestarfeminino', 'intimax', '380k', 'autoridade', 'baixo', 'Lifestyle feminino.', 'intimax', 'biblioteca_hashtags_karina.json'),
('#empoderamento', 'intimax', '890k', 'autoridade', 'baixo', 'Gatilho emocional positivo.', 'intimax', 'biblioteca_hashtags_karina.json'),
('#corpofeminino', 'intimax', '650k', 'educacao', 'baixo', 'Educação sobre corpo feminino.', 'intimax', 'biblioteca_hashtags_karina.json')
ON CONFLICT DO NOTHING;

-- TEMA 4: LOCAL (Criciúma/SC)
INSERT INTO hashtags (texto, tema, volume, intencao, risco_compliance, justificativa, source_file) VALUES
('#criciuma', 'local', '890k', 'descoberta', 'baixo', 'Cidade principal de atuação.', 'biblioteca_hashtags_karina.json'),
('#criciumasc', 'local', '320k', 'descoberta', 'baixo', 'Localização específica.', 'biblioteca_hashtags_karina.json'),
('#santacatarina', 'local', '2.1M', 'descoberta', 'baixo', 'Estado, amplia alcance regional.', 'biblioteca_hashtags_karina.json'),
('#suldobrasil', 'local', '1.5M', 'descoberta', 'baixo', 'Região, atrai público regional.', 'biblioteca_hashtags_karina.json'),
('#esteticacriciuma', 'local', '45k', 'descoberta', 'baixo', 'Nicho local específico.', 'biblioteca_hashtags_karina.json'),
('#clinicaesteticasc', 'local', '28k', 'descoberta', 'baixo', 'Clínicas no estado.', 'biblioteca_hashtags_karina.json'),
('#medicaesteticacriciuma', 'local', '12k', 'autoridade', 'baixo', 'Micro nicho local.', 'biblioteca_hashtags_karina.json'),
('#harmonizacaocriciuma', 'local', '8k', 'descoberta', 'baixo', 'Específico local.', 'biblioteca_hashtags_karina.json')
ON CONFLICT DO NOTHING;

-- TEMA 5: PROVA SOCIAL
INSERT INTO hashtags (texto, tema, volume, intencao, risco_compliance, justificativa, source_file) VALUES
('#antesedepois', 'prova_social', '5.2M', 'descoberta', 'alto', 'CUIDADO: Deve respeitar compliance CFM.', 'biblioteca_hashtags_karina.json'),
('#resultadosreais', 'prova_social', '1.8M', 'autoridade', 'alto', 'CUIDADO: Não prometer resultados específicos.', 'biblioteca_hashtags_karina.json'),
('#depoimentos', 'prova_social', '420k', 'autoridade', 'medio', 'Depoimentos de pacientes.', 'biblioteca_hashtags_karina.json'),
('#pacientesatisfeita', 'prova_social', '180k', 'autoridade', 'medio', 'Feedback positivo.', 'biblioteca_hashtags_karina.json'),
('#transformacao', 'prova_social', '3.5M', 'descoberta', 'alto', 'CUIDADO: Não usar para promessas.', 'biblioteca_hashtags_karina.json'),
('#casosreais', 'prova_social', '95k', 'autoridade', 'medio', 'Estudos de caso.', 'biblioteca_hashtags_karina.json')
ON CONFLICT DO NOTHING;

-- TEMA 6: BASTIDORES
INSERT INTO hashtags (texto, tema, volume, intencao, risco_compliance, justificativa, source_file) VALUES
('#bastidores', 'bastidores', '2.8M', 'descoberta', 'baixo', 'Humaniza a marca.', 'biblioteca_hashtags_karina.json'),
('#rotinaclinica', 'bastidores', '180k', 'autoridade', 'baixo', 'Dia a dia profissional.', 'biblioteca_hashtags_karina.json'),
('#diadetrabalho', 'bastidores', '1.2M', 'descoberta', 'baixo', 'Conteúdo lifestyle.', 'biblioteca_hashtags_karina.json'),
('#vidademedica', 'bastidores', '320k', 'autoridade', 'baixo', 'Humaniza profissão.', 'biblioteca_hashtags_karina.json'),
('#trabalhocomamor', 'bastidores', '580k', 'autoridade', 'baixo', 'Conexão emocional.', 'biblioteca_hashtags_karina.json'),
('#clinicalife', 'bastidores', '95k', 'autoridade', 'baixo', 'Lifestyle de clínica.', 'biblioteca_hashtags_karina.json'),
('#momentosreais', 'bastidores', '420k', 'descoberta', 'baixo', 'Autenticidade.', 'biblioteca_hashtags_karina.json'),
('#transparencia', 'bastidores', '280k', 'autoridade', 'baixo', 'Confiança.', 'biblioteca_hashtags_karina.json')
ON CONFLICT DO NOTHING;

-- =====================================================
-- PARTE 6: IMPORTAR GANCHOS/HEADLINES
-- =====================================================

INSERT INTO ganchos (texto, tipo_legenda, tipo_gancho, tipo_post, pilar, objetivo, source_file) VALUES
('Você sabia que 90% das pessoas fazem isso errado?', 'gancho', 'curiosidade', 'reel', 'geral', 'autoridade', 'ganchos_educativos.json'),
('3 erros que quase todo mundo comete', 'gancho', 'lista', 'carrossel', 'geral', 'educativo', 'ganchos_educativos.json'),
('A verdade que ninguém te conta sobre...', 'gancho', 'revelacao', 'reel', 'geral', 'autoridade', 'ganchos_educativos.json'),
('Se você está pensando em fazer isso, assista até o final', 'gancho', 'retencao', 'reel', 'geral', 'educativo', 'ganchos_educativos.json'),
('Médica responde: pode ou não pode?', 'gancho', 'qa', 'reel', 'geral', 'autoridade', 'ganchos_educativos.json'),
('O que eu gostaria de ter sabido antes', 'gancho', 'historia', 'carrossel', 'geral', 'autoridade', 'ganchos_educativos.json'),
('Pare de fazer isso agora!', 'gancho', 'alerta', 'reel', 'geral', 'educativo', 'ganchos_educativos.json'),
('A pergunta que mais recebo no consultório', 'gancho', 'qa', 'stories', 'geral', 'autoridade', 'ganchos_educativos.json'),
('Isso pode mudar sua perspectiva completamente', 'gancho', 'transformacao', 'reel', 'geral', 'autoridade', 'ganchos_educativos.json'),
('O mito mais comum que eu escuto', 'gancho', 'mito', 'carrossel', 'geral', 'educativo', 'ganchos_educativos.json'),
('Por que ninguém fala sobre isso?', 'gancho', 'curiosidade', 'reel', 'geral', 'autoridade', 'ganchos_educativos.json'),
('A ciência por trás disso é fascinante', 'gancho', 'ciencia', 'carrossel', 'geral', 'autoridade', 'ganchos_educativos.json'),
('Você está fazendo isso do jeito errado', 'gancho', 'alerta', 'reel', 'geral', 'educativo', 'ganchos_educativos.json'),
('O segredo que os especialistas não revelam', 'gancho', 'revelacao', 'reel', 'geral', 'autoridade', 'ganchos_educativos.json'),
('Isso vai te surpreender', 'gancho', 'curiosidade', 'stories', 'geral', 'engajamento', 'ganchos_educativos.json')
ON CONFLICT DO NOTHING;

-- Ganchos específicos INTIMAX
INSERT INTO ganchos (texto, tipo_legenda, tipo_gancho, tipo_post, pilar, objetivo, source_file) VALUES
('O que é harmonização íntima? Deixa eu explicar', 'gancho', 'qa', 'reel', 'intimax', 'educativo', 'ganchos_intimax.json'),
('Por que mulheres estão buscando esse procedimento', 'gancho', 'curiosidade', 'carrossel', 'intimax', 'autoridade', 'ganchos_intimax.json'),
('Autoestima feminina começa com autoconhecimento', 'gancho', 'transformacao', 'reel', 'intimax', 'autoridade', 'ganchos_intimax.json'),
('A verdade sobre ninfoplastia que você precisa saber', 'gancho', 'revelacao', 'carrossel', 'intimax', 'educativo', 'ganchos_intimax.json'),
('Esse procedimento mudou a vida de muitas pacientes', 'gancho', 'historia', 'reel', 'intimax', 'autoridade', 'ganchos_intimax.json'),
('Mitos sobre harmonização íntima', 'gancho', 'mito', 'carrossel', 'intimax', 'educativo', 'ganchos_intimax.json'),
('Por que falar sobre saúde íntima é tão importante', 'gancho', 'curiosidade', 'reel', 'intimax', 'autoridade', 'ganchos_intimax.json'),
('O tabu que precisamos quebrar', 'gancho', 'revelacao', 'stories', 'intimax', 'engajamento', 'ganchos_intimax.json')
ON CONFLICT DO NOTHING;


-- =====================================================
-- PARTE 7: VALIDAÇÃO FINAL
-- =====================================================

DO $$
DECLARE
    v_ctas_count INTEGER;
    v_hashtags_count INTEGER;
    v_ganchos_count INTEGER;
    v_legendas_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_ctas_count FROM ctas;
    SELECT COUNT(*) INTO v_hashtags_count FROM hashtags;
    SELECT COUNT(*) INTO v_ganchos_count FROM ganchos;
    SELECT COUNT(*) INTO v_legendas_count FROM legendas;
    
    RAISE NOTICE '';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'MIGRATION 006 - RELATÓRIO FINAL';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'CTAs:     % registros', v_ctas_count;
    RAISE NOTICE 'Hashtags: % registros', v_hashtags_count;
    RAISE NOTICE 'Ganchos:  % registros', v_ganchos_count;
    RAISE NOTICE 'Legendas: % registros', v_legendas_count;
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'TOTAL:    % registros', v_ctas_count + v_hashtags_count + v_ganchos_count + v_legendas_count;
    RAISE NOTICE '=====================================================';
    
    IF v_ctas_count > 0 AND v_hashtags_count > 0 AND v_ganchos_count > 0 THEN
        RAISE NOTICE 'STATUS: ✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!';
    ELSE
        RAISE WARNING 'STATUS: ⚠️ VERIFICAR - Algumas tabelas podem estar vazias';
    END IF;
END $$;

-- =====================================================
-- FIM DA MIGRATION 006
-- =====================================================
