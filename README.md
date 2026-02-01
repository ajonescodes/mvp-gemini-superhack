# PromptPlay Sports

**You write the script. AI brings it to life.**

---

## The Opportunity

**Sports teams earn 30x less from out-of-market fans than local fans**—and have nothing to offer them. These millions of fans can't attend games, remain anonymous social followers (not CRM contacts), and generate near-zero direct revenue.

Meanwhile, **generative AI is disrupting every other form of media**—film, music, social—but sports broadcasting is still stuck in 1985: one-to-many, zero fan participation, no personalization.

**PromptPlay fixes both.** Fans predict game outcomes → AI generates video content weighted by their votes → correct predictions earn XP redeemable for team rewards. Every user is authenticated (instant CRM entry), every prediction is behavioral data, and the content is something fans actually helped create.

**Result:** Teams get a direct, monetizable relationship with every fan on Earth. Fans get participation instead of passive viewing.

---

## How It Works

1. **PREDICT** — Fans vote on outcomes: Who scores first? Overtime? Which "superpower" activates?
2. **GENERATE** — Gemini + Veo create anime-style game recreations weighted by community votes
3. **WATCH & WIN** — Correct predictions earn XP → redeem for merchandise, experiences, access

---

## Business Model

- **Freemium**: Free tier (8 predictions) / Superfan tier ($9.99/mo, premium categories + 3x vote weight)
- **XP Economy**: Points → team merchandise, meet-and-greets, exclusive content
- **First-party data**: Every prediction = behavioral signal teams never had before
- **Sponsorship**: "This prediction brought to you by [Brand]"

**Target: $50-150/year per out-of-market fan** (vs. $15-50 today)

---

## Technical Documentation

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
- **AI - Script**: Gemini 3 Flash
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
