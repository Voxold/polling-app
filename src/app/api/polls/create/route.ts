
import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { CreatePollData } from '../../../../types/poll';

export async function POST(req: Request) {
  try {
    const { data, userId } = await req.json() as { data: CreatePollData, userId: string };

    // Insert poll
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .insert([{
        question: data.title,
        description: data.description,
        created_by: userId,
      }])
      .select()
      .single();

    if (pollError || !pollData) {
      return NextResponse.json({ success: false, error: pollError?.message || 'Failed to create poll' }, { status: 500 });
    }

    // Insert options
    const optionsToInsert = data.options
      .filter(opt => opt.trim() !== '')
      .map(opt => ({ poll_id: pollData.id, option_text: opt }));

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsToInsert);

    if (optionsError) {
      return NextResponse.json({ success: false, error: optionsError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, pollId: pollData.id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'An error occurred' }, { status: 500 });
  }
}
