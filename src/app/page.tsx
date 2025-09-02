'use client';

import React from 'react';
import Link from 'next/link';
import Button from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

// Mock data for demonstration
const featuredPolls = [
  {
    id: '1',
    title: 'What\'s your favorite programming language?',
    description: 'Let\'s see what the community prefers for development',
    totalVotes: 120,
    createdAt: '2024-01-15T10:00:00Z',
    author: 'John Doe'
  },
  {
    id: '2',
    title: 'Best framework for building web apps?',
    description: 'Share your experience with different frameworks',
    totalVotes: 112,
    createdAt: '2024-01-14T15:30:00Z',
    author: 'Jane Smith'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Welcome to PollApp
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Create polls, vote on topics that matter to you, and see what the community thinks. 
            Join thousands of users in making decisions together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/polls">
              <Button size="lg">
                Browse Polls
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured Polls */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Featured Polls
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {featuredPolls.map((poll) => (
              <Card key={poll.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">{poll.title}</CardTitle>
                  <CardDescription className="text-slate-600">{poll.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-500 mb-4">
                    Created by <span className="font-medium text-slate-700">{poll.author}</span> • {new Date(poll.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-slate-600 mb-4">
                    Total votes: <span className="font-semibold text-slate-700">{poll.totalVotes}</span>
                  </div>
                  <Link href={`/polls/${poll.id}`}>
                    <Button variant="outline" className="w-full">
                      View Poll
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Create Polls</h3>
            <p className="text-slate-600">Easily create polls with multiple options and share them with your community.</p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Vote & Participate</h3>
            <p className="text-slate-600">Cast your vote on polls and see real-time results as the community participates.</p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Real-time Results</h3>
            <p className="text-slate-600">Watch results update in real-time with beautiful charts and statistics.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
