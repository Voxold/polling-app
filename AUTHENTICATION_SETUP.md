# Authentication Setup Guide

This guide explains how to set up user authentication for your Next.js polling app using Supabase.

## Prerequisites

- A Supabase account and project
- Next.js 15+ project with TypeScript

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Getting Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select an existing one
3. Go to Settings > API in your project dashboard
4. Copy the "Project URL" and "anon public" key
5. Paste them in your `.env.local` file

## Features Implemented

### ✅ Authentication System
- **Supabase Client**: Reusable client utility in `src/lib/supabase.ts`
- **Auth Context**: React context for managing authentication state
- **Session Persistence**: Automatic session restoration on page refresh
- **Real-time Auth Updates**: Listens for authentication state changes

### ✅ User Management
- **Login Page**: `/auth/login` - Email + password authentication
- **Registration Page**: `/auth/register` - New user account creation
- **Logout**: Available in navigation for authenticated users
- **Error Handling**: Graceful error display and validation

### ✅ Route Protection
- **Protected Routes**: Dashboard and create poll pages require authentication
- **Public Access**: Home page and poll browsing available to all users
- **Authentication Checks**: Voting requires authentication, viewing results doesn't

### ✅ UI Components
- **Navigation Updates**: Dynamic navigation based on auth state
- **Loading States**: Spinners and loading indicators during auth operations
- **Responsive Design**: Mobile-friendly authentication forms
- **Error Messages**: Clear feedback for validation and authentication errors

## File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication context provider
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx   # Route protection component
│   └── layout/
│       └── Navigation.tsx        # Updated navigation with auth
├── lib/
│   └── supabase.ts              # Supabase client utility
├── types/
│   └── auth.ts                  # Authentication type definitions
└── app/
    ├── auth/
    │   ├── login/
    │   │   └── page.tsx         # Login page
    │   └── register/
    │       └── page.tsx         # Registration page
    ├── dashboard/
    │   └── page.tsx             # Protected dashboard
    └── polls/
        └── create/
            └── page.tsx         # Protected create poll page
```

## Usage Examples

### Using the Auth Context

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login({ email: 'test@example.com', password: 'password' })}>
          Login
        </button>
      )}
    </div>
  );
}
```

### Protecting Routes

```tsx
import ProtectedRoute from '../components/auth/ProtectedRoute';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

## Security Features

- **Password Validation**: Minimum 6 characters, confirmation matching
- **Email Validation**: Basic email format checking
- **Session Management**: Secure session handling with Supabase
- **Route Protection**: Server-side and client-side authentication checks
- **Error Handling**: No sensitive information exposed in error messages

## Next Steps

1. **Database Schema**: Set up your Supabase database tables for polls and votes
2. **API Routes**: Create server-side API routes for poll operations
3. **Real-time Updates**: Implement real-time poll updates using Supabase subscriptions
4. **User Profiles**: Add user profile management and customization
5. **Social Auth**: Add Google, GitHub, or other OAuth providers

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**: Restart your development server after adding `.env.local`
2. **Supabase Connection Errors**: Verify your project URL and anon key are correct
3. **Authentication Not Persisting**: Check that your Supabase project has authentication enabled
4. **TypeScript Errors**: Ensure all dependencies are properly installed and types are imported

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [Next.js App Router docs](https://nextjs.org/docs/app)
- Check the console for any error messages

