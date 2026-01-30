// This combines all CRUD operations into one file

import { createClient } from '@/services/supabase/server';
import { NextResponse } from 'next/server';

// GET all menus
export async function GET() {
  const supabase = createClient();
  const { data: cardapios, error } = await supabase
    .from('cardapios')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(cardapios);
}

// POST a new menu
export async function POST(request: Request) {
  const supabase = createClient();
  const { nome, ativo } = await request.json();

  if (!nome) {
    return NextResponse.json({ error: 'O nome do cardápio é obrigatório.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('cardapios')
    .insert([{ nome, ativo }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// To handle updates and deletes for a specific menu, we need a dynamic route
// This logic should ideally be in a file like /api/cardapios/[id]/route.ts
// For now, I will create that structure.
