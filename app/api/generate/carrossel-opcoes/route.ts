import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface CarrosselRequest {
  tema: string;
  tipo?: string;
  procedimento?: string;
  quantidade?: number;
}

// POST /api/generate/carrossel-opcoes - Generate carrossel text options
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CarrosselRequest;
    const { tema, tipo = 'educativo', procedimento = '', quantidade = 3 } = body;

    if (!tema || tema.trim().length === 0) {
      return NextResponse.json(
        { error: 'Tema é obrigatório' },
        { status: 400 }
      );
    }

    // Fetch example posts from database that match the theme
    let query = supabase
      .from('posts_exemplo')
      .select('*')
      .ilike('content', `%${tema}%`)
      .limit(quantidade);

    if (tipo) {
      query = query.ilike('tipo_post', `%${tipo}%`);
    }

    if (procedimento) {
      query = query.ilike('procedimento', `%${procedimento}%`);
    }

    const { data: examples, error: examplesError } = await query;

    if (examplesError) throw examplesError;

    // Also fetch legendas that might be relevant
    const { data: legendas, error: legendasError } = await supabase
      .from('legendas')
      .select('*')
      .ilike('texto', `%${tema}%`)
      .limit(quantidade);

    if (legendasError) throw legendasError;

    // Generate options combining examples and legendas
    const opcoes = [
      ...(examples || [])
        .slice(0, Math.ceil(quantidade / 2))
        .map(ex => ({
          id: ex.id,
          titulo: ex.id.substring(0, 20),
          tipo: 'exemplo',
          conteudo: ex.content || '',
        })),
      ...(legendas || [])
        .slice(0, Math.floor(quantidade / 2))
        .map(leg => ({
          id: leg.id,
          titulo: leg.id.substring(0, 20),
          tipo: 'legenda',
          conteudo: leg.texto || '',
        })),
    ];

    // If we have fewer options than requested, return what we have
    const result = {
      tema,
      quantidade_gerada: opcoes.length,
      opcoes,
      mensagem:
        opcoes.length > 0
          ? `${opcoes.length} opções geradas para o tema "${tema}"`
          : `Nenhuma opção encontrada para o tema "${tema}". Tente outro tema.`,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API] Error generating carrossel options:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar opções' },
      { status: 500 }
    );
  }
}
