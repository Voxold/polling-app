'use server';

import { supabase } from '../../lib/supabase';
import { CreatePollData, VoteData, Poll, PollOption } from '../../types/poll';

/**
 * Creates a new poll with the provided data
 */
export async function createPoll(data: CreatePollData, userId: string): Promise<{ success: boolean; error?: string; pollId?: string }> {
  try {
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
      return { success: false, error: pollError?.message || 'Failed to create poll' };
    }

    // Insert options
    const optionsToInsert = data.options
      .filter(opt => opt.trim() !== '')
      .map(opt => ({ poll_id: pollData.id, option_text: opt }));

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsToInsert);

    if (optionsError) {
      return { success: false, error: optionsError.message };
    }

    return { success: true, pollId: pollData.id };
  } catch (err: any) {
    return { success: false, error: err.message || 'An error occurred' };
  }
}

/**
 * Votes for a specific option in a poll
 */
export async function votePoll(data: VoteData, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if user has already voted on this poll
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('id')
      .eq('poll_id', data.pollId)
      .eq('user_id', userId);

    if (checkError) {
      return { success: false, error: checkError.message };
    }

    if (existingVote && existingVote.length > 0) {
      return { success: false, error: 'You have already voted on this poll' };
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
      return { success: false, error: voteError.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'An error occurred' };
  }
}

/**
 * Fetches all polls with their options and vote counts
 */
export async function getPolls(): Promise<{ success: boolean; polls?: Poll[]; error?: string }> {
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
      return { success: false, error: pollsError.message };
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

    return { success: true, polls: mappedPolls };
  } catch (err: any) {
    return { success: false, error: err.message || 'An error occurred' };
  }
}

/**
 * Deletes a poll and its associated options and votes
 */
export async function deletePoll(pollId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if user is the creator of the poll
    const { data: pollData, error: pollCheckError } = await supabase
      .from('polls')
      .select('created_by')
      .eq('id', pollId)
      .single();

    if (pollCheckError) {
      return { success: false, error: pollCheckError.message };
    }

    if (!pollData || pollData.created_by !== userId) {
      return { success: false, error: 'You do not have permission to delete this poll' };
    }

    // Delete poll options and votes first due to foreign key constraints
    await supabase.from('votes').delete().eq('poll_id', pollId);
    await supabase.from('poll_options').delete().eq('poll_id', pollId);
    
    const { error: pollError } = await supabase.from('polls').delete().eq('id', pollId);
    
    if (pollError) {
      return { success: false, error: pollError.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'An error occurred' };
  }
}