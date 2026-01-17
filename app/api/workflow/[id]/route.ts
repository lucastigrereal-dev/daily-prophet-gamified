import { NextRequest, NextResponse } from 'next/server';
import { supabaseWorkflow } from '@/lib/supabase-workflow';
import type { PostpackWorkflowRow } from '@/types/workflow';

// GET /api/workflow/[id] - Fetch workflow by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const row = await supabaseWorkflow.selectById(id);

    if (!row) {
      return NextResponse.json(
        { error: 'Workflow não encontrado' },
        { status: 404 }
      );
    }

    const workflow = supabaseWorkflow.rowToWorkflow(row);
    return NextResponse.json(workflow);
  } catch (error: any) {
    console.error('[API] Error fetching workflow:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar workflow' },
      { status: 500 }
    );
  }
}

// PATCH /api/workflow/[id] - Update workflow
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Convert PostpackWorkflow updates back to PostpackWorkflowRow format
    const updates: Partial<PostpackWorkflowRow> = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    // Handle nested fase data
    if (body.fase_1) {
      updates.fase_1_status = body.fase_1.status;
      updates.fase_1_checklist = body.fase_1.checklist;
      updates.fase_1_started_at = body.fase_1.started_at;
      updates.fase_1_completed_at = body.fase_1.completed_at;
    }
    if (body.fase_2) {
      updates.fase_2_status = body.fase_2.status;
      updates.fase_2_checklist = body.fase_2.checklist;
      updates.fase_2_started_at = body.fase_2.started_at;
      updates.fase_2_completed_at = body.fase_2.completed_at;
      updates.fase_2_feedback = body.fase_2.feedback;
    }
    if (body.fase_3) {
      updates.fase_3_status = body.fase_3.status;
      updates.fase_3_checklist = body.fase_3.checklist;
      updates.fase_3_started_at = body.fase_3.started_at;
      updates.fase_3_completed_at = body.fase_3.completed_at;
    }
    if (body.fase_4) {
      updates.fase_4_status = body.fase_4.status;
      updates.fase_4_checklist = body.fase_4.checklist;
      updates.fase_4_started_at = body.fase_4.started_at;
      updates.fase_4_completed_at = body.fase_4.completed_at;
      updates.fase_4_published_url = body.fase_4.published_url;
      updates.fase_4_published_at = body.fase_4.published_at;
    }
    if (body.fase_5) {
      updates.fase_5_status = body.fase_5.status;
      updates.fase_5_checklist = body.fase_5.checklist;
      updates.fase_5_started_at = body.fase_5.started_at;
      updates.fase_5_completed_at = body.fase_5.completed_at;
    }

    const row = await supabaseWorkflow.update(id, updates);
    const workflow = supabaseWorkflow.rowToWorkflow(row);

    return NextResponse.json(workflow);
  } catch (error: any) {
    console.error('[API] Error updating workflow:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar workflow' },
      { status: 500 }
    );
  }
}
