'use client';

import React, { useState, useEffect } from 'react';
import PollCard from '../../components/polls/PollCard';
import Button from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { Poll } from '../../types/poll';

export default function PollsPage() {
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('/api/polls');
        const data = await response.json();
        if (data.success) {
          setPolls(data.polls);
        } else {
          setError(data.error || 'Failed to fetch polls');
        }
      } catch (err) {
        setError('An error occurred while fetching polls');
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const handleVote = async (pollId: string, optionId: string) => {
    if (!user) {
      // Or handle this more gracefully
      alert('Please log in to vote.');
      return;
    }

    try {
      const response = await fetch('/api/polls/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { pollId, optionId }, userId: user.id }),
      });

      const result = await response.json();

      if (result.success) {
        // Optimistically update the UI or refetch polls
        setPolls(prevPolls =>
          prevPolls.map(poll => {
            if (poll.id === pollId) {
              return {
                ...poll,
                options: poll.options.map(option =>
                  option.id === optionId
                    ? { ...option, votes: option.votes + 1 }
                    : option
                ),
                totalVotes: poll.totalVotes + 1,
              };
            }
            return poll;
          })
        );
        setShowResults(prev => ({ ...prev, [pollId]: true }));
      } else {
        alert(result.error || 'Failed to vote');
      }
    } catch (err) {
      alert('An error occurred while voting.');
    }
  };

  const handleDelete = async (pollId: string) => {
    if (!user) {
      alert('Please log in to delete polls.');
      return;
    }

    if (confirm('Are you sure you want to delete this poll?')) {
      try {
        const response = await fetch(`/api/polls/delete?pollId=${pollId}&userId=${user.id}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          setPolls(prevPolls => prevPolls.filter(poll => poll.id !== pollId));
        } else {
          alert(result.error || 'Failed to delete poll');
        }
      } catch (err) {
        alert('An error occurred while deleting the poll.');
      }
    }
  };

  const toggleResults = (pollId: string) => {
    setShowResults(prev => ({ ...prev, [pollId]: !prev[pollId] }));
  };

  if (loading) {
    return <div className="text-center py-16">Loading polls...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Community Polls</h1>
            <p className="text-slate-600 text-lg">Discover what others think and share your opinion</p>
          </div>
          <a href="/polls/create">
            <Button>Create New Poll</Button>
          </a>
        </div>

        {polls.length === 0 ? (
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
            {polls.map((poll) => (
              <div key={poll.id} className="space-y-4">
                <PollCard
                  poll={poll}
                  onVote={(optionId) => handleVote(poll.id, optionId)}
                  onDelete={() => handleDelete(poll.id)}
                  showResults={showResults[poll.id]}
                />
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleResults(poll.id)}
                  >
                    {showResults[poll.id] ? 'Hide Results' : 'Show Results'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}