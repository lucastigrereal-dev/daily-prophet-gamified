import { NextRequest, NextResponse } from 'next/server';
import { supabaseWorkflow } from '@/lib/supabase-workflow';
import { supabase } from '@/lib/supabase';
import { CreateWorkflowInput } from '@/types/workflow';

// GET /api/workflow - List all workflows
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    const rows = await supabaseWorkflow.selectMany({
      status: status ? [status as any] : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });

    const workflows = rows.map(row => supabaseWorkflow.rowToWorkflow(row));

    return NextResponse.json(workflows);
  } catch (error: any) {
    console.error('[API] Error listing workflows:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao listar workflows' },
      { status: 500 }
    );
  }
}

// POST /api/workflow - Create new workflow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postpack_id, created_by } = body as CreateWorkflowInput;

    if (!postpack_id) {
      return NextResponse.json(
        { error: 'postpack_id é obrigatório' },
        { status: 400 }
      );
    }

    // Verify postpack exists
    const { data: postpack, error: postpackError } = await supabase
      .from('postpacks')
      .select('*')
      .eq('id', postpack_id)
      .single();

    if (postpackError || !postpack) {
      return NextResponse.json(
        { error: 'Postpack não encontrado' },
        { status: 404 }
      );
    }

    // Create workflow
    const row = await supabaseWorkflow.insert({
      postpack_id,
      created_by,
      status: 'composicao', // Start with composition
      composicao: {},
      fase_1_status: 'pendente',
      fase_2_status: 'pendente',
      fase_3_status: 'pendente',
      fase_4_status: 'pendente',
      fase_5_status: 'pendente',
    });

    const workflow = supabaseWorkflow.rowToWorkflow(row);

    return NextResponse.json(workflow, { status: 201 });
  } catch (error: any) {
    console.error('[API] Error creating workflow:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao criar workflow' },
      { status: 500 }
    );
  }
}
