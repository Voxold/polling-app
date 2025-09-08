
import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { VoteData } from '../../../../types/poll';

export async function POST(req: Request) {
  try {
    const { data, userId } = await req.json() as { data: VoteData, userId: string };

    // Check if user has already voted on this poll
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('id')
      .eq('poll_id', data.pollId)
      .eq('user_id', userId);

    if (checkError) {
      return NextResponse.json({ success: false, error: checkError.message }, { status: 500 });
    }

    if (existingVote && existingVote.length > 0) {
      return NextResponse.json({ success: false, error: 'You have already voted on this poll' }, { status: 400 });
    }

    // Insert vote
    const { error: voteError } = await supabase
      .from('votes')
      .insert([{
        poll_id: data.pollId,
        option_id: data.optionId,
        user_id: userId
      }]);

    if (voteError) {
      return NextResponse.json({ success: false, error: voteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'An error occurred' }, { status: 500 });
  }
}
