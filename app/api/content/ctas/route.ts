import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/content/ctas - List CTAs (call-to-actions)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const tipo = searchParams.get('tipo');
    const procedimento = searchParams.get('procedimento');
    const categoria = searchParams.get('categoria');
    const pilar = searchParams.get('pilar');
    const objetivo = searchParams.get('objetivo');
    const limit = searchParams.get('limit') || '100';

    let query = supabase
      .from('ctas')
      .select('id, texto, categoria, tipo_post, pilar, objetivo, ativo, created_at, updated_at')
      .eq('ativo', true)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (search) {
      query = query.ilike('texto', `%${search}%`);
    }

    if (tipo) {
      query = query.ilike('tipo_post', `%${tipo}%`);
    }

    if (procedimento) {
      query = query.ilike('procedimento', `%${procedimento}%`);
    }

    if (categoria) {
      query = query.ilike('categoria', `%${categoria}%`);
    }

    if (pilar) {
      query = query.ilike('pilar', `%${pilar}%`);
    }

    if (objetivo) {
      query = query.ilike('objetivo', `%${objetivo}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      data: data || [],
      count: data?.length || 0,
      filters: { search, tipo, procedimento, categoria, pilar, objetivo }
    });
  } catch (error: any) {
    console.error('[API] Error listing CTAs:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao listar CTAs', details: error },
      { status: 500 }
    );
  }
}
