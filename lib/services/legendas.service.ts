import { supabase } from '@/lib/supabase';
import type { Legenda } from '@/types';

export const LegendasService = {
  async getAll(filters?: {
    tipo?: string;
    categoria?: string;
    pilar?: string;
    limite?: number;
  }): Promise<Legenda[]> {
    let query = supabase
      .from('legendas')
      .select('*')
      .eq('is_active', true)
      .order('vezes_usado', { ascending: false });

    if (filters?.tipo) {
      query = query.eq('tipo', filters.tipo);
    }
    if (filters?.categoria) {
      query = query.eq('categoria', filters.categoria);
    }
    if (filters?.pilar) {
      query = query.eq('pilar', filters.pilar);
    }
    if (filters?.limite) {
      query = query.limit(filters.limite);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getByTipo(tipo: 'abertura' | 'meio_eeat' | 'meio_viral' | 'meio_emocional' | 'fechamento'): Promise<Legenda[]> {
    const { data, error } = await supabase
      .from('legendas')
      .select('*')
      .eq('tipo', tipo)
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  },

  async getTiposDisponiveis(): Promise<{ tipo: string; count: number }[]> {
    const { data, error } = await supabase
      .from('legendas')
      .select('tipo')
      .eq('is_active', true);

    if (error) throw error;

    const counts = (data || []).reduce((acc, leg) => {
      acc[leg.tipo] = (acc[leg.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([tipo, count]) => ({ tipo, count }));
  },
};
