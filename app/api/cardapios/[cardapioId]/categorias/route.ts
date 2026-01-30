import { createClient } from '@/services/supabase/server';
import { NextResponse } from 'next/server';

// GET all categories for a specific menu
export async function GET(request: Request, { params }: { params: { cardapioId: string } }) {
  const supabase = createClient();
  const { cardapioId } = params;

  const { data: categorias, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('cardapio_id', cardapioId)
    .order('ordem', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(categorias);
}

// POST a new category to a specific menu
export async function POST(request: Request, { params }: { params: { cardapioId: string } }) {
  const supabase = createClient();
  const { cardapioId } = params;
  const { nome, ordem } = await request.json();

  if (!nome) {
    return NextResponse.json({ error: 'O nome da categoria é obrigatório.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('categorias')
    .insert([{ nome, ordem, cardapio_id: cardapioId }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
