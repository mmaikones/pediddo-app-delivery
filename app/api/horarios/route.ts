import { createClient } from '@/services/supabase/server';
import { NextResponse } from 'next/server';

// GET the currently active menu(s)
export async function GET() {
  const supabase = createClient();
  const now = new Date();
  const currentDay = now.getDay(); // Sunday = 0, Monday = 1, etc.
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

  const { data: horarios, error } = await supabase
    .from('horarios_cardapio')
    .select(`
      *,
      cardapios (*)
    `)
    .filter('dias_semana', 'cs', `{${currentDay}}`) // Check if current day is in the array
    .lte('hora_inicio', currentTime)
    .gte('hora_fim', currentTime);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Extract the menu data from the horarios
  const activeCardapios = horarios.map(h => h.cardapios).filter(Boolean);

  return NextResponse.json(activeCardapios);
}
