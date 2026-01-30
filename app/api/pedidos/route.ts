import { createClient } from '@/services/supabase/server';
import { NextResponse } from 'next/server';

// GET all orders
export async function GET() {
  const supabase = createClient();
  const { data: pedidos, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(pedidos);
}

// POST a new order
export async function POST(request: Request) {
  const supabase = createClient();
  const { nome_cliente, telefone_cliente, endereco_entrega, itens, total, observacoes } = await request.json();

  if (!nome_cliente || !telefone_cliente || !endereco_entrega || !itens || !total) {
    return NextResponse.json({ error: 'Dados do pedido incompletos.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('pedidos')
    .insert([{ nome_cliente, telefone_cliente, endereco_entrega, itens, total, observacoes, status: 'Pendente' }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
