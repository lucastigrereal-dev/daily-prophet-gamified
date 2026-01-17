import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface CSVRow {
  index: string;
  tipo_de_post: string;
  conteudo_resumo: string;
  headline: string;
  roteiro_reels: string;
  roteiro_carrossel: string;
  legenda_seo: string;
  cta: string;
  hacks: string;
}

// POST /api/import/csv - Import CSV data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { csvData } = body as { csvData: string };

    if (!csvData) {
      return NextResponse.json(
        { error: 'CSV data é obrigatório' },
        { status: 400 }
      );
    }

    // Parse CSV
    const rows = csvData.split('\n').slice(1); // Skip header
    const records = rows
      .filter(row => row.trim())
      .map((row, index) => {
        const cols = row.split(',');
        return {
          index: (index + 1).toString(),
          tipo_de_post: cols[1]?.trim() || '',
          conteudo_resumo: cols[2]?.trim() || '',
          headline: cols[3]?.trim() || '',
          roteiro_reels: cols[4]?.trim() || '',
          roteiro_carrossel: cols[5]?.trim() || '',
          legenda_seo: cols[6]?.trim() || '',
          cta: cols[7]?.trim() || '',
          hacks: cols[8]?.trim() || '',
        };
      });

    // Insert into posts_exemplo table
    const { data, error } = await supabase
      .from('posts_exemplo')
      .insert(
        records.map(r => ({
          id: `post_${r.index.padStart(3, '0')}`,
          tipo_post: r.tipo_de_post,
          content: JSON.stringify({
            conteudo_resumo: r.conteudo_resumo,
            headline: r.headline,
            roteiro_reels: r.roteiro_reels,
            roteiro_carrossel: r.roteiro_carrossel,
            legenda_seo: r.legenda_seo,
            cta: r.cta,
            hacks: r.hacks,
          }),
          created_at: new Date().toISOString(),
        }))
      )
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      imported: data?.length || 0,
      message: `${data?.length || 0} posts importados com sucesso`,
    });
  } catch (error: any) {
    console.error('[API] Error importing CSV:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao importar CSV' },
      { status: 500 }
    );
  }
}
