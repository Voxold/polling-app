'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Button from '../ui/button';

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
}

interface PollCardProps {
  poll: Poll;
  onVote?: (optionId: string) => void;
  showResults?: boolean;
}

export default function PollCard({ poll, onVote, showResults = false }: PollCardProps) {
  const handleVote = (optionId: string) => {
    if (onVote) {
      onVote(optionId);
    }
  };

  const getVotePercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  return (
    <Card className="w-full hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-slate-900">{poll.title}</CardTitle>
        <CardDescription className="text-slate-600">{poll.description}</CardDescription>
        <div className="text-sm text-slate-500">
          Created by <span className="font-medium text-slate-700">{poll.author}</span> • {new Date(poll.createdAt).toLocaleDateString()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {poll.options.map((option) => (
          <div key={option.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-800">{option.text}</span>
              {showResults && (
                <span className="text-sm text-slate-600 font-medium">
                  {option.votes} votes ({getVotePercentage(option.votes)}%)
                </span>
              )}
            </div>
            {showResults && (
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${getVotePercentage(option.votes)}%` }}
                />
              </div>
            )}
            {!showResults && (
              <Button
                variant="outline"
                className="w-full hover:bg-indigo-50 hover:border-indigo-400"
                onClick={() => handleVote(option.id)}
              >
                Vote
              </Button>
            )}
          </div>
        ))}
        <div className="pt-3 text-sm text-slate-500 border-t border-slate-100">
          Total votes: <span className="font-semibold text-slate-700">{poll.totalVotes}</span>
        </div>
      </CardContent>
    </Card>
  );
} 