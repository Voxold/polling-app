'use client';

import React, { useState } from 'react';
import PollCard from '../../components/polls/PollCard';
import Button from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

// Mock data for demonstration
const mockPolls = [
  {
    id: '1',
    title: 'What\'s your favorite programming language?',
    description: 'Let\'s see what the community prefers for development',
    options: [
      { id: '1-1', text: 'JavaScript/TypeScript', votes: 45 },
      { id: '1-2', text: 'Python', votes: 38 },
      { id: '1-3', text: 'Java', votes: 22 },
      { id: '1-4', text: 'C++', votes: 15 }
    ],
    totalVotes: 120,
    createdAt: '2024-01-15T10:00:00Z',
    author: 'John Doe'
  },
  {
    id: '2',
    title: 'Best framework for building web apps?',
    description: 'Share your experience with different frameworks',
    options: [
      { id: '2-1', text: 'React', votes: 52 },
      { id: '2-2', text: 'Vue.js', votes: 28 },
      { id: '2-3', text: 'Angular', votes: 20 },
      { id: '2-4', text: 'Svelte', votes: 12 }
    ],
    totalVotes: 112,
    createdAt: '2024-01-14T15:30:00Z',
    author: 'Jane Smith'
  }
];

export default function PollsPage() {
  const [polls, setPolls] = useState(mockPolls);
  const [showResults, setShowResults] = useState<{ [key: string]: boolean }>({});

  const handleVote = (pollId: string, optionId: string) => {
    // TODO: Implement actual voting logic with API call
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
            totalVotes: poll.totalVotes + 1
          };
        }
        return poll;
      })
    );
    
    // Show results after voting
    setShowResults(prev => ({ ...prev, [pollId]: true }));
  };

  const toggleResults = (pollId: string) => {
    setShowResults(prev => ({ ...prev, [pollId]: !prev[pollId] }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Community Polls</h1>
            <p className="text-slate-600 text-lg">Discover what others think and share your opinion</p>
          </div>
          <Button asChild>
            <a href="/polls/create">Create New Poll</a>
          </Button>
        </div>

        {polls.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <p className="text-slate-500 mb-6 text-lg">No polls available yet.</p>
              <Button asChild>
                <a href="/polls/create">Create the first poll</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll) => (
              <div key={poll.id} className="space-y-4">
                <PollCard
                  poll={poll}
                  onVote={(optionId) => handleVote(poll.id, optionId)}
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