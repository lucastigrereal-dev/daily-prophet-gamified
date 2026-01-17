import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/ideias - List postpacks (base ideas)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const formato = searchParams.get('formato');
    const tipo_post = searchParams.get('tipo_post');
    const procedimento = searchParams.get('procedimento');
    const limit = searchParams.get('limit') || '100';

    let query = supabase
      .from('postpacks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    // Apply filters
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (formato) {
      query = query.ilike('format', `%${formato}%`);
    }

    if (tipo_post) {
      query = query.ilike('tipo_post', `%${tipo_post}%`);
    }

    if (procedimento) {
      query = query.ilike('procedimento', `%${procedimento}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      total: data?.length || 0,
      ideias: data || [],
    });
  } catch (error: any) {
    console.error('[API] Error fetching ideias:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao listar ideias' },
      { status: 500 }
    );
  }
}
