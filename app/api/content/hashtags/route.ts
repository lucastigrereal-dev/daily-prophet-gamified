import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/content/hashtags - List hashtags
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const tipo = searchParams.get('tipo');
    const tema = searchParams.get('tema');
    const pilar = searchParams.get('pilar');
    const objetivo = searchParams.get('objetivo');
    const limit = searchParams.get('limit') || '150';

    let query = supabase
      .from('hashtags')
      .select('id, texto, tema, volume, tipo_post, pilar, objetivo, ativo, created_at, updated_at')
      .eq('ativo', true)
      .order('volume', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (search) {
      query = query.ilike('texto', `%${search}%`);
    }

    if (tipo) {
      query = query.ilike('tipo_post', `%${tipo}%`);
    }

    if (tema) {
      query = query.ilike('tema', `%${tema}%`);
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
      filters: { search, tipo, tema, pilar, objetivo }
    });
  } catch (error: any) {
    console.error('[API] Error listing hashtags:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao listar hashtags', details: error },
      { status: 500 }
    );
  }
}
