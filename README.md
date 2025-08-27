# PollApp - Community Polling Platform

A modern Next.js application for creating and participating in community polls. Built with TypeScript, Tailwind CSS, and designed with a clean, user-friendly interface.

<a href="https://docs.google.com/document/d/1JkcW1DNYPMniUQnBHTbWDVC0JKo_f1yF/edit?usp=sharing&ouid=113796980813407446380&rtpof=true&sd=true">Document</a>
## Features

- **Dashboard**: Overview of polls and statistics
- **Poll Creation**: Create custom polls with multiple options
- **Poll Participation**: Vote on polls and see real-time results
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean interface built with custom UI components

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page (main landing page)
│   ├── polls/             # Poll-related pages
│   │   ├── page.tsx       # Browse all polls
│   │   └── create/        # Create new poll
│   ├── layout.tsx         # Root layout with navigation
│   └── page.tsx           # Home page (redirects to dashboard)
├── components/             # Reusable components
│   ├── layout/            # Layout components
│   │   └── Navigation.tsx # Main navigation
│   ├── polls/             # Poll-related components
│   │   ├── PollCard.tsx   # Individual poll display
│   │   └── CreatePollForm.tsx # Poll creation form
│   └── ui/                # Base UI components
│       ├── button.tsx     # Button component
│       ├── input.tsx      # Input component
│       └── card.tsx       # Card components
└── types/                  # TypeScript type definitions
    └── poll.ts            # Poll-related types
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000` - you'll be automatically redirected to the dashboard

## Available Routes

- `/` - Home page (automatically redirects to dashboard)
- `/dashboard` - Main dashboard with poll overview and statistics
- `/polls` - Browse all available polls
- `/polls/create` - Create a new poll

## Component Architecture

### UI Components
- **Button**: Versatile button component with multiple variants and sizes
- **Input**: Form input component with consistent styling
- **Card**: Card components for displaying content in organized layouts

### Poll Components
- **PollCard**: Displays individual polls with voting functionality
- **CreatePollForm**: Form for creating new polls with dynamic options

## Development Notes

- All components are built with TypeScript for type safety
- Uses Tailwind CSS for styling with custom component classes
- Components are designed to be reusable and maintainable
- Form handling includes basic validation and state management
- Mock data is included for demonstration purposes
- No authentication required - users can directly access all features

## Next Steps

To complete the application, you'll need to:

1. **Add Database**: Set up a database for storing polls and user data
2. **API Routes**: Create Next.js API routes for CRUD operations
3. **State Management**: Implement proper state management (e.g., Zustand, Redux)
4. **Real-time Updates**: Add WebSocket support for live poll updates
5. **Testing**: Add unit and integration tests
6. **Deployment**: Deploy to your preferred hosting platform

## Technologies Used

- **Next.js 15** - React framework with app router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React 19** - Latest React features and hooks

## Contributing

This is a scaffold project ready for development. Feel free to modify and extend the components and functionality as needed for your specific use case.
