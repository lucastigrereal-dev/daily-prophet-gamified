import { supabase } from '@/lib/supabase';
import type { Hashtag, HashtagCombo } from '@/types';

export const HashtagsService = {
  async getAll(filters?: {
    categoria?: string;
    alcance?: string;
    limite?: number;
  }): Promise<Hashtag[]> {
    let query = supabase
      .from('hashtags')
      .select('*')
      .eq('is_active', true)
      .eq('is_shadowbanned', false);

    if (filters?.categoria) {
      query = query.eq('categoria', filters.categoria);
    }
    if (filters?.alcance) {
      query = query.eq('alcance', filters.alcance);
    }
    if (filters?.limite) {
      query = query.limit(filters.limite);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getByAlcance(alcance: 'pequena' | 'media' | 'grande'): Promise<Hashtag[]> {
    const { data, error } = await supabase
      .from('hashtags')
      .select('*')
      .eq('alcance', alcance)
      .eq('is_active', true)
      .eq('is_shadowbanned', false);

    if (error) throw error;
    return data || [];
  },

  async getCombos(filters?: {
    procedimento?: string;
    objetivo?: string;
  }): Promise<HashtagCombo[]> {
    let query = supabase
      .from('hashtag_combos')
      .select('*')
      .eq('is_active', true);

    if (filters?.procedimento) {
      query = query.eq('procedimento_id', filters.procedimento);
    }
    if (filters?.objetivo) {
      query = query.eq('objetivo_id', filters.objetivo);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
};
