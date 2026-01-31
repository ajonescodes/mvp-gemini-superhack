# PromptPlay Sports

**You write the script. AI brings it to life.**

An AI-powered fan prediction platform where users submit predictions for NFL matchups, and AI generates anime-style video recreations based on community-weighted outcomes.

---

## The Opportunity: $50B in Untapped Fan Revenue

### The Problem: Sports Teams Can't Monetize 95% of Their Fans

**The math is brutal.** A top NFL franchise like the Dallas Cowboys has 10+ million fans worldwide—but only 80,000 can fit in AT&T Stadium on game day. The other 99%? They're watching on someone else's broadcast, wearing knockoff jerseys, and generating exactly **zero direct revenue** for the team.

| Fan Type | Revenue Per Fan | % of Fanbase |
|----------|-----------------|--------------|
| Season Ticket Holder | $3,000+/year | <1% |
| Local Fan (attends games) | $500-1,500/year | 4% |
| **Out-of-Market Fan** | **$15-50/year** | **95%** |

That's a **30x revenue gap** between local and out-of-market fans. For a franchise with 5 million out-of-market fans, that's **$7.5 billion** left on the table—per team, per year.

### Why Can't Teams Fix This?

**They have nothing to offer.**

Out-of-market fans don't buy tickets. They can't attend events. They live in the wrong city. The only touchpoint is broadcast TV—which the team doesn't control, doesn't own, and earns a fraction of the value from.

Worse: **these fans are invisible.** They're anonymous Twitter followers and Instagram likes. Not names in a CRM. Not email addresses. Not purchasers. Just... engagement metrics on platforms the team doesn't own.

Meanwhile, the Cowboys have 12 million social followers generating zero first-party data and zero direct monetization.

### The Bigger Problem: Sports Broadcasting is Stuck in 1985

Traditional sports media is **one-to-many**. One broadcast. One angle. One narrative. Millions of passive viewers.

- No personalization
- No fan participation
- No community input
- No ownership of the experience

Every other media category has been transformed by the internet:

| Industry | Old Model | New Model |
|----------|-----------|-----------|
| Music | Radio → everyone hears the same songs | Spotify → personalized playlists, discovery |
| Film | Theaters → one showing time | Netflix → watch anything, anytime |
| Social | Newspapers → editors pick stories | TikTok → algorithm + creator economy |
| **Sports** | **Broadcast → one game, one narrative** | **???** |

**Generative AI is rewriting film, music, and social media.** Sports is next.

---

## The Solution: PromptPlay Sports

**PromptPlay turns fans from passive viewers into active participants—and gives teams a direct relationship with every single one.**

### How It Works

1. **PREDICT** — Fans make predictions before the game: Who scores first? Does it go to overtime? Which player activates their "superpower"?

2. **WE GENERATE** — AI (Gemini + Veo) creates a dramatic anime-style recreation of the game, weighted by fan predictions. The community literally writes the script.

3. **WATCH & WIN** — Fans watch their predictions come to life. Correct predictions earn XP. XP unlocks exclusive rewards from the team.

### Why This Wins

| Problem | PromptPlay Solution |
|---------|---------------------|
| Can't monetize out-of-market fans | Digital-native product accessible anywhere |
| Fans are anonymous social followers | Every user is authenticated, in the CRM |
| No direct engagement with fans | Fans actively participate in content creation |
| One-size-fits-all broadcast | Personalized, community-driven narratives |
| No data on fan preferences | Rich behavioral data on every prediction |

### The Business Model

**For Teams:**
- **Freemium tiers**: Free users predict 8 categories. "Superfans" ($9.99/mo) unlock premium categories + 3x voting weight
- **XP Economy**: Fans earn points → redeem for team merchandise, experiences, meet-and-greets
- **First-party data**: Every prediction = behavioral signal. Teams finally know what their fans care about
- **Sponsorship**: "This prediction brought to you by Gatorade"

**Revenue Per Out-of-Market Fan: $50-150/year** (3-10x current)

### Why Now?

1. **Gemini 2.0 + Veo 3** make real-time, high-quality video generation possible for the first time
2. **Sports rights are fragmenting** — teams need owned content they control
3. **Gen Z expects participation**, not passive consumption
4. **The creator economy proved** audiences want to shape content, not just consume it

---

## Traction & Vision

**MVP Demo:** Super Bowl LX (Seahawks vs Patriots) — fans predict, AI generates an 8-second anime trailer based on community votes.

**Phase 1:** NFL team partnerships — white-labeled fan engagement platform
**Phase 2:** Full-game AI recreations (2-minute highlight reels → full animated games)
**Phase 3:** Expand to NBA, MLB, international football — anywhere there's an out-of-market fan problem

**The end state:** Every sports team has a direct, monetizable relationship with every fan on Earth—powered by AI content they create together.

---

## Team & Contact

Building at the intersection of AI, sports media, and fan engagement.

*[Contact info / team bios would go here]*

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
