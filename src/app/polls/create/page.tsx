import CreatePollForm from '../../../components/polls/CreatePollForm';

export default function CreatePollPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Create a New Poll</h1>
            <p className="text-slate-600 text-lg">
              Share your question with the community and get their opinions
            </p>
          </div>
          
          <CreatePollForm />
          
          <div className="text-center mt-10">
            <a 
              href="/polls" 
              className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors duration-200"
            >
              ← Back to all polls
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 