import { createClient } from '@/services/supabase/server';
import { NextResponse } from 'next/server';

// This file will handle PATCH and DELETE for a specific category

// PATCH (update) a category
export async function PATCH(request: Request, { params }: { params: { categoriaId: string } }) {
  const supabase = createClient();
  const { categoriaId } = params;
  const { nome, ordem } = await request.json();

  const { data, error } = await supabase
    .from('categorias')
    .update({ nome, ordem })
    .eq('id', categoriaId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE a category
export async function DELETE(request: Request, { params }: { params: { categoriaId: string } }) {
  const supabase = createClient();
  const { categoriaId } = params;

  const { error } = await supabase.from('categorias').delete().eq('id', categoriaId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new Response(null, { status: 204 });
}
