import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/content/ganchos - List ganchos (hooks)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const tipo = searchParams.get('tipo');
    const procedimento = searchParams.get('procedimento');
    const pilar = searchParams.get('pilar');
    const objetivo = searchParams.get('objetivo');
    const limit = searchParams.get('limit') || '50';

    let query = supabase
      .from('ganchos')
      .select('id, texto, tipo_legenda, tipo_post, procedimento, pilar, objetivo, ativo, uso_count, created_at, updated_at')
      .eq('ativo', true)
      .eq('tipo_legenda', 'gancho')
      .order('uso_count', { ascending: false })
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
      filters: { search, tipo, procedimento, pilar, objetivo }
    });
  } catch (error: any) {
    console.error('[API] Error listing ganchos:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao listar ganchos', details: error },
      { status: 500 }
    );
  }
}
