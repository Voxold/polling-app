
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { Poll, PollOption } from '../../../types/poll';

export async function GET() {
  try {
    // Fetch polls with options and author email
    const { data: pollsData, error: pollsError } = await supabase
      .from('polls')
      .select(`
        id,
        question,
        description,
        created_at,
        created_by,
        poll_options (id, option_text),
        users:created_by (email)
      `)
      .order('created_at', { ascending: false });

    if (pollsError) {
      return NextResponse.json({ success: false, error: pollsError.message }, { status: 500 });
    }

    // Fetch votes for all options
    const { data: votesData } = await supabase
      .from('votes')
      .select('option_id');

    // Map polls to Poll type
    const mappedPolls = (pollsData || []).map((poll: any) => {
      const options = (poll.poll_options || []).map((opt: any) => {
        const votes = (votesData || []).filter((v: any) => v.option_id === opt.id).length;
        return {
          id: opt.id,
          text: opt.option_text,
          votes,
        } as PollOption;
      });

      return {
        id: poll.id,
        title: poll.question,
        description: poll.description,
        options,
        totalVotes: options.reduce((sum: number, o: any) => sum + o.votes, 0),
        createdAt: poll.created_at,
        author: poll.users?.email || 'Unknown',
      } as Poll;
    });

    return NextResponse.json({ success: true, polls: mappedPolls });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'An error occurred' }, { status: 500 });
  }
}
