import { supabase } from '@/lib/supabase';
import type { ChecklistItem } from '@/types';

export const ChecklistService = {
  async getByFormato(formato: string): Promise<ChecklistItem[]> {
    const { data, error } = await supabase
      .from('checklist_itens')
      .select('*')
      .eq('formato', formato)
      .eq('is_active', true)
      .order('fase')
      .order('ordem');

    if (error) throw error;
    return data || [];
  },

  async getByFase(formato: string, fase: string): Promise<ChecklistItem[]> {
    const { data, error } = await supabase
      .from('checklist_itens')
      .select('*')
      .eq('formato', formato)
      .eq('fase', fase)
      .eq('is_active', true)
      .order('ordem');

    if (error) throw error;
    return data || [];
  },

  async salvarRespostas(postpackId: string, respostas: { itemId: string; marcado: boolean }[]): Promise<void> {
    const inserts = respostas.map(r => ({
      postpack_id: postpackId,
      checklist_item_id: r.itemId,
      marcado: r.marcado,
      marcado_at: r.marcado ? new Date().toISOString() : null,
    }));

    const { error } = await supabase
      .from('postpack_checklist')
      .upsert(inserts, { onConflict: 'postpack_id,checklist_item_id' });

    if (error) throw error;
  },
};
