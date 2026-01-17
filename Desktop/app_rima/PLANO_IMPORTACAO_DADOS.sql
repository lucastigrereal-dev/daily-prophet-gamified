-- ========================================
-- PLANO DE IMPORTAÇÃO: 7.200+ RIMAS
-- ========================================

-- PARTE 1: SEED INICIAL (executar depois de criar schema)
-- ========================================

-- 1.1 Inserir 5 usuários de teste
INSERT INTO users (email, username, password_hash, nivel, xp_total, rating, duels_total, duels_won, duels_lost) VALUES
('neo@test.com', 'neo_rima', '$2b$10$PBPYV8qpVzSh7q8qJ8qJ8Ogkp0qJ8qJ8qkJ8qJ8qkJ8qk', 15, 7500, 2800, 60, 48, 12),
('criolo@test.com', 'criolo_master', '$2b$10$PBPYV8qpVzSh7q8qJ8qJ8Ogkp0qJ8qJ8qkJ8qJ8qkJ8qk', 12, 5500, 2350, 50, 35, 15),
('estrategia@test.com', 'estrategista', '$2b$10$PBPYV8qpVzSh7q8qJ8qJ8Ogkp0qJ8qJ8qkJ8qJ8qkJ8qk', 10, 4200, 2100, 40, 28, 12),
('principiante@test.com', 'principiante', '$2b$10$PBPYV8qpVzSh7q8qJ8qJ8Ogkp0qJ8qJ8qkJ8qJ8qkJ8qk', 3, 800, 1200, 5, 2, 3),
('teste@test.com', 'teste', '$2b$10$PBPYV8qpVzSh7q8qJ8qJ8Ogkp0qJ8qJ8qkJ8qJ8qkJ8qk', 1, 0, 1200, 0, 0, 0)
ON CONFLICT (email) DO NOTHING;

-- 1.2 Criar cosmetics básicos para loja
INSERT INTO cosmetics (name, description, type, rarity, price_brl, image_url) VALUES
('Neon Skin', 'Skin neon brilhante exclusivo', 'skin', 'rare', 9.99, '/cosmetics/neon-skin.png'),
('Gold Border', 'Border dourado premium', 'border', 'epic', 14.99, '/cosmetics/gold-border.png'),
('Platinum Avatar', 'Avatar platinado exclusivo', 'avatar', 'legendary', 19.99, '/cosmetics/platinum-avatar.png'),
('Cool Emote', 'Emote exclusivo e legal', 'emote', 'common', 4.99, '/cosmetics/cool-emote.png'),
('Diamond Skin', 'Skin diamantada ultra rara', 'skin', 'legendary', 29.99, '/cosmetics/diamond-skin.png')
ON CONFLICT DO NOTHING;

-- 1.3 Criar exercícios de exemplo (Pillar 1)
INSERT INTO exercises (pillar, lesson, exercise_num, type, title, description, instructions, difficulty, time_limit_seconds, base_xp, bonus_xp) VALUES
(1, 1, 1, 'listening', 'Identifique a Rima', 'Ouça dois sons e identifique se rimam', 'Toque no botão SIM se rimam, NÃO se não rimam', 'easy', 30, 10, 5),
(1, 1, 2, 'matching', 'Agrupe Rimas', 'Arraste as palavras para agrupar as que rimam', 'Drag and drop as palavras em grupos', 'easy', 60, 15, 10),
(1, 1, 3, 'fill_blank', 'Complete a Rima', 'Escolha a palavra que completa a rima', 'Selecione entre as 3 opções', 'easy', 45, 15, 10),
(1, 1, 4, 'production', 'Grava Sua Rima', 'Grava uma frase que rima com o exemplo', 'Aperte REC, fale seu verso, aperte STOP', 'easy', 120, 50, 30),
(1, 1, 5, 'speed', 'Speed Challenge Rimas', 'Identifique 10 rimas rápido', 'Toque RIMA ou NÃO RIMA', 'medium', 60, 40, 30)
ON CONFLICT (pillar, lesson, exercise_num) DO NOTHING;

-- 1.4 Criar exercício de exemplo para Pillar 2 (Flow)
INSERT INTO exercises (pillar, lesson, exercise_num, type, title, description, instructions, difficulty, time_limit_seconds, base_xp, bonus_xp) VALUES
(2, 1, 1, 'rhythm', 'Sync com Beat', 'Bata na tela sincronizado com o beat', 'Toque na tela a cada beat (4 vezes)', 'medium', 30, 20, 15),
(2, 1, 2, 'listening', 'Identifique BPM', 'Ouça o beat e escolha o BPM correto', '3 opções: 90, 110, ou 130 BPM', 'easy', 45, 15, 10),
(2, 1, 3, 'production', 'Rima no Beat', 'Grava verso sincronizado com o beat', 'Beat toca automaticamente, você rima on beat', 'medium', 60, 50, 40),
(2, 1, 4, 'comparison', 'Qual tem Melhor Flow?', 'Compare 2 versos e escolha qual flui melhor', 'Ouça ambos e escolha', 'medium', 45, 15, 10),
(2, 1, 5, 'speed', 'Speed: Multi-Beat Recognition', 'Identifique BPM de 5 beats rápido', '5 beats diferentes em 60s', 'hard', 60, 60, 50)
ON CONFLICT (pillar, lesson, exercise_num) DO NOTHING;

-- ========================================
-- PARTE 2: IMPORTAR 7.200+ RIMAS
-- ========================================

-- 2.1 OPÇÃO A: Se você tem CSV (recomendado para 7.200 rimas)
--
-- Crie arquivo: rimas_7200.csv com estrutura:
--   verso,tema,familia_rima,dificuldade,citacao_real,mc_source,musica_source
--
-- Exemplo linhas:
--   "Meu flow é fogo",Confronto,-O,easy,"Verso real",Neo,Música
--   "Seu verso é fraco",Confronto,-O,easy,,
--
-- Depois importe:
--
--   \COPY rimas_banco (verso, tema, familia_rima, dificuldade, citacao_real, mc_source, musica_source)
--   FROM '/path/to/rimas_7200.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',', QUOTE '"');
--
-- OU via Supabase Storage:
--   1. Upload rimas_7200.csv para Storage
--   2. Gere URL pública
--   3. Use função SQL para importar

-- 2.2 OPÇÃO B: Se você tem JSON (alternativa)
--
-- Crie arquivo: rimas_7200.json
-- [
--   {"verso": "Meu flow...", "tema": "Confronto", "familia_rima": "-O", "dificuldade": "easy"},
--   ...
-- ]
--
-- Importe via CLI:
--   psql -U postgres aprenda_rima \
--     -c "SELECT * FROM json_to_recordset(
--           pg_read_file('/tmp/rimas_7200.json')::json
--         ) AS t(verso text, tema text, familia_rima text, dificuldade text);"

-- 2.3 GENERATOR: Criar 7.200 rimas programaticamente (SQL)
--
-- Este é um exemplo de generator que cria padrões realistas
-- Para 7.200 reais, use o gerador TypeScript em 25_SEED_DATA_7200_RIMAS.md

DO $$
DECLARE
  temas TEXT[] := ARRAY['Confronto', 'Autoestima', 'Estratégia', 'Caráter'];
  familias TEXT[] := ARRAY['-O', '-ÃO', '-ÊNCIA', '-AÇÃO', '-INHO', '-ADA', '-IDADE', '-ISMO', '-ÁVEL', '-ORA'];
  dificuldades difficulty_level[] := ARRAY['easy', 'easy', 'medium', 'hard'];

  versos TEXT[] := ARRAY[
    -- Confronto
    'Seu flow é fraco, meu é de ouro',
    'Você é fake, eu sou verdadeiro',
    'Sua rima é ruim, a minha é ouro',
    'Você é zero, eu sou número um',
    'Tá na minha frente vendo meu show',

    -- Autoestima
    'Eu sou o número um deste palco',
    'Meu talento é um símbolo',
    'Eu sou único neste círculo',
    'Meu carisma é incrível',
    'Eu sou a lenda deste jogo',

    -- Estratégia
    'Meu plano é estratégico',
    'Eu penso antes de atacar',
    'Minha mente calcula tudo',
    'Cada movimento é lógico',
    'Eu controlo o ritmo do solo',

    -- Caráter
    'Tenho nome e sobrenome limpo',
    'Meu caráter é impecável',
    'Sou honrado, sou digno',
    'Minha palavra tem valor',
    'Sou homem de princípio'
  ];

  contador INT := 0;
  i INT;
  tema_idx INT;
  familia_idx INT;
  verso_idx INT;

BEGIN
  FOR i IN 1..1800 LOOP -- Gera 1.800 rimas (para produção, fazer 4x para 7.200)
    tema_idx := 1 + (i % array_length(temas, 1));
    familia_idx := 1 + ((i / 5) % array_length(familias, 1));
    verso_idx := 1 + ((i / 20) % array_length(versos, 1));

    INSERT INTO rimas_banco (verso, tema, familia_rima, dificuldade, ranking, is_featured)
    VALUES (
      versos[verso_idx] || ' [' || i::text || ']',
      temas[tema_idx],
      familias[familia_idx],
      dificuldades[(i % 4) + 1],
      (5000 - i), -- ranking decrescente
      (i % 50 = 0) -- a cada 50, é featured
    );

    contador := contador + 1;

    -- Log a cada 100 inserts
    IF contador % 100 = 0 THEN
      RAISE NOTICE 'Inseridos % rimas', contador;
    END IF;
  END LOOP;

  RAISE NOTICE 'TOTAL INSERIDO: % rimas', contador;
END $$;

-- 2.4 VERIFICAR inserção
SELECT COUNT(*) AS total_rimas FROM rimas_banco;
SELECT tema, COUNT(*) AS count FROM rimas_banco GROUP BY tema;
SELECT familia_rima, COUNT(*) AS count FROM rimas_banco GROUP BY familia_rima;
SELECT dificuldade, COUNT(*) AS count FROM rimas_banco GROUP BY dificuldade;

-- ========================================
-- PARTE 3: CRIAR DADOS EXEMPLO (OPCIONAL)
-- ========================================

-- 3.1 Criar user_equipped para usuários de teste
INSERT INTO user_equipped (user_id, skin_id, avatar_id)
SELECT u.id, c1.id, c2.id
FROM users u
LEFT JOIN cosmetics c1 ON c1.type = 'skin' LIMIT 1
LEFT JOIN cosmetics c2 ON c2.type = 'avatar' LIMIT 1
LIMIT 5
ON CONFLICT DO NOTHING;

-- 3.2 Dar alguns cosmetics aos usuários
INSERT INTO user_cosmetics (user_id, cosmetic_id)
SELECT u.id, c.id
FROM users u
CROSS JOIN cosmetics c
WHERE u.username = 'neo_rima' AND c.type = 'skin'
ON CONFLICT DO NOTHING;

-- 3.3 Award achievements aos usuários
INSERT INTO user_achievements (user_id, achievement_id)
SELECT u.id, a.id
FROM users u
CROSS JOIN achievements a
WHERE u.username IN ('neo_rima', 'criolo_master')
LIMIT 10
ON CONFLICT DO NOTHING;

-- 3.4 Criar créditos iniciais
INSERT INTO user_credits (user_id, balance)
SELECT id, 100.00
FROM users
ON CONFLICT (user_id) DO NOTHING;

-- 3.5 Criar exercícios exemplo (learning path básico)
INSERT INTO exercises (pillar, lesson, exercise_num, type, title, description, instructions, difficulty, time_limit_seconds, base_xp, bonus_xp) VALUES
(1, 2, 1, 'listening', 'AABB Identificar', 'Ouça e identifique estrutura AABB', 'Selecione AABB se correto', 'easy', 45, 10, 5),
(1, 2, 2, 'matching', 'AABB Agrupe', 'Agrupe versos em pares AABB', 'Drag and drop', 'easy', 60, 15, 10),
(1, 3, 1, 'listening', 'Multi-sílaba Identificar', 'Identifique rimas multi-sílaba', 'Toque multi se detectado', 'medium', 60, 10, 5),
(1, 4, 1, 'listening', 'Slant vs Perfeita', 'Compare rima perfeita vs slant', 'Escolha qual é qual', 'medium', 45, 15, 10),
(2, 2, 1, 'comparison', 'Pacing Evaluation', 'Qual verso tem melhor pacing?', 'Escolha A ou B', 'medium', 45, 15, 10),
(3, 1, 1, 'listening', 'Estrutura Verso', 'Identifique setup + punchline', 'Toque se tem estrutura clara', 'medium', 60, 10, 5),
(4, 1, 1, 'production', 'Rebuttal Básico', 'Responda verso com rebuttal', 'AI diz rima, você responde', 'medium', 120, 60, 40)
ON CONFLICT (pillar, lesson, exercise_num) DO NOTHING;

-- ========================================
-- PARTE 4: DADOS DE SEED - EXEMPLOS REAIS
-- ========================================

-- 4.1 Sample user duels (para teste do backend)
INSERT INTO user_duels (user_id, verso_id, user_verso, ai_response, difficulty, status, user_score, ai_score, xp_gained, rating_change)
SELECT
  u.id,
  rb.id,
  'Meu flow é fogo, seu é gelado',
  'Seu verso é fraco, meu é soldado',
  'easy',
  'won',
  85,
  60,
  75,
  25
FROM users u
CROSS JOIN rimas_banco rb
WHERE u.username = 'neo_rima' AND rb.dificuldade = 'easy'
LIMIT 3
ON CONFLICT DO NOTHING;

-- 4.2 Sample exercise results
INSERT INTO user_exercise_results (user_id, exercise_id, score, xp_earned, completed_at, time_spent_seconds, attempts, is_best_attempt)
SELECT
  u.id,
  e.id,
  CASE WHEN random() > 0.3 THEN FLOOR(random() * 20 + 80)::INTEGER ELSE FLOOR(random() * 40 + 40)::INTEGER END,
  CASE WHEN score > 80 THEN e.base_xp + e.bonus_xp ELSE e.base_xp END,
  NOW() - INTERVAL '1 day' * FLOOR(random() * 5),
  FLOOR(random() * 120 + 30)::INTEGER,
  FLOOR(random() * 3 + 1)::INTEGER,
  TRUE
FROM users u
CROSS JOIN exercises e
WHERE u.username = 'neo_rima' AND e.pillar = 1
LIMIT 5
ON CONFLICT DO NOTHING;

-- 4.3 Sample favorite verses
INSERT INTO favorite_verses (user_id, verso_id)
SELECT
  u.id,
  rb.id
FROM users u
CROSS JOIN rimas_banco rb
WHERE u.username IN ('neo_rima', 'criolo_master')
AND rb.dificuldade IN ('easy', 'medium')
AND rb.is_featured = TRUE
LIMIT 10
ON CONFLICT DO NOTHING;

-- ========================================
-- PARTE 5: VERIFICAÇÃO & VALIDAÇÃO
-- ========================================

-- 5.1 Verificar integridade referencial
SELECT COUNT(*) as orphaned_results
FROM user_exercise_results uer
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = uer.user_id);

SELECT COUNT(*) as orphaned_duels
FROM user_duels ud
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = ud.user_id);

-- 5.2 Estatísticas gerais
SELECT
  'Total Users' as metric, COUNT(*)::text as value FROM users
UNION ALL
SELECT 'Total Rimas' as metric, COUNT(*)::text as value FROM rimas_banco
UNION ALL
SELECT 'Total Exercises' as metric, COUNT(*)::text as value FROM exercises
UNION ALL
SELECT 'Total Exercise Results' as metric, COUNT(*)::text as value FROM user_exercise_results
UNION ALL
SELECT 'Total AI Evaluations' as metric, COUNT(*)::text as value FROM ai_evaluations
UNION ALL
SELECT 'Total Duels' as metric, COUNT(*)::text as value FROM user_duels
UNION ALL
SELECT 'Total Cosmetics' as metric, COUNT(*)::text as value FROM cosmetics;

-- 5.3 Verificar constraints
SELECT constraint_name, table_name, column_name
FROM information_schema.key_column_usage
WHERE table_schema = 'public'
ORDER BY table_name;

-- 5.4 Tamanho de cada tabela
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ========================================
-- PARTE 6: BACKUP APÓS SEED
-- ========================================

-- Para fazer backup após importação (via CLI):
-- pg_dump -U postgres aprenda_rima > backup_with_seed_$(date +%Y%m%d_%H%M%S).sql
--
-- Restaurar depois:
-- psql -U postgres aprenda_rima < backup_with_seed_20260117_000000.sql

-- ========================================
-- NOTAS IMPORTANTES
-- ========================================

/*
1. ORDEM DE EXECUÇÃO CORRETA:
   a) Criar schema (BANCO_DADOS_28_TABELAS_FINAL.sql)
   b) Executar PARTE 1 (seed inicial)
   c) Executar PARTE 2 (importar 7.200 rimas)
   d) Executar PARTE 3 (dados exemplo)
   e) Executar PARTE 4 (sample data)
   f) Executar PARTE 5 (verificação)

2. IMPORTAÇÃO CSV (RECOMENDADO):
   - Prepare CSV com delimiter: ','
   - Encoding: UTF-8 BOM
   - Quantidades: 7.200+ rimas
   - Via Supabase: Storage → SQL COPY função

3. GERADOR TYPESCRIPT:
   - Use o código em 25_SEED_DATA_7200_RIMAS.md
   - Gera rimas realistas por tema/familia
   - Exporta como CSV ou JSON
   - Melhor qualidade que SQL puro

4. PERFORMANCE:
   - Disable triggers durante bulk insert:
     ALTER TABLE users DISABLE TRIGGER ALL;
     ... INSERT ...
     ALTER TABLE users ENABLE TRIGGER ALL;

   - Usar COPY em vez de INSERT para CSV (10x mais rápido)
   - Batch inserts em chunks de 1.000-5.000 rows

5. VALIDAÇÃO PÓS-IMPORT:
   - Rodar PARTE 5 queries
   - Verificar duplicates: SELECT verso, COUNT(*) FROM rimas_banco GROUP BY verso HAVING COUNT(*) > 1;
   - Verificar orphans: SELECT * FROM user_exercise_results WHERE user_id NOT IN (SELECT id FROM users);

6. SUPABASE ESPECÍFICO:
   - Upload CSV via Storage
   - Use RLS policies após seed
   - Fazer backup imediatamente após seed
*/

-- ========================================
-- ✅ PLANO DE IMPORTAÇÃO COMPLETO
-- ========================================
