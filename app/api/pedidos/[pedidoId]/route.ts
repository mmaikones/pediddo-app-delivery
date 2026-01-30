import { createClient } from '@/services/supabase/server';
import { NextResponse } from 'next/server';

// This file will handle PATCH for a specific order (updating status)

// PATCH (update) an order
export async function PATCH(request: Request, { params }: { params: { pedidoId: string } }) {
  const supabase = createClient();
  const { pedidoId } = params;
  const { status } = await request.json();

  if (!status) {
    return NextResponse.json({ error: 'O status do pedido é obrigatório.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('pedidos')
    .update({ status })
    .eq('id', pedidoId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
