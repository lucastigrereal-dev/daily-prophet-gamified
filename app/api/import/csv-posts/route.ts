import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper function to map "Tipo de Post" to objective
// Note: Constraint da tabela permite apenas 'autoridade'
function mapTipoPostToObjective(tipoPost: string): string {
  return 'autoridade';
}

// Helper function to infer pillar from content
function inferPillarFromContent(conteudo: string): string {
  const content = conteudo.toLowerCase();

  if (content.includes('íntima') || content.includes('intima')) return 'intimax';
  if (content.includes('face') || content.includes('facial') || content.includes('full face')) return 'fullface';
  if (content.includes('glúteo') || content.includes('gluteo') || content.includes('bumbum')) return 'gluteos';
  if (content.includes('seios') || content.includes('mama') || content.includes('busto')) return 'seios';
  if (content.includes('perna') || content.includes('celulite')) return 'pernas';
  if (content.includes('barriga') || content.includes('abdomen')) return 'abdomen';

  return 'geral'; // default
}

// Helper function to split headlines
function splitHeadlines(headlineStr: string): string[] {
  return headlineStr
    .split(';')
    .map(h => h.trim().replace(/^["']|["']$/g, '')) // Remove quotes
    .filter(h => h.length > 0)
    .slice(0, 5); // Max 5 headlines
}

// Helper function to split CTAs
function splitCTAs(ctaStr: string): string[] {
  return ctaStr
    .split(';')
    .map(c => c.trim().replace(/^["']|["']$/g, '')) // Remove quotes
    .filter(c => c.length > 0)
    .slice(0, 5); // Max 5 CTAs
}

// POST /api/import/csv-posts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { posts } = body;

    if (!Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum post fornecido' },
        { status: 400 }
      );
    }

    // Prepare data for insertion
    const processedPosts = posts.map((post: any) => {
      const headlines = splitHeadlines(post.headlines);
      const ctas = splitCTAs(post.ctas);

      return {
        title: headlines[0] || post.summary.substring(0, 100),
        summary: post.summary,
        objective: mapTipoPostToObjective(post.objective),
        pillar: post.pillar || inferPillarFromContent(post.summary),
        headlines: headlines,
        scriptreels: post.script_reels || '',
        scriptcarousel: post.script_carousel || '',
        captionseo: post.caption_seo || '',
        ctassuggested: ctas,
        hacks: post.hacks || '',
        sourcefile: post.source_file || 'planilha_de_postagens_grok.csv',
        status: 'active',
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString(),
      };
    });

    // Insert into Supabase
    const { data, error } = await supabase
      .from('ideas')
      .insert(processedPosts)
      .select();

    if (error) {
      console.error('[API] Supabase error:', error);
      return NextResponse.json(
        { error: `Erro ao importar: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${data?.length || 0} posts importados com sucesso`,
      count: data?.length || 0,
      data,
    });
  } catch (error: any) {
    console.error('[API] Error importing CSV posts:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar importação' },
      { status: 500 }
    );
  }
}
