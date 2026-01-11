import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: Request) {
  const { postpack_id } = await request.json()

  const { data, error } = await supabase
    .from('postpack_workflow')
    .insert({
      postpack_id,
      status: 'fase_1',
      fase_1_checklist: []
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
