import { supabase } from '@/lib/supabase';
import type { Gancho } from '@/types';

export const GanchosService = {
  async getAll(filters?: {
    tipo?: string;
    procedimento?: string;
    objetivo?: string;
    limite?: number;
  }): Promise<Gancho[]> {
    let query = supabase
      .from('ganchos')
      .select('*')
      .eq('is_active', true)
      .order('vezes_usado', { ascending: false });

    if (filters?.tipo) {
      query = query.eq('tipo', filters.tipo);
    }
    if (filters?.procedimento) {
      query = query.eq('procedimento_id', filters.procedimento);
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

  async getByTipo(tipo: string): Promise<Gancho[]> {
    const { data, error } = await supabase
      .from('ganchos')
      .select('*')
      .eq('tipo', tipo)
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  },

  async getTiposDisponiveis(): Promise<string[]> {
    const { data, error } = await supabase
      .from('ganchos')
      .select('tipo')
      .eq('is_active', true);

    if (error) throw error;
    return [...new Set(data?.map(g => g.tipo) || [])];
  },
};
