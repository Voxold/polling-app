// lib/pollService.ts
import { supabase } from './supabase';

export async function createPoll({
  title,
  description,
  options,
  userId,
}: {
  title: string;
  description: string;
  options: string[];
  userId: string;
}) {
  const { data: pollData, error: pollError } = await supabase
    .from('polls')
    .insert([
      {
        question: title,
        description,
        created_by: userId,
      },
    ])
    .select()
    .single();

  if (pollError || !pollData) {
    throw new Error(pollError?.message || 'Failed to create poll.');
  }

  const optionsToInsert = options
    .filter((opt) => opt.trim() !== '')
    .map((opt) => ({ poll_id: pollData.id, option_text: opt }));

  const { error: optionsError } = await supabase
    .from('poll_options')
    .insert(optionsToInsert);

  if (optionsError) {
    throw new Error(optionsError.message);
  }

  return pollData;
}
