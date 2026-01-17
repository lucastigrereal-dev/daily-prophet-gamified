import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/postpacks - List all postpacks or search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const format = searchParams.get('format');
    const type = searchParams.get('type');
    const limit = searchParams.get('limit') || '50';

    let query = supabase
      .from('postpacks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (format) {
      query = query.ilike('format', `%${format}%`);
    }

    if (type) {
      query = query.ilike('tipo_post', `%${type}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('[API] Error listing postpacks:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao listar postpacks' },
      { status: 500 }
    );
  }
}

// POST /api/postpacks - Create new postpack
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      objective,
      format,
      tipo_post,
      procedimento,
      content,
    } = body;

    if (!title || !format) {
      return NextResponse.json(
        { error: 'title e format são obrigatórios' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('postpacks')
      .insert([
        {
          title,
          objective: objective || '',
          format,
          tipo_post: tipo_post || 'educativo',
          procedimento: procedimento || '',
          content: content || {},
          status: 'draft',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('[API] Error creating postpack:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao criar postpack' },
      { status: 500 }
    );
  }
}
