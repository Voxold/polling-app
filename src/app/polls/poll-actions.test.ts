import { createPoll, votePoll, getPolls, deletePoll } from './poll-actions';
import { supabase } from '../../lib/supabase';

// Mock the supabase client
jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  },
}));

describe('Poll Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPoll', () => {
    it('should create a poll successfully', async () => {
      // Mock successful poll creation
      const mockPollData = { id: 'poll-123' };
      const mockFromFn = jest.fn().mockReturnThis();
      const mockInsertFn = jest.fn().mockReturnThis();
      const mockSelectFn = jest.fn().mockReturnThis();
      const mockSingleFn = jest.fn().mockResolvedValue({ data: mockPollData, error: null });

      supabase.from = mockFromFn;
      supabase.from().insert = mockInsertFn;
      supabase.from().insert().select = mockSelectFn;
      supabase.from().insert().select().single = mockSingleFn;

      // Mock successful options insertion
      const mockOptionsInsertFn = jest.fn().mockResolvedValue({ error: null });
      supabase.from().insert = mockOptionsInsertFn;

      const pollData = {
        title: 'Test Poll',
        description: 'Test Description',
        options: ['Option 1', 'Option 2'],
      };

      const result = await createPoll(pollData, 'user-123');

      expect(result).toEqual({ success: true, pollId: 'poll-123' });
      expect(mockFromFn).toHaveBeenCalledWith('polls');
      expect(mockInsertFn).toHaveBeenCalledWith([{
        question: 'Test Poll',
        description: 'Test Description',
        created_by: 'user-123',
      }]);
    });

    it('should handle poll creation error', async () => {
      // Mock poll creation error
      const mockError = { message: 'Database error' };
      supabase.from = jest.fn().mockReturnThis();
      supabase.from().insert = jest.fn().mockReturnThis();
      supabase.from().insert().select = jest.fn().mockReturnThis();
      supabase.from().insert().select().single = jest.fn().mockResolvedValue({ data: null, error: mockError });

      const pollData = {
        title: 'Test Poll',
        description: 'Test Description',
        options: ['Option 1', 'Option 2'],
      };

      const result = await createPoll(pollData, 'user-123');

      expect(result).toEqual({ success: false, error: 'Database error' });
    });

    it('should handle options insertion error', async () => {
      // Mock successful poll creation
      const mockPollData = { id: 'poll-123' };
      supabase.from = jest.fn().mockReturnThis();
      supabase.from().insert = jest.fn().mockReturnThis();
      supabase.from().insert().select = jest.fn().mockReturnThis();
      supabase.from().insert().select().single = jest.fn().mockResolvedValue({ data: mockPollData, error: null });

      // Mock options insertion error
      const mockOptionsError = { message: 'Options error' };
      supabase.from = jest.fn().mockReturnThis();
      supabase.from().insert = jest.fn().mockResolvedValue({ error: mockOptionsError });

      const pollData = {
        title: 'Test Poll',
        description: 'Test Description',
        options: ['Option 1', 'Option 2'],
      };

      const result = await createPoll(pollData, 'user-123');

      expect(result).toEqual({ success: false, error: 'Options error' });
    });
  });

  describe('votePoll', () => {
    it('should vote on a poll successfully', async () => {
      // Mock check for existing vote (none found)
      supabase.from = jest.fn().mockReturnThis();
      supabase.from().select = jest.fn().mockReturnThis();
      supabase.from().select().eq = jest.fn().mockReturnThis();
      supabase.from().select().eq().eq = jest.fn().mockResolvedValue({ data: [], error: null });

      // Mock vote insertion
      supabase.from = jest.fn().mockReturnThis();
      supabase.from().insert = jest.fn().mockResolvedValue({ error: null });

      const voteData = {
        pollId: 'poll-123',
        optionId: 'option-123',
      };

      const result = await votePoll(voteData, 'user-123');

      expect(result).toEqual({ success: true });
    });

    it('should prevent duplicate votes', async () => {
      // Mock check for existing vote (found)
      supabase.from = jest.fn().mockReturnThis();
      supabase.from().select = jest.fn().mockReturnThis();
      supabase.from().select().eq = jest.fn().mockReturnThis();
      supabase.from().select().eq().eq = jest.fn().mockResolvedValue({ 
        data: [{ id: 'vote-123' }], 
        error: null 
      });

      const voteData = {
        pollId: 'poll-123',
        optionId: 'option-123',
      };

      const result = await votePoll(voteData, 'user-123');

      expect(result).toEqual({ 
        success: false, 
        error: 'You have already voted on this poll' 
      });
    });
  });

  describe('getPolls', () => {
    it('should fetch polls successfully', async () => {
      // Mock polls data
      const mockPollsData = [
        {
          id: 'poll-123',
          question: 'Test Poll',
          description: 'Test Description',
          created_at: '2023-01-01',
          created_by: 'user-123',
          poll_options: [
            { id: 'option-1', option_text: 'Option 1' },
            { id: 'option-2', option_text: 'Option 2' },
          ],
          users: { email: 'test@example.com' },
        },
      ];

      // Mock votes data
      const mockVotesData = [
        { option_id: 'option-1' },
        { option_id: 'option-1' },
        { option_id: 'option-2' },
      ];

      // Mock polls fetch
      supabase.from = jest.fn().mockReturnThis();
      supabase.from().select = jest.fn().mockReturnThis();
      supabase.from().select().order = jest.fn().mockResolvedValue({
        data: mockPollsData,
        error: null,
      });

      // Mock votes fetch
      supabase.from = jest.fn().mockReturnThis();
      supabase.from().select = jest.fn().mockResolvedValue({
        data: mockVotesData,
        error: null,
      });

      const result = await getPolls();

      expect(result.success).toBe(true);
      expect(result.polls).toHaveLength(1);
      expect(result.polls?.[0].title).toBe('Test Poll');
      expect(result.polls?.[0].options).toHaveLength(2);
      expect(result.polls?.[0].totalVotes).toBe(3);
    });

    it('should handle error when fetching polls', async () => {
      // Mock polls fetch error
      const mockError = { message: 'Database error' };
      supabase.from = jest.fn().mockReturnThis();
      supabase.from().select = jest.fn().mockReturnThis();
      supabase.from().select().order = jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      const result = await getPolls();

      expect(result).toEqual({ success: false, error: 'Database error' });
    });
  });

  describe('deletePoll', () => {
    it('should delete a poll successfully', async () => {
      // Mock poll ownership check
      supabase.from = jest.fn().mockReturnThis();
      supabase.from().select = jest.fn().mockReturnThis();
      supabase.from().select().eq = jest.fn().mockReturnThis();
      supabase.from().select().eq().single = jest.fn().mockResolvedValue({
        data: { created_by: 'user-123' },
        error: null,
      });

      // Mock votes deletion
      supabase.from = jest.fn().mockReturnThis();
      supabase.from().delete = jest.fn().mockReturnThis();
      supabase.from().delete().eq = jest.fn().mockResolvedValue({ error: null });

      // Mock options deletion
      supabase.from = jest.fn().mockReturnThis();
      supabase.from().delete = jest.fn().mockReturnThis();
      supabase.from().delete().eq = jest.fn().mockResolvedValue({ error: null });

      // Mock poll deletion
      supabase.from = jest.fn().mockReturnThis();
      supabase.from().delete = jest.fn().mockReturnThis();
      supabase.from().delete().eq = jest.fn().mockResolvedValue({ error: null });

      const result = await deletePoll('poll-123', 'user-123');

      expect(result).toEqual({ success: true });
    });

    it('should prevent unauthorized poll deletion', async () => {
      // Mock poll ownership check (different user)
      supabase.from = jest.fn().mockReturnThis();
      supabase.from().select = jest.fn().mockReturnThis();
      supabase.from().select().eq = jest.fn().mockReturnThis();
      supabase.from().select().eq().single = jest.fn().mockResolvedValue({
        data: { created_by: 'different-user' },
        error: null,
      });

      const result = await deletePoll('poll-123', 'user-123');

      expect(result).toEqual({
        success: false,
        error: 'You do not have permission to delete this poll',
      });
    });
  });
});