import { supabase } from '@/lib/supabase';
import type { CTA } from '@/types';

export const CTAsService = {
  async getAll(filters?: {
    categoria?: string;
    intensidade?: string;
    objetivo?: string;
    limite?: number;
  }): Promise<CTA[]> {
    let query = supabase
      .from('ctas')
      .select('*')
      .eq('is_active', true)
      .order('vezes_usado', { ascending: false });

    if (filters?.categoria) {
      query = query.eq('categoria', filters.categoria);
    }
    if (filters?.intensidade) {
      query = query.eq('intensidade', filters.intensidade);
    }
    if (filters?.objetivo) {
      query = query.eq('objetivo_id', filters.objetivo);
    }
    if (filters?.limite) {
      query = query.limit(filters.limite);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getByCategoria(categoria: string): Promise<CTA[]> {
    const { data, error } = await supabase
      .from('ctas')
      .select('*')
      .eq('categoria', categoria)
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  },

  async getCategoriasDisponiveis(): Promise<{ categoria: string; count: number }[]> {
    const { data, error } = await supabase
      .from('ctas')
      .select('categoria')
      .eq('is_active', true);

    if (error) throw error;

    const counts = (data || []).reduce((acc, cta) => {
      acc[cta.categoria] = (acc[cta.categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([categoria, count]) => ({ categoria, count }));
  },
};
