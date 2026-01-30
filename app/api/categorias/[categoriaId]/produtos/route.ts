import { createClient } from '@/services/supabase/server';
import { NextResponse } from 'next/server';

// GET all products for a specific category
export async function GET(request: Request, { params }: { params: { categoriaId: string } }) {
  const supabase = createClient();
  const { categoriaId } = params;

  const { data: produtos, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('categoria_id', categoriaId)
    .order('nome', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(produtos);
}

// POST a new product to a specific category
export async function POST(request: Request, { params }: { params: { categoriaId: string } }) {
  const supabase = createClient();
  const { categoriaId } = params;
  // Simplistic parsing of product data, assuming all fields are present
  const { nome, descricao, preco, imagem_url, disponivel } = await request.json();

  if (!nome || preco === undefined) {
    return NextResponse.json({ error: 'Nome e preço do produto são obrigatórios.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('produtos')
    .insert([{ nome, descricao, preco, imagem_url, disponivel, categoria_id: categoriaId }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
