import { createClient } from '@/services/supabase/server';
import { NextResponse } from 'next/server';

// This file will handle PATCH and DELETE for a specific product

// PATCH (update) a product
export async function PATCH(request: Request, { params }: { params: { produtoId: string } }) {
  const supabase = createClient();
  const { produtoId } = params;
  const { nome, descricao, preco, imagem_url, disponivel } = await request.json();

  const { data, error } = await supabase
    .from('produtos')
    .update({ nome, descricao, preco, imagem_url, disponivel })
    .eq('id', produtoId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE a product
export async function DELETE(request: Request, { params }: { params: { produtoId: string } }) {
  const supabase = createClient();
  const { produtoId } = params;

  const { error } = await supabase.from('produtos').delete().eq('id', produtoId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new Response(null, { status: 204 });
}
