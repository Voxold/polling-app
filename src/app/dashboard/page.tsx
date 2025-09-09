'use client';

import React, { useState, useEffect } from 'react';
import PollCard from '../../components/polls/PollCard';
import Button from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

// Define Poll and PollOption types for clarity
interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  totalVotes: number;
  createdAt: string;
  author: string;
  createdBy: string;
}

function DashboardContent() {
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [showResults, setShowResults] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch polls and votes from supabase
  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      setError(null);
      try {
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
        if (pollsError) throw pollsError;
        const { data: votesData, error: votesError } = await supabase
          .from('votes')
          .select('option_id');
        if (votesError) throw votesError;
        const mappedPolls: Poll[] = (pollsData || []).map((poll: any) => {
          const options: PollOption[] = (poll.poll_options || []).map((opt: any) => {
            const votes = (votesData || []).filter((v: any) => v.option_id === opt.id).length;
            return {
              id: opt.id,
              text: opt.option_text,
              votes,
            };
          });
          return {
            id: poll.id,
            title: poll.question,
            description: poll.description,
            options,
            totalVotes: options.reduce((sum, o) => sum + o.votes, 0),
            createdAt: poll.created_at,
            author: poll.users?.email || 'Unknown',
            createdBy: poll.created_by,
          };
        });
        setPolls(mappedPolls);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch polls');
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, [user]);

  // Delete poll and related data
  const handleDelete = async (pollId: string) => {
    if (!window.confirm('Are you sure you want to delete this poll?')) return;
    setLoading(true);
    setError(null);
    try {
      await supabase.from('votes').delete().eq('poll_id', pollId);
      await supabase.from('poll_options').delete().eq('poll_id', pollId);
      const { error: pollError } = await supabase.from('polls').delete().eq('id', pollId);
      if (pollError) throw pollError;
      setPolls(prevPolls => prevPolls.filter((p) => p.id !== pollId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete poll');
    } finally {
      setLoading(false);
    }
  };

  // Toggle poll results visibility
  const handleToggleResults = (pollId: string) => {
    setShowResults(prev => ({ ...prev, [pollId]: !prev[pollId] }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Dashboard</h1>
          <p className="text-slate-600 text-lg">Welcome back, {user?.email}!</p>
        </div>
        <a href="/polls/create">
          <Button>Create New Poll</Button>
        </a>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-indigo-100 text-lg font-medium">Total Polls</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">{polls.length}</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-emerald-100 text-lg font-medium">Total Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">
              {polls.reduce((sum, poll) => sum + poll.totalVotes, 0)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-100 text-lg font-medium">Active Polls</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">{polls.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Recent Polls</h2>
        {loading ? (
          <div className="text-center py-10 text-lg text-slate-500">Loading polls...</div>
        ) : error ? (
          <div className="text-center py-10 text-lg text-red-500">{error}</div>
        ) : polls.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <p className="text-slate-500 mb-6 text-lg">No polls available yet.</p>
              <a href="/polls/create">
                <Button>Create the first poll</Button>
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll: any) => (
              <div key={poll.id} className="space-y-4">
                <PollCard
                  poll={poll}
                  onVote={(optionId) => {}}
                  showResults={showResults[poll.id]}
                />
                <div className="flex justify-center gap-2">
                  {user && poll.createdBy === user.id && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert('Edit functionality coming soon!')}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(poll.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleResults(poll.id)}
                  >
                    {showResults[poll.id] ? 'Hide Results' : 'Show Results'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center">
        <a href="/polls">
          <Button variant="outline" size="lg">View All Polls</Button>
        </a>
      </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}