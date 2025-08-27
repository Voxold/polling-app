'use client';

import React, { useState } from 'react';
import Button from '../ui/button';
import Input from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export default function CreatePollForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    options: ['', '']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement poll creation logic
    console.log('Creating poll:', formData);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-slate-900">Create a New Poll</CardTitle>
        <CardDescription className="text-slate-600">Share your question with the community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="title" className="text-sm font-semibold text-slate-700 block">
              Poll Title
            </label>
            <Input
              id="title"
              type="text"
              placeholder="What would you like to ask?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-3">
            <label htmlFor="description" className="text-sm font-semibold text-slate-700 block">
              Description (Optional)
            </label>
            <Input
              id="description"
              type="text"
              placeholder="Add more context to your question"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700 block">Poll Options</label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex gap-3">
                <Input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
                {formData.options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                    className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addOption}
              className="w-full hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700"
            >
              Add Option
            </Button>
          </div>

          <Button type="submit" className="w-full text-lg py-3">
            Create Poll
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 