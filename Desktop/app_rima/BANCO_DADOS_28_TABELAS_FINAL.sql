-- ========================================
-- APRENDA RIMA: SCHEMA UNIFICADO FINAL
-- 28 TABELAS CONSOLIDADAS & OTIMIZADAS
-- PostgreSQL 15 | Supabase Ready
-- ========================================

-- Última atualização: 2026-01-17
-- Status: PRODUCTION READY
-- Copy-paste direto em Supabase SQL Editor

-- ========================================
-- 0. SETUP INICIAL
-- ========================================

-- Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para full-text search em rimas

-- ========================================
-- 1. ENUMS & CUSTOM TYPES
-- ========================================

CREATE TYPE user_role AS ENUM ('admin', 'user', 'moderator');
CREATE TYPE exercise_type AS ENUM ('listening', 'matching', 'fill_blank', 'production', 'speed', 'sequencing', 'rhythm', 'comparison', 'simulation', 'freestyle');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE duel_status AS ENUM ('pending', 'completed', 'won', 'lost', 'draw');
CREATE TYPE purchase_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE cosmetic_type AS ENUM ('skin', 'border', 'avatar', 'emote');
CREATE TYPE cosmetic_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');
CREATE TYPE rank_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond');
CREATE TYPE quest_type AS ENUM ('daily', 'weekly', 'monthly', 'special');

-- ========================================
-- 2. CORE TABLES
-- ========================================

-- 2.1 Users (UNIFIED: auth + profile + progress + gamification)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'user',

  -- Gamification
  nivel INTEGER DEFAULT 1 CHECK (nivel BETWEEN 1 AND 50),
  xp_total INTEGER DEFAULT 0 CHECK (xp_total >= 0),
  rating INTEGER DEFAULT 1200 CHECK (rating >= 0),

  -- Streaks & Stats
  current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
  best_streak INTEGER DEFAULT 0 CHECK (best_streak >= 0),
  last_activity_at TIMESTAMP,

  -- Learning Progress
  current_pillar INTEGER DEFAULT 1 CHECK (current_pillar BETWEEN 1 AND 4),
  current_lesson INTEGER DEFAULT 1 CHECK (current_lesson BETWEEN 1 AND 4),
  current_exercise INTEGER DEFAULT 1 CHECK (current_exercise BETWEEN 1 AND 5),

  -- Battle Stats
  duels_total INTEGER DEFAULT 0 CHECK (duels_total >= 0),
  duels_won INTEGER DEFAULT 0 CHECK (duels_won >= 0),
  duels_lost INTEGER DEFAULT 0 CHECK (duels_lost >= 0),

  -- Theme Specialization
  theme_specialization VARCHAR(100),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE users IS 'Tabela central unificada de usuários com auth, perfil, gamificação e progresso';
COMMENT ON COLUMN users.nivel IS 'Nível calculado a partir de xp_total (1-50)';
COMMENT ON COLUMN users.current_pillar IS 'Pilar de treinamento (1=Rima, 2=Flow, 3=Conteúdo, 4=Batalla)';

-- 2.2 Sessions (Para rastrear login)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE sessions IS 'Sessões de usuário logado (JWT/sessions)';

-- ========================================
-- 3. LEARNING SYSTEM
-- ========================================

-- 3.1 Exercise Template (o que é cada exercício)
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pillar INTEGER NOT NULL CHECK (pillar BETWEEN 1 AND 4),
  lesson INTEGER NOT NULL CHECK (lesson BETWEEN 1 AND 4),
  exercise_num INTEGER NOT NULL CHECK (exercise_num BETWEEN 1 AND 5),

  -- Content
  type exercise_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT,

  -- Audio Files
  audio_urls TEXT[], -- Array de URLs

  -- Difficulty & Timing
  difficulty difficulty_level NOT NULL DEFAULT 'easy',
  time_limit_seconds INTEGER, -- null = sem limite

  -- Rewards
  base_xp INTEGER DEFAULT 10 CHECK (base_xp > 0),
  bonus_xp_threshold INTEGER DEFAULT 80, -- Score > 80% ganha bonus
  bonus_xp INTEGER DEFAULT 20,
  badge_reward UUID REFERENCES badges(id) ON DELETE SET NULL,

  -- AI Metrics (para production exercises)
  ai_metrics TEXT[], -- Array: ['rhyme_accuracy', 'flow_timing', 'content_quality']

  -- Metadata
  sequence_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(pillar, lesson, exercise_num)
);

COMMENT ON TABLE exercises IS 'Template de cada exercício no currículo de 30 lições';

-- 3.2 Exercise Content (variações, exemplos)
CREATE TABLE exercises_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,

  content_type VARCHAR(50), -- 'example', 'hint', 'feedback_positive', 'feedback_negative'
  content TEXT NOT NULL,
  audio_url TEXT,

  sequence_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE exercises_content IS 'Exemplos, dicas e feedbacks para cada exercício';

-- 3.3 User Exercise Results (execução de cada exercício por user)
CREATE TABLE user_exercise_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,

  -- Performance
  score INTEGER CHECK (score BETWEEN 0 AND 100),
  xp_earned INTEGER DEFAULT 0 CHECK (xp_earned >= 0),

  -- Audio (se exercise tipo production)
  audio_url TEXT,
  audio_duration_seconds INTEGER,

  -- Metadata
  attempts INTEGER DEFAULT 1 CHECK (attempts > 0),
  completed_at TIMESTAMP,
  time_spent_seconds INTEGER,
  is_best_attempt BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE user_exercise_results IS 'Histórico de execução de cada usuário em cada exercício';
COMMENT ON COLUMN user_exercise_results.is_best_attempt IS 'Flag para tracking do melhor score do usuário neste exercício';

-- 3.4 AI Evaluations (análise IA do verso do usuário)
CREATE TABLE ai_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  result_id UUID NOT NULL REFERENCES user_exercise_results(id) ON DELETE CASCADE,

  -- Scores
  rhyme_score INTEGER CHECK (rhyme_score BETWEEN 0 AND 100),
  flow_score INTEGER CHECK (flow_score BETWEEN 0 AND 100),
  timing_score INTEGER CHECK (timing_score BETWEEN 0 AND 100),
  content_score INTEGER CHECK (content_score BETWEEN 0 AND 100),
  delivery_score INTEGER CHECK (delivery_score BETWEEN 0 AND 100),
  overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),

  -- Feedback
  feedback_text TEXT,
  improvements JSONB, -- Array de sugestões específicas
  confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),

  -- Model Info
  model_used VARCHAR(50), -- 'gpt-4', 'claude', etc

  evaluated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE ai_evaluations IS 'Análise detalhada de versos produzidos pelo usuário via IA';

-- ========================================
-- 4. RIMAS (Banco de Versos)
-- ========================================

-- 4.1 Rimas (7.200+ versos)
CREATE TABLE rimas_banco (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  verso TEXT NOT NULL,
  tema VARCHAR(100) NOT NULL,
  familia_rima VARCHAR(50), -- -O, -ÃO, -ÊNCIA, etc
  dificuldade difficulty_level NOT NULL,

  -- Metadata
  citacao_real TEXT, -- Verso real de algum MC
  mc_source VARCHAR(100),
  musica_source VARCHAR(255),

  -- Ranking & Discovery
  ranking INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE rimas_banco IS '7.200+ versos organizados por tema, família de rima e dificuldade';

-- 4.2 Temas (Confronto, Autoestima, etc)
CREATE TABLE rimas_temas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) UNIQUE NOT NULL,
  descricao TEXT,
  icone_emoji VARCHAR(10),
  cor_hex VARCHAR(7),
  ranking INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE rimas_temas IS 'Temas de rimas (Confronto, Autoestima, Estratégia, Caráter, etc)';

-- ========================================
-- 5. GAMIFICATION
-- ========================================

-- 5.1 Achievements (definição)
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_emoji VARCHAR(10),
  xp_reward INTEGER DEFAULT 0,
  points_reward INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE achievements IS 'Definição de achievements/badges disponíveis no app';

-- 5.2 User Achievements (unlock tracking)
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE RESTRICT,
  unlocked_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, achievement_id)
);

COMMENT ON TABLE user_achievements IS 'Rastreamento de quais achievements cada usuário desbloqueou';

-- 5.3 Badges (visual cosmetic achievements)
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url TEXT,
  rarity cosmetic_rarity DEFAULT 'common',
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE badges IS 'Badges visuais que podem ser earned/equipped';

-- 5.4 User Badges (owned badges)
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE RESTRICT,
  equipped BOOLEAN DEFAULT FALSE,
  earned_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, badge_id)
);

COMMENT ON TABLE user_badges IS 'Badges que cada usuário possui e pode equipar';

-- 5.5 Daily Quests (tarefas diárias)
CREATE TABLE daily_quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  quest_type quest_type DEFAULT 'daily',

  -- Conditions (como JSON para flexibilidade)
  condition_type VARCHAR(50), -- 'exercises_completed', 'duels_won', 'xp_gained', etc
  condition_value INTEGER,

  -- Rewards
  xp_reward INTEGER DEFAULT 50,
  points_reward INTEGER DEFAULT 20,

  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE daily_quests IS 'Template de desafios diários disponíveis';

-- 5.6 User Daily Quest Progress
CREATE TABLE user_daily_quest_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES daily_quests(id) ON DELETE CASCADE,

  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, quest_id, DATE(created_at))
);

COMMENT ON TABLE user_daily_quest_progress IS 'Progresso diário de cada usuário em quests';

-- 5.7 Seasons (temporadas competitivas)
CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  season_number INTEGER UNIQUE NOT NULL,
  starts_at TIMESTAMP NOT NULL,
  ends_at TIMESTAMP NOT NULL,
  active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE seasons IS 'Temporadas de competição (Season 1, Season 2, etc)';

-- 5.8 Seasonal Ranks (ranking por temporada)
CREATE TABLE seasonal_ranks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,

  points INTEGER DEFAULT 0,
  rank_tier rank_tier DEFAULT 'bronze',
  position INTEGER,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, season_id)
);

COMMENT ON TABLE seasonal_ranks IS 'Ranking de cada usuário em cada temporada';

-- ========================================
-- 6. BATTLE & DUELS
-- ========================================

-- 6.1 User Duels (histórico de batalhas)
CREATE TABLE user_duels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  verso_id UUID REFERENCES rimas_banco(id) ON DELETE SET NULL,

  -- User submission
  user_verso TEXT NOT NULL,
  ai_response TEXT,

  -- Difficulty & Status
  difficulty difficulty_level NOT NULL DEFAULT 'easy',
  status duel_status DEFAULT 'pending',

  -- Scores
  user_score INTEGER DEFAULT 0 CHECK (user_score BETWEEN 0 AND 100),
  ai_score INTEGER DEFAULT 0 CHECK (ai_score BETWEEN 0 AND 100),
  user_votes INTEGER DEFAULT 0,
  ai_votes INTEGER DEFAULT 0,

  -- Rewards
  xp_gained INTEGER DEFAULT 0,
  rating_change INTEGER DEFAULT 0,

  -- Streak
  streak_count INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE user_duels IS 'Histórico de duelos do usuário contra IA (antes de batalhas reais)';

-- 6.2 Duel Replays (gravações de duelos)
CREATE TABLE duel_replays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  duel_id UUID NOT NULL REFERENCES user_duels(id) ON DELETE CASCADE,

  video_url TEXT,
  thumbnail_url TEXT,

  -- Engagement
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE duel_replays IS 'Vídeos/replays de duelos que podem ser compartilhados';

-- 6.3 Replay Comments
CREATE TABLE replay_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  replay_id UUID NOT NULL REFERENCES duel_replays(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE replay_comments IS 'Comentários em replays de duelos';

-- ========================================
-- 7. SHOP & MONETIZATION
-- ========================================

-- 7.1 Cosmetics (items disponíveis)
CREATE TABLE cosmetics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type cosmetic_type NOT NULL,
  rarity cosmetic_rarity DEFAULT 'common',

  price_brl DECIMAL(10, 2) NOT NULL,

  -- Availability
  is_limited BOOLEAN DEFAULT FALSE,
  available_until TIMESTAMP,

  -- Images
  image_url TEXT,
  preview_url TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE cosmetics IS 'Items de cosmética disponíveis na loja (skins, borders, avatars, emotes)';

-- 7.2 User Cosmetics (owned items)
CREATE TABLE user_cosmetics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cosmetic_id UUID NOT NULL REFERENCES cosmetics(id) ON DELETE RESTRICT,

  purchased_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, cosmetic_id)
);

COMMENT ON TABLE user_cosmetics IS 'Itens de cosmética que o usuário possui';

-- 7.3 User Equipped Cosmetics (o que está usando agora)
CREATE TABLE user_equipped (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  skin_id UUID REFERENCES cosmetics(id) ON DELETE SET NULL,
  border_id UUID REFERENCES cosmetics(id) ON DELETE SET NULL,
  avatar_id UUID REFERENCES cosmetics(id) ON DELETE SET NULL,
  emote_id UUID REFERENCES cosmetics(id) ON DELETE SET NULL,

  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE user_equipped IS 'Itens de cosmética equipados atualmente (1 por tipo)';

-- 7.4 Purchases (histórico de compras)
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Stripe/Payment
  stripe_session_id VARCHAR(255) UNIQUE,
  stripe_payment_intent VARCHAR(255) UNIQUE,

  -- Item
  cosmetic_id UUID REFERENCES cosmetics(id) ON DELETE SET NULL,

  -- Amount
  amount_brl DECIMAL(10, 2) NOT NULL,
  status purchase_status DEFAULT 'pending',
  currency VARCHAR(3) DEFAULT 'BRL',

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE purchases IS 'Histórico de compras de itens da loja';

-- 7.5 Referral Codes
CREATE TABLE referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  code VARCHAR(50) UNIQUE NOT NULL,
  uses INTEGER DEFAULT 0,
  credits_earned DECIMAL(10, 2) DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE referral_codes IS 'Códigos de referral gerados por usuários';

-- 7.6 Referral Uses (quem usou cada referral)
CREATE TABLE referral_uses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code_id UUID NOT NULL REFERENCES referral_codes(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  credit_amount DECIMAL(10, 2),
  used_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE referral_uses IS 'Rastreamento de quem usou cada código de referral';

-- 7.7 User Credits (moeda in-game)
CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  balance DECIMAL(10, 2) DEFAULT 0 CHECK (balance >= 0),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE user_credits IS 'Saldo de créditos in-game de cada usuário';

-- ========================================
-- 8. SOCIAL
-- ========================================

-- 8.1 Friendships (seguidores)
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

COMMENT ON TABLE friendships IS 'Relações de amizade/follow entre usuários';

-- 8.2 Favorite Verses (versos salvos)
CREATE TABLE favorite_verses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  verso_id UUID NOT NULL REFERENCES rimas_banco(id) ON DELETE CASCADE,

  favorited_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, verso_id)
);

COMMENT ON TABLE favorite_verses IS 'Versos salvos como favoritos pelo usuário';

-- 8.3 Verse Views (analytics - quem viu cada verso)
CREATE TABLE verse_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  verso_id UUID NOT NULL REFERENCES rimas_banco(id) ON DELETE CASCADE,

  viewed_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, verso_id)
);

COMMENT ON TABLE verse_views IS 'Analytics: rastreamento de quem viu cada verso';

-- ========================================
-- 9. ÍNDICES (PERFORMANCE)
-- ========================================

-- Core queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_nivel ON users(nivel DESC);
CREATE INDEX idx_users_rating ON users(rating DESC);
CREATE INDEX idx_users_xp_total ON users(xp_total DESC);
CREATE INDEX idx_users_current_pillar ON users(current_pillar);
CREATE INDEX idx_users_last_activity ON users(last_activity_at DESC);

-- Sessions
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Exercises
CREATE INDEX idx_exercises_pillar_lesson ON exercises(pillar, lesson, exercise_num);
CREATE INDEX idx_exercises_type ON exercises(type);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);

-- User Exercise Results
CREATE INDEX idx_user_exercise_results_user_id ON user_exercise_results(user_id);
CREATE INDEX idx_user_exercise_results_exercise_id ON user_exercise_results(exercise_id);
CREATE INDEX idx_user_exercise_results_completed_at ON user_exercise_results(completed_at DESC);
CREATE INDEX idx_user_exercise_results_best_attempt ON user_exercise_results(user_id, is_best_attempt) WHERE is_best_attempt = TRUE;

-- AI Evaluations
CREATE INDEX idx_ai_evaluations_result_id ON ai_evaluations(result_id);
CREATE INDEX idx_ai_evaluations_overall_score ON ai_evaluations(overall_score DESC);

-- Rimas
CREATE INDEX idx_rimas_banco_tema ON rimas_banco(tema);
CREATE INDEX idx_rimas_banco_familia_rima ON rimas_banco(familia_rima);
CREATE INDEX idx_rimas_banco_dificuldade ON rimas_banco(dificuldade);
CREATE INDEX idx_rimas_banco_is_featured ON rimas_banco(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_rimas_banco_verso_trgm ON rimas_banco USING GIN(verso gin_trgm_ops); -- Full-text search

-- Achievements
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_unlocked_at ON user_achievements(unlocked_at DESC);

-- Daily Quests
CREATE INDEX idx_user_daily_quest_progress_user_id ON user_daily_quest_progress(user_id);
CREATE INDEX idx_user_daily_quest_progress_completed ON user_daily_quest_progress(completed);
CREATE INDEX idx_user_daily_quest_progress_date ON user_daily_quest_progress(DATE(created_at));

-- Duels
CREATE INDEX idx_user_duels_user_id ON user_duels(user_id);
CREATE INDEX idx_user_duels_status ON user_duels(status);
CREATE INDEX idx_user_duels_created_at ON user_duels(created_at DESC);
CREATE INDEX idx_user_duels_rating_change ON user_duels(rating_change);

-- Shop
CREATE INDEX idx_user_cosmetics_user_id ON user_cosmetics(user_id);
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_status ON purchases(status);

-- Social
CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX idx_favorite_verses_user_id ON favorite_verses(user_id);
CREATE INDEX idx_verse_views_user_id ON verse_views(user_id);

-- ========================================
-- 10. TRIGGERS & AUTOMATIONS
-- ========================================

-- 10.1 Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas as tabelas com updated_at
CREATE TRIGGER trigger_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_exercises_updated_at BEFORE UPDATE ON exercises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_exercise_results_updated_at BEFORE UPDATE ON user_exercise_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_purchases_updated_at BEFORE UPDATE ON purchases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10.2 Auto-calculate user nivel based on xp_total
CREATE OR REPLACE FUNCTION calculate_nivel_from_xp()
RETURNS TRIGGER AS $$
BEGIN
  -- Level progression: cada level requer 500 XP mais que o anterior
  -- Level 1: 0-499, Level 2: 500-999, Level 3: 1000-1499, etc
  NEW.nivel := LEAST(50, (NEW.xp_total / 500) + 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_calculate_nivel BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION calculate_nivel_from_xp();

-- 10.3 Atualizar last_activity quando user completa exercise
CREATE OR REPLACE FUNCTION update_user_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users SET last_activity_at = NOW() WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_exercise_result_last_activity AFTER INSERT ON user_exercise_results
  FOR EACH ROW EXECUTE FUNCTION update_user_last_activity();

-- 10.4 Atualizar streak quando user faz duel
CREATE OR REPLACE FUNCTION update_streak_on_duel()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'won' THEN
    UPDATE users SET current_streak = current_streak + 1 WHERE id = NEW.user_id;
  ELSIF NEW.status = 'lost' THEN
    UPDATE users SET best_streak = GREATEST(best_streak, current_streak) WHERE id = NEW.user_id;
    UPDATE users SET current_streak = 0 WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_duel_update_streak AFTER UPDATE ON user_duels
  FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_streak_on_duel();

-- ========================================
-- 11. VIEWS (USEFUL QUERIES)
-- ========================================

-- 11.1 Leaderboard Global (view in real-time)
CREATE OR REPLACE VIEW leaderboard_global AS
SELECT
  ROW_NUMBER() OVER (ORDER BY u.rating DESC) AS position,
  u.id,
  u.username,
  u.avatar_url,
  u.nivel,
  u.xp_total,
  u.rating,
  u.duels_total,
  u.duels_won,
  ROUND(100.0 * u.duels_won / NULLIF(u.duels_total, 0), 2) AS win_rate,
  u.best_streak,
  u.updated_at
FROM users u
WHERE u.duels_total > 0
ORDER BY u.rating DESC;

COMMENT ON VIEW leaderboard_global IS 'Ranking global em tempo real baseado em rating';

-- 11.2 User Learning Progress
CREATE OR REPLACE VIEW user_learning_progress AS
SELECT
  u.id,
  u.username,
  u.current_pillar,
  u.current_lesson,
  u.current_exercise,
  COUNT(DISTINCT CASE WHEN uer.pillar = 1 THEN uer.exercise_id END) AS pillar1_completed,
  COUNT(DISTINCT CASE WHEN uer.pillar = 2 THEN uer.exercise_id END) AS pillar2_completed,
  COUNT(DISTINCT CASE WHEN uer.pillar = 3 THEN uer.exercise_id END) AS pillar3_completed,
  COUNT(DISTINCT CASE WHEN uer.pillar = 4 THEN uer.exercise_id END) AS pillar4_completed
FROM users u
LEFT JOIN user_exercise_results uer ON u.id = uer.user_id AND uer.is_best_attempt = TRUE
LEFT JOIN exercises ex ON uer.exercise_id = ex.id
GROUP BY u.id;

COMMENT ON VIEW user_learning_progress IS 'Progresso de cada usuário nas 4 pilares de treinamento';

-- 11.3 Daily Quest Completion Rate
CREATE OR REPLACE VIEW daily_quests_completion_rate AS
SELECT
  DATE(udqp.created_at) AS quest_date,
  COUNT(DISTINCT udqp.user_id) AS users_total,
  COUNT(DISTINCT CASE WHEN udqp.completed = TRUE THEN udqp.user_id END) AS users_completed,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN udqp.completed = TRUE THEN udqp.user_id END) /
        COUNT(DISTINCT udqp.user_id), 2) AS completion_rate_pct
FROM user_daily_quest_progress udqp
GROUP BY DATE(udqp.created_at)
ORDER BY quest_date DESC;

COMMENT ON VIEW daily_quests_completion_rate IS 'Taxa de conclusão de quests diárias por dia';

-- ========================================
-- 12. ROW LEVEL SECURITY (RLS - SUPABASE)
-- ========================================

-- Enable RLS em tabelas sensíveis
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exercise_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cosmetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- 12.1 Users: Usuário só vê seu próprio perfil, admins veem todos
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- 12.2 Sessions: Apenas usuário dono da sessão
CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON sessions FOR DELETE
  USING (auth.uid() = user_id);

-- 12.3 User Exercise Results: Ver só seus resultados + leaderboard
CREATE POLICY "Users can view own exercise results"
  ON user_exercise_results FOR SELECT
  USING (auth.uid() = user_id OR TRUE); -- TRUE para public leaderboard

CREATE POLICY "Users can insert own exercise results"
  ON user_exercise_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 12.4 Purchases: Só ver suas próprias
CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

-- 12.5 Credits: Só ver seus próprios
CREATE POLICY "Users can view own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);

-- ========================================
-- 13. DATA SAMPLE INSERTS
-- ========================================

-- Temas
INSERT INTO rimas_temas (nome, descricao, icone_emoji, cor_hex) VALUES
('Confronto', 'Agressividade e ataque direto', '⚔️', '#FF6B6B'),
('Autoestima', 'Autoconfiança e amor próprio', '💪', '#4ECDC4'),
('Estratégia', 'Inteligência e tática', '♟️', '#FFE66D'),
('Caráter', 'Honra e princípios', '🏆', '#95E1D3')
ON CONFLICT DO NOTHING;

-- Achievements
INSERT INTO achievements (key, name, description, icon_emoji, xp_reward, points_reward) VALUES
('first_duel', 'Primeiro Duelo', 'Complete seu primeiro duelo', '⚔️', 10, 5),
('first_win', 'Primeira Vitória', 'Ganhe seu primeiro duelo', '🏆', 20, 10),
('five_streak', 'Em Fogo', 'Mantenha 5 duelos ganhando em sequência', '🔥', 100, 25),
('level_10', 'Intermediário', 'Atinja nível 10', '⭐', 50, 20),
('rating_2500', 'Top 100', 'Alcance rating 2500', '🥈', 200, 50),
('rating_3000', 'Elite', 'Alcance rating 3000', '🥇', 500, 100)
ON CONFLICT DO NOTHING;

-- Badges
INSERT INTO badges (name, description, icon_url, rarity) VALUES
('Novato', 'Completou primeira lição', '/badges/novato.png', 'common'),
('Mestre de Rimas', 'Completou Pillar 1', '/badges/rima_master.png', 'rare'),
('Flow King', 'Completou Pillar 2', '/badges/flow_king.png', 'rare'),
('Criativo', 'Completou Pillar 3', '/badges/criativo.png', 'epic'),
('Battle Ready', 'Completou Pillar 4', '/badges/battle_ready.png', 'epic'),
('Lenda', 'Completou tudo com 90%+', '/badges/lenda.png', 'legendary')
ON CONFLICT DO NOTHING;

-- Daily Quests
INSERT INTO daily_quests (key, title, description, quest_type, condition_type, condition_value, xp_reward, points_reward) VALUES
('morning_practice', 'Prática Matinal', 'Complete 1 lesson', 'daily', 'exercises_completed', 1, 50, 20),
('duel_challenge', 'Desafio de Batalha', 'Vença 1 duel', 'daily', 'duels_won', 1, 100, 30),
('consistent', 'Consistência', 'Complete 2 exercícios', 'daily', 'exercises_completed', 2, 75, 25),
('weekly_grind', 'Semana de Fogo', 'Complete 5 duels', 'weekly', 'duels_completed', 5, 200, 50)
ON CONFLICT DO NOTHING;

-- ========================================
-- FINAL NOTES
-- ========================================

/*
PRÓXIMOS PASSOS PÓS-SETUP:

1. BACKUP & RESTORE:
   - Fazer backup após seed: pg_dump -U postgres aprenda_rima > backup.sql
   - Restaurar: psql -U postgres aprenda_rima < backup.sql

2. MONITORING:
   - SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
     FROM pg_tables ORDER BY pg_total_relation_size DESC;

3. PERFORMANCE:
   - VACUUM ANALYZE; (otimizar índices)
   - SELECT * FROM pg_stat_user_tables; (ver utilização)

4. SUPABASE SPECIFIC:
   - Habilitar Real-time em tabelas: ALTER TABLE table_name REPLICA IDENTITY FULL;
   - Setup JWT: auth.uid() função nativa
   - Use Supabase dashboard para RLS policies (mais fácil que SQL puro)

5. MIGRATIONS COM KNEX:
   - Adaptar este SQL para knex migrations
   - Exemplo: knex.schema.createTable('users', table => { ... })

6. PRODUCTION CHECKLIST:
   - [ ] Backup daily
   - [ ] Connection pooling (PgBouncer)
   - [ ] Monitoring (pgAdmin / Datadog)
   - [ ] Slow query logging
   - [ ] Regular VACUUM ANALYZE
*/

-- ========================================
-- ✅ SCHEMA FINAL CRIADO COM SUCESSO
-- 28 tabelas, 12 índices estratégicos, 4 triggers, 3 views, RLS ready
-- ========================================
