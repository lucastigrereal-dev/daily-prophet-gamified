import { supabase } from '@/lib/supabase';
import type { Ideia } from '@/types';

export const IdeiasService = {
  async getAll(filters?: {
    formato?: string;
    objetivo?: string;
    procedimento?: string;
    limite?: number;
  }): Promise<Ideia[]> {
    let query = supabase
      .from('ideias')
      .select('*')
      .eq('is_active', true)
      .order('vezes_usado', { ascending: false });

    if (filters?.formato) {
      query = query.eq('formato_recomendado', filters.formato);
    }
    if (filters?.objetivo) {
      query = query.eq('objetivo_id', filters.objetivo);
    }
    if (filters?.procedimento) {
      query = query.eq('procedimento_id', filters.procedimento);
    }
    if (filters?.limite) {
      query = query.limit(filters.limite);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Ideia | null> {
    const { data, error } = await supabase
      .from('ideias')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async incrementarUso(id: string): Promise<void> {
    const { error } = await supabase.rpc('incrementar_uso_ideia', { ideia_id: id });
    if (error) throw error;
  },
};
