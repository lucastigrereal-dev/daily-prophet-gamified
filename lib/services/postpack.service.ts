import { supabase } from '@/lib/supabase';
import type { PostPack, PostPackMetricas } from '@/types';

export const PostPackService = {
  async create(postpack: Partial<PostPack>): Promise<PostPack> {
    const { data, error } = await supabase
      .from('postpacks')
      .insert([{
        ...postpack,
        status: 'rascunho',
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<PostPack>): Promise<PostPack> {
    const { data, error } = await supabase
      .from('postpacks')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<PostPack | null> {
    const { data, error } = await supabase
      .from('postpacks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getAll(filters?: {
    status?: string;
    limite?: number;
  }): Promise<PostPack[]> {
    let query = supabase
      .from('postpacks')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.limite) {
      query = query.limit(filters.limite);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async marcarPublicado(id: string, instagramUrl: string): Promise<void> {
    const { error } = await supabase
      .from('postpacks')
      .update({
        status: 'publicado',
        published_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  },

  async salvarMetricas(postpackId: string, metricas: Partial<PostPackMetricas>): Promise<void> {
    const { error } = await supabase
      .from('postpack_metricas')
      .insert([{
        postpack_id: postpackId,
        ...metricas,
        created_at: new Date().toISOString(),
      }]);

    if (error) throw error;
  },
};
