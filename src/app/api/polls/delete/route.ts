
import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pollId = searchParams.get('pollId');
    const userId = searchParams.get('userId');

    if (!pollId || !userId) {
      return NextResponse.json({ success: false, error: 'Missing pollId or userId' }, { status: 400 });
    }

    // Check if user is the creator of the poll
    const { data: pollData, error: pollCheckError } = await supabase
      .from('polls')
      .select('created_by')
      .eq('id', pollId)
      .single();

    if (pollCheckError) {
      return NextResponse.json({ success: false, error: pollCheckError.message }, { status: 500 });
    }

    if (!pollData || pollData.created_by !== userId) {
      return NextResponse.json({ success: false, error: 'You do not have permission to delete this poll' }, { status: 403 });
    }

    // Delete poll options and votes first due to foreign key constraints
    await supabase.from('votes').delete().eq('poll_id', pollId);
    await supabase.from('poll_options').delete().eq('poll_id', pollId);
    
    const { error: pollError } = await supabase.from('polls').delete().eq('id', pollId);
    
    if (pollError) {
      return NextResponse.json({ success: false, error: pollError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'An error occurred' }, { status: 500 });
  }
}
