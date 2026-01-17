import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

const checklistTemplates = {
  composicao: {
    'script-review': { status: 'pendente', observacao: 'Revisar script do reel' },
    'tema-carrossel': { status: 'pendente', observacao: 'Definir tema do carrossel' },
    'estrategia-stories': { status: 'pendente', observacao: 'Planejar estratégia de stories' },
  },
  fase_1: {
    'roteiro-gravacao': { status: 'pendente', observacao: 'Preparar roteiro' },
    'selecao-musica': { status: 'pendente', observacao: 'Escolher música' },
    'preparacao-cenario': { status: 'pendente', observacao: 'Montar cenário' },
  },
  fase_2: {
    'edicao-reel': { status: 'pendente', observacao: 'Editar reel' },
    'adicionar-efeitos': { status: 'pendente', observacao: 'Adicionar efeitos' },
    'legenda-sync': { status: 'pendente', observacao: 'Sincronizar legendas' },
  },
  fase_3: {
    'revisar-qualidade': { status: 'pendente', observacao: 'Revisar qualidade' },
    'testar-audio': { status: 'pendente', observacao: 'Testar áudio' },
    'compatibilidade': { status: 'pendente', observacao: 'Verificar compatibilidade' },
  },
  fase_4: {
    'agendar-publicacao': { status: 'pendente', observacao: 'Agendar na plataforma' },
    'preparar-descricao': { status: 'pendente', observacao: 'Preparar descrição' },
    'definir-hashtags': { status: 'pendente', observacao: 'Definir hashtags' },
  },
  fase_5: {
    'monitorar-metricas': { status: 'pendente', observacao: 'Monitorar visualizações' },
    'engajamento': { status: 'pendente', observacao: 'Responder comentários' },
    'otimizacao': { status: 'pendente', observacao: 'Otimizar baseado em dados' },
  },
};

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check for seed password in header (optional security)
    const password = request.headers.get('x-seed-password');
    if (password && password !== process.env.SEED_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create test postpacks
    const testPostpacks = [
      {
        title: 'Dicas de Produtividade',
        name: 'productivity-tips',
        objective: 'Compartilhar técnicas de produtividade',
        format: 'reel',
        procedure: 'Gravar vídeo curto com dicas práticas',
      },
      {
        title: 'Receita Rápida',
        name: 'quick-recipe',
        objective: 'Ensinar receita fácil',
        format: 'carrossel',
        procedure: 'Criar carrossel com passos da receita',
      },
      {
        title: 'Motivação Diária',
        name: 'daily-motivation',
        objective: 'Inspirar seguidores',
        format: 'story',
        procedure: 'Conteúdo motivacional em stories',
      },
    ];

    const postpackIds: string[] = [];
    const { data: postpacks, error: ppError } = await supabase
      .from('postpacks')
      .insert(testPostpacks)
      .select('id');

    if (ppError) throw ppError;

    postpackIds.push(...(postpacks?.map(p => p.id) || []));

    // Create workflows for each postpack
    const statuses = ['composicao', 'fase_1', 'fase_2', 'fase_3', 'fase_4'];
    const workflows = [];

    for (let i = 0; i < postpackIds.length; i++) {
      const postpackId = postpackIds[i];
      const status = statuses[i % statuses.length];

      const workflowData = {
        postpack_id: postpackId,
        status,
        created_by: 'seed-test',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Fase statuses
        fase_1_status: ['fase_1', 'fase_2', 'fase_3', 'fase_4', 'fase_5'].includes(status)
          ? 'em_progresso'
          : 'pendente',
        fase_2_status: ['fase_2', 'fase_3', 'fase_4', 'fase_5'].includes(status)
          ? 'em_progresso'
          : 'pendente',
        fase_3_status: ['fase_3', 'fase_4', 'fase_5'].includes(status)
          ? 'em_progresso'
          : 'pendente',
        fase_4_status: ['fase_4', 'fase_5'].includes(status) ? 'em_progresso' : 'pendente',
        fase_5_status: status === 'fase_5' ? 'em_progresso' : 'pendente',
        // Checklists
        fase_1_checklist: checklistTemplates.fase_1,
        fase_2_checklist: checklistTemplates.fase_2,
        fase_3_checklist: checklistTemplates.fase_3,
        fase_4_checklist: checklistTemplates.fase_4,
        fase_5_checklist: checklistTemplates.fase_5,
      };

      workflows.push(workflowData);
    }

    const { data: createdWorkflows, error: wfError } = await supabase
      .from('postpack_workflow')
      .insert(workflows)
      .select('id, status');

    if (wfError) throw wfError;

    return NextResponse.json({
      success: true,
      message: 'Test data seeded successfully',
      postpacks: postpackIds.length,
      workflows: createdWorkflows?.length || 0,
    });
  } catch (error: any) {
    console.error('[API] Error seeding test data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to seed test data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'POST to /api/seed to create test data',
      note: 'This endpoint is for development/testing only'
    },
    { status: 200 }
  );
}
