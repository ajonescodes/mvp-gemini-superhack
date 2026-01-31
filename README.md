# PromptPlay Sports

**You write the script. AI brings it to life.**

An AI-powered fan prediction platform where users submit predictions for NFL matchups, and AI generates anime-style video recreations based on community-weighted outcomes.

## Quick Start

### Prerequisites

- Node.js 18+
- Vercel CLI (`npm i -g vercel`)
- Supabase account
- Google AI Studio API key (Gemini)
- fal.ai account

### 1. Clone & Install

```bash
cd mvp-gemini-superhack
npm install
```

### 2. Set Up Vercel Project

```bash
vercel
```

### 3. Add Integrations

1. **Supabase**: Vercel Dashboard → Integrations → Add Supabase
2. **fal.ai**: Vercel Dashboard → Integrations → Add fal

### 4. Add Gemini API Key

```bash
vercel env add GEMINI_API_KEY
# Enter your Google AI Studio API key
```

### 5. Pull Environment Variables

```bash
vercel env pull .env.local
```

### 6. Set Up Database

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Run the contents of `supabase/schema.sql`

### 7. Run Locally

```bash
npm run dev
```

Visit http://localhost:3000

## Demo Workflow

1. Users visit `/predict` and fill out predictions (no login required)
2. On submit, auth modal appears → user registers/logs in
3. Admin goes to `/admin` and:
   - Changes matchup status to "closed"
   - Clicks "Generate Script" (calls Gemini)
   - Clicks "Render Trailer" (calls fal.ai Veo)
   - Changes matchup status to "complete"
4. Users view their scorecard at `/results`
5. Everyone watches the trailer at `/watch`

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Tailwind CSS + Pinia
- **Backend**: Vercel Functions
- **Database**: Supabase (PostgreSQL)
- **AI - Script**: Gemini 2.0 Flash
- **AI - Video**: fal.ai Veo 3.1

## Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── _lib/              # Shared utilities
│   ├── auth/              # Auth endpoints
│   ├── predictions/       # Prediction endpoints
│   ├── matchups/          # Matchup endpoints
│   ├── leaderboard/       # Leaderboard endpoint
│   └── admin/             # Admin endpoints
├── src/
│   ├── views/             # Page components
│   ├── components/        # Reusable components
│   ├── stores/            # Pinia stores
│   ├── constants/         # Shared constants
│   └── router/            # Vue Router config
├── public/images/         # Reference images for Veo
└── supabase/schema.sql    # Database schema
```

## Environment Variables

```
SUPABASE_URL=              # Auto from Vercel integration
SUPABASE_SERVICE_ROLE_KEY= # Auto from Vercel integration
FAL_KEY=                   # Auto from Vercel integration
GEMINI_API_KEY=            # Manual - from Google AI Studio
```

## Deployment

```bash
vercel --prod
```

## License

MIT
