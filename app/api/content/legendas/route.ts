import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/content/legendas - List legendas (captions)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const tipo = searchParams.get('tipo');
    const procedimento = searchParams.get('procedimento');
    const limit = searchParams.get('limit') || '50';

    let query = supabase
      .from('legendas')
      .select('id, texto, tipo_post, procedimento, pilar, objetivo, ativo, created_at, updated_at')
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

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      data: data || [],
      count: data?.length || 0,
      filters: { search, tipo, procedimento }
    });
  } catch (error: any) {
    console.error('[API] Error listing legendas:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao listar legendas', details: error },
      { status: 500 }
    );
  }
}
