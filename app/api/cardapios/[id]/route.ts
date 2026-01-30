import { createClient } from '@/services/supabase/server';
import { NextResponse } from 'next/server';

// GET a single menu by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { id } = params;

  const { data: cardapio, error } = await supabase
    .from('cardapios')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Cardápio não encontrado.' }, { status: 404 });
  }

  return NextResponse.json(cardapio);
}


// PATCH/PUT (update) a menu by ID
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { id } = params;
  const { nome, ativo } = await request.json();

  const { data, error } = await supabase
    .from('cardapios')
    .update({ nome, ativo })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE a menu by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { id } = params;

  const { error } = await supabase.from('cardapios').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new Response(null, { status: 204 }); // 204 No Content
}
