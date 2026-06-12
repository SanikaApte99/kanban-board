# Kanban Board

A responsive drag-and-drop Kanban Board built with Next.js and TypeScript for managing tasks efficiently.

## Tech Stack

- Next.js 15
- TypeScript
- Material UI
- Clerk Authentication
- @dnd-kit
- React Query
- Zustand
- React Hook Form + Yup
- Jest

## Features

- User authentication with Clerk (Sign Up, Sign In, Sign Out)
- Drag and drop tasks between and within columns
- Add, edit, and delete tasks with validation
- Priority levels, due dates, and descriptions
- Dark mode and toast notifications
- Responsive design

## Getting Started

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Environment Variables

Create a .env.local file in the root directory and add your Clerk credentials:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

You can obtain these keys from your Clerk dashboard.

### Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Tests

```bash
npm run test
```
