import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/content/hashtags - List hashtags
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const tipo = searchParams.get('tipo');
    const procedimento = searchParams.get('procedimento');
    const limit = searchParams.get('limit') || '20';

    let query = supabase
      .from('hashtags')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (search) {
      query = query.ilike('tags', `%${search}%`);
    }

    if (tipo) {
      query = query.ilike('tipo_post', `%${tipo}%`);
    }

    if (procedimento) {
      query = query.ilike('procedimento', `%${procedimento}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('[API] Error listing hashtags:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao listar hashtags' },
      { status: 500 }
    );
  }
}
