'use client';

import React from 'react';
import Link from 'next/link';
import Button from '../ui/button';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-lg border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors duration-200">
              PollApp
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/dashboard" 
              className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-indigo-50"
            >
              Dashboard
            </Link>
            <Link 
              href="/polls" 
              className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-indigo-50"
            >
              Browse Polls
            </Link>
            <Link 
              href="/polls/create" 
              className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-indigo-50"
            >
              Create Poll
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600 font-medium">Welcome to PollApp</span>
          </div>
        </div>
      </div>
    </nav>
  );
} 