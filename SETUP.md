# Vroom - Setup Guide

This guide covers environment variables and setup for the Vroom video conferencing app.

**Note:** All environment variables must be set before `npm run build` or `npm run dev`. The app will not build without them.

## Environment Variables

Create a `.env.local` file in the project root with:

### Required

```env
# LiveKit (video/audio transport)
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret

# Neon PostgreSQL (user database)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Clerk (authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Optional (Clerk)

```env
# Custom sign-in/sign-up URLs (defaults to Clerk-hosted if not set)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Provider Setup

### 1. LiveKit Cloud

1. Go to [cloud.livekit.io](https://cloud.livekit.io)
2. Create a free account and project
3. Copy the WebSocket URL, API Key, and API Secret from the project settings

### 2. Neon Database

1. Go to [neon.tech](https://neon.tech)
2. Create a free account and project
3. Copy the connection string (connects to PostgreSQL)
4. Use it as `DATABASE_URL`

### 3. Clerk

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy the Publishable Key and Secret Key from the API Keys page
4. In Clerk Dashboard → Paths, optionally set:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`

## Database Migration

After setting `DATABASE_URL` in `.env.local`, run:

```bash
npm run db:push
```

This applies the schema to your Neon database. **Ensure `.env.local` exists** before running, or set `DATABASE_URL` in your environment.

To generate a new migration after schema changes:

```bash
npm run db:generate
npm run db:migrate
```

## Running the App

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

- **Home** → links to join flow
- **Join** (`/join/[roomId]`) → choose Guest, Login, or Sign up
- **Room** (`/room/[roomId]`) → video call with avatars

## Join Flow

- **Guest**: Join without account. Name defaults to "Guest", editable before and during the call.
- **Account**: Sign in or sign up with Clerk. Display name is stored in the database and used in calls.
