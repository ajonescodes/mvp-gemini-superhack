GridironScript Product Specification
AI-Generated NFL Fan Experience Platform
Version: 1.0
Last Updated: January 31, 2026
Demo Matchup: Super Bowl LX — Seattle Seahawks vs. New England Patriots

1. Executive Summary
GridironScript is a digital-first, weekly-serialized football experience where fans submit predictions for real NFL matchups, and AI generates anime-style video recreations based on community-weighted outcomes. The platform combines fan engagement, prediction gaming, and AI video generation into a unique sports entertainment product.

Core Value Proposition:

Fans influence the narrative through prediction submissions
AI generates cinematic anime-style game highlights
Players wear authentic team uniforms with helmets obscuring faces (avoiding likeness issues)
Weekly content drops create appointment viewing
Demo Focus: Super Bowl LX — Seattle Seahawks (14-3, NFC Champions) vs. New England Patriots (14-3, AFC Champions), February 8, 2026

2. Product Architecture Overview
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           GRIDIRON SCRIPT PLATFORM                               │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────┐                    │
│  │                    VUE.JS 3 FRONTEND                    │                    │
│  ├──────────────────────────┬──────────────────────────────┤                    │
│  │     FAN SITE (/)         │    ADMIN (/admin) 🔒        │                    │
│  │                          │                              │                    │
│  │  • Home                  │  • Dashboard                 │                    │
│  │  • /predict              │  • /admin/matchups           │                    │
│  │  • /leaderboard          │  • /admin/scripts            │                    │
│  │  • /profile              │  • /admin/videos             │                    │
│  │                          │                              │                    │
│  │  [PUBLIC + AUTH USERS]   │  [ADMIN ONLY - SECRET URL]   │                    │
│  └──────────────────────────┴──────────────────────────────┘                    │
│                              │                                                   │
│                              ▼                                                   │
│  ┌────────────────┐    ┌────────────────┐    ┌────────────────┐                 │
│  │    VERCEL      │    │   SUPABASE     │    │   GEMINI 3     │                 │
│  │   FUNCTIONS    │───▶│   (PostgreSQL) │    │   FLASH        │                 │
│  │                │    │                │    │                │                 │
│  │ • /api/auth/*  │    │ • Users        │    │ • Aggregate    │                 │
│  │ • /api/predict │    │ • Sessions     │    │ • Weight votes │                 │
│  │ • /api/admin/* │    │ • Predictions  │    │ • Gen scripts  │                 │
│  │   [PROTECTED]  │    │ • Scripts      │    │                │                 │
│  └────────────────┘    └────────────────┘    └────────────────┘                 │
│                                                       │                          │
│                                                       ▼                          │
│                              ┌────────────────┐    ┌────────────────┐           │
│                              │    FAL.AI      │    │    OUTPUT      │           │
│                              │    VEO 3.1     │───▶│                │           │
│                              │                │    │ ✅ 10s trailer │           │
│                              │ • Render anime │    │ 📦 2m (later)  │           │
│                              │ • Audio sync   │    │                │           │
│                              └────────────────┘    └────────────────┘           │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
URL Structure:

URL	Access	Purpose
/	Public	Fan home, current matchup, how it works
/predict	Logged-in users	Submit predictions
/leaderboard	Public	XP rankings
/profile	Logged-in users	User stats, history
/admin	⚠️ Demo: Anyone	Dashboard (secret URL, not linked anywhere)
/admin/*	⚠️ Demo: Anyone	Matchups, scripts, videos, users
3. Demo Matchup: Super Bowl LX
Team Profiles
Seattle Seahawks (NFC Champions)
Attribute	Value
Record	14-3 (Regular Season)
Seed	#1 NFC
Head Coach	Mike Macdonald (2nd year)
Key Players	Sam Darnold (QB), Devon Witherspoon (CB), Jaxon Smith-Njigba (WR)
Playstyle	Balanced attack, Legion of Boom 2.0 defense
Primary Colors	College Navy (#002244), Action Green (#69BE28)
Super Bowl History	3 appearances, 1 win (XLVIII)
New England Patriots (AFC Champions)
Attribute	Value
Record	14-3 (Regular Season)
Seed	#2 AFC
Head Coach	Mike Vrabel (1st year)
Key Players	Drake Maye (QB - NFL Most Improved), Stefon Diggs (WR)
Playstyle	Efficient offense, opportunistic defense
Primary Colors	Navy Blue (#002244), Red (#C60C30), Silver (#B0B7BC)
Super Bowl History	11 appearances, 6 wins (most in NFL history)
Historical Context
Previous Meeting: Super Bowl XLIX (Patriots 28, Seahawks 24)
Narrative: Rematch 11 years later; Seahawks seeking redemption
Venue: Levi's Stadium, Santa Clara, CA
4. Fan Prediction Categories
4.1 Tier Structure
Free Tier ($0)
Access to basic predictions only:

Opening possession predictions
Final outcome (winner only)
1 script submission per matchup
Member Tier ($4.99/mo)
Unlocks intermediate predictions:

All Free tier predictions
Scoring pace predictions
Momentum swing predictions
3 script submissions per matchup
Priority voting weight (1.5x)
Superfan Tier ($14.99/mo)
Full access + premium features:

All predictions unlocked
Fantasy stadium selection
Power-up timing control
Unlimited script submissions
Captain's Vote weight (3x)
Early access to generated videos
4.2 How XP Multipliers Work
Core Concept: Higher risk = higher reward. Multipliers work like odds — rarer outcomes pay more XP if you're correct.

Calculation
XP Earned = Base XP (100) × Multiplier    (if prediction correct)
XP Earned = 0                              (if prediction wrong)
Example Scenarios
Prediction	Your Pick	Multiplier	Actual Outcome	XP Earned
Who scores first?	Patriots	2.0x	Patriots score first ✅	100 × 2.0 = 200 XP
Who scores first?	Patriots	2.0x	Seahawks score first ❌	0 XP
First score method?	Safety	8.0x	Safety happens ✅	100 × 8.0 = 800 XP
Overtime?	Yes	5.0x	Game goes to OT ✅	100 × 5.0 = 500 XP
Multiplier Tiers
Multiplier Range	Risk Level	Example Predictions
1.2x - 1.8x	Safe bet	"Game ends in regulation", "Favorite wins"
2.0x - 3.0x	Coin flip	"Who scores first?", "Victory margin"
3.5x - 5.0x	Risky	"Overtime happens", "4+ consecutive scores"
6.0x - 12.0x	Long shot	"Safety on first score", "Defensive TD"
Why This System Works
Engagement: Fans are incentivized to make bold picks, not just safe ones
Skill Rewards: Savvy fans who spot undervalued outcomes earn more
Drama: Creates rooting interest even for unlikely scenarios
Replayability: Different strategy each week (go safe vs. swing for the fences)
XP Leaderboards
Leaderboard	Reset Frequency	Rewards
Weekly	Every matchup	Badge + bonus card pack
Monthly	End of month	Exclusive cosmetics
Season	End of NFL season	"Prophet" title + premium rewards
4.3 Prediction Categories
Category 01: Opening Possession
Question: Who scores first?

Option	XP Multiplier
Seattle Seahawks	1.8x
New England Patriots	2.0x
Category 02: First Score Method
Question: How is the first score achieved?

Option	XP Multiplier
Seahawks Touchdown	2.0x
Seahawks Field Goal	2.5x
Patriots Touchdown	2.2x
Patriots Field Goal	2.7x
Safety	12.0x
Category 03: First Touchdown Scorer (Position)
Question: What position scores the first TD?

Option	XP Multiplier
Wide Receiver	1.6x
Running Back	2.0x
Tight End	2.8x
Quarterback (rush)	5.0x
Defensive/Special Teams	8.0x
Category 04: Scoring Pace
Question: Total combined points?

Option	XP Multiplier
Under 35 points	2.3x
35-50 points	1.5x
Over 50 points	2.8x
Category 05: Range Game — First Three-Pointer (Field Goal)
Question: Who hits the first field goal?

Option	XP Multiplier
Seattle Seahawks	1.6x
New England Patriots	2.2x
No field goals made	3.5x
Category 06: Highlight Reel — Most Consecutive Scores
🔒 Superfan Only Question: Longest scoring streak by one team?

Option	XP Multiplier
2 in a row	2.0x
3 in a row	3.0x
4+ in a row	5.0x
Category 07: Power-Up Selection — Seahawks
🔒 Superfan Only Question: Which superpower does Seattle unleash?

Option	XP Multiplier
⚡ SUPER SPEED — One player moves 2x faster for a play	2.0x
🛡️ FORCE FIELD — Block any one tackle attempt	2.5x
🔥 LASER ARM — QB throws cannot be intercepted for one drive	3.0x
Category 08: Power-Up Selection — Patriots
🔒 Superfan Only Question: Which superpower does New England unleash?

Option	XP Multiplier
⚡ SUPER SPEED — One player moves 2x faster for a play	2.0x
🧲 MAGNET HANDS — Next catch attempt cannot be dropped	2.5x
👁️ X-RAY VISION — Defense reads the play perfectly, guaranteed sack or INT	3.5x
Category 09: Power-Up Timing
🔒 Superfan Only Question: When does the superpower activate?

Option	XP Multiplier
🎬 OPENING DRIVE — Start strong, set the tone	1.5x
⏰ HALFTIME HEROICS — Final 2 minutes of 2nd quarter	2.5x
🏆 CLUTCH TIME — 4th quarter only	3.0x
Category 10: Final Outcome
Question: Who wins Super Bowl LX?

Option	XP Multiplier
Seattle Seahawks	2.1x
New England Patriots	1.9x
Category 11: Victory Margin
Question: Final point differential?

Option	XP Multiplier
1-7 points (one score)	2.0x
8-14 points (two scores)	1.8x
15+ points (blowout)	2.5x
Category 12: Overtime
Question: Does the game go to OT?

Option	XP Multiplier
No — ends in regulation	1.2x
Yes — overtime required	5.0x
4.4 Stadium Selection (Superfan Tier)
Fans vote on fantastical stadium variants that affect visual style and gameplay modifiers:

Classic Venues
Stadium	Description	Visual Style	Gameplay Effect
Levi's Stadium (Default)	Actual Super Bowl LX venue	Realistic, sunny California	Neutral baseline
Frozen Tundra	Snow-covered Lambeau-style	Blizzard effects, breath vapor	+15% fumble chance
Dome Cathedral	Indoor retractable roof	Perfect lighting, crowd roar	Pure skill matchup
Fantasy Arenas (Superfan Exclusive)
Stadium	Description	Visual Style	Gameplay Effect
Neon Vegas Strip	Midnight game on the Strip	Cyberpunk, LED everything	"Showtime" bonus for big plays
Space Station Gridiron	Orbital zero-G sections	Sci-fi, Earth backdrop	Altered physics on certain plays
Ancient Colosseum	Roman ruins aesthetic	Gladiator anime style	"Crowd Roar" momentum swings
Underwater Dome	Submerged glass arena	Deep blue, bioluminescent	Dreamlike slow-motion moments
Mountain Summit	10,000 ft elevation peak	Thin air, epic vistas	Increased fatigue effects
5. Power-Up System: Superpowers Unleashed
Each team gets ONE superpower per game. Fans vote on which power AND when it activates. Think Avengers meets the NFL.

Available Superpowers
⚡ SUPER SPEED
"The world slows down. One player becomes a blur."

Effect: Chosen player moves at 2x speed for one play
Visual: Lightning trails, slow-motion everyone else, sonic boom effects
Best For: Breakaway runs, deep routes, kick returns

🛡️ FORCE FIELD
"An invisible wall. Nothing gets through."

Effect: Blocks any ONE tackle attempt completely
Visual: Blue energy shield ripples on impact, tackler bounces off
Best For: Goal line stands, breaking through the pile

🔥 LASER ARM
"The ball cuts through the air like a missile."

Effect: QB throws cannot be intercepted for one full drive
Visual: Red tracer on the ball, heat distortion, perfect spirals
Best For: Aggressive downfield passing, comeback drives

🧲 MAGNET HANDS
"The ball finds him. Always."

Effect: Next catch attempt is 100% successful, no drops possible
Visual: Gold magnetic energy between hands and ball
Best For: Clutch 3rd down conversions, contested catches

👁️ X-RAY VISION
"They see everything before it happens."

Effect: Defense perfectly reads the next play — guaranteed sack OR interception
Visual: Freeze frame with glowing player outlines, "prediction lines" showing the play
Best For: Stopping momentum, creating turnovers

🌪️ UNSTOPPABLE FORCE
"He cannot be brought down."

Effect: Ball carrier breaks through ALL tackles for one play
Visual: Orange energy aura, defenders flying backward on impact
Best For: Short yardage, touchdown pushes

Activation Timing
Fans also vote on WHEN the superpower triggers:

Timing	Description	Drama Level
🎬 OPENING DRIVE	Use it immediately, set the tone	⭐⭐
⏰ HALFTIME HEROICS	Final 2 minutes before the half	⭐⭐⭐
🏆 CLUTCH TIME	4th quarter only, maximum stakes	⭐⭐⭐⭐⭐
Visual Treatment in Video
When a superpower activates:

FREEZE FRAME — Action stops, dramatic music sting
POWER REVEAL — Icon appears on screen with team colors
ACTIVATION — Anime-style transformation sequence (1-2 seconds)
EXECUTION — The play unfolds with enhanced visual effects
AFTERMATH — Slow-motion replay of the powered moment
6. Technical Workflow Specification
6.1 System Components
Component 1: Fan Web Application (Main Site)
Technology Stack:

Frontend: Vue.js 3 + TypeScript + Tailwind CSS
State Management: Pinia
Deployment: Vercel (static + functions)
Fan-Facing Routes:

/                    # Home — current matchup, hero, how it works
/predict             # Prediction builder (requires login)
/leaderboard         # XP rankings
/profile             # User stats, prediction history
/login               # Auth modal (can also be overlay)
/register            # Auth modal
Key Features:

Responsive prediction interface
Real-time submission counters
Tiered access control (Free/Member/Superfan)
XP tracking dashboard
Component 2: Admin Dashboard (/admin)
Access: Secret URL only (not linked from main site)

Admin-Only Routes:

/admin               # Dashboard overview
/admin/matchups      # Create/edit/close matchups
/admin/predictions   # View all submissions, vote distributions
/admin/scripts       # Review generated JSON, trigger renders
/admin/videos        # Preview trailers, manage uploads
/admin/users         # User management, tier overrides
Demo Mode Protection:

Not linked from main navigation (security through obscurity)
Access via direct URL: /admin
No authentication required for demo
TODO (Production): Add is_admin flag and proper auth
Component 3: Vercel Functions (Serverless Backend)
All API routes run as Vercel Functions, connecting to Supabase:

/api/
├── auth/
│   ├── register.ts      # Create account (email/password/username)
│   ├── login.ts         # Sign in
│   ├── logout.ts        # Sign out
│   └── me.ts            # Get current user
├── predictions/
│   ├── submit.ts        # Submit prediction
│   ├── list.ts          # Get user's predictions
│   └── results.ts       # Get prediction outcomes
├── matchups/
│   ├── current.ts       # Get active matchup
│   └── history.ts       # Past matchups
├── admin/               # ⚠️ DEMO MODE: No auth required
│   ├── matchups.ts      # CRUD matchups
│   ├── generate-script.ts   # Trigger Gemini 3 Flash
│   ├── render-trailer.ts    # Trigger Veo 3.1 (trailer only)
│   ├── render-full.ts       # Trigger Veo 3.1 (full episode)
│   └── users.ts         # User management
└── webhooks/
    └── fal-complete.ts      # Handle render completion
Supabase client is initialized in Vercel Functions, not exposed to frontend:

// /api/_lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Server-side only
);
Database Schema:

-- Users table (with username + password hash)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'member', 'superfan')),
  xp_total INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table (for auth tokens)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- Matchups table
CREATE TABLE matchups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  matchup_date DATE NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'processing', 'complete')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Predictions table
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  matchup_id UUID REFERENCES matchups(id),
  category TEXT NOT NULL,
  selection TEXT NOT NULL,
  tier_weight DECIMAL DEFAULT 1.0,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, matchup_id, category)
);

-- Stadium votes table
CREATE TABLE stadium_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  matchup_id UUID REFERENCES matchups(id),
  stadium_selection TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, matchup_id)
);

-- Power-up selections table
CREATE TABLE powerup_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  matchup_id UUID REFERENCES matchups(id),
  team TEXT NOT NULL,
  powerup TEXT NOT NULL,
  timing TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated scripts table
CREATE TABLE generated_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matchup_id UUID REFERENCES matchups(id),
  script_json JSONB NOT NULL,
  video_url_full TEXT,
  video_url_trailer TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);
6.2 User Authentication (Email/Password/Username)
Registration Endpoint
// /api/auth/register.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, username, password } = req.body;

  // Validation
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Email, username, and password required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ error: 'Username must be 3-20 characters' });
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({ error: 'Username can only contain letters, numbers, underscores' });
  }

  try {
    // Check if email or username exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .single();

    if (existing) {
      return res.status(409).json({ error: 'Email or username already taken' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({ email, username, password_hash })
      .select('id, email, username, tier, xp_total')
      .single();

    if (error) throw error;

    // Create session token
    const token = randomUUID();
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await supabase
      .from('sessions')
      .insert({ user_id: user.id, token, expires_at });

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', `session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`);

    return res.status(201).json({ user });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
}
Login Endpoint
// /api/auth/login.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, username, password_hash, tier, xp_total')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create session token
    const token = randomUUID();
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await supabase
      .from('sessions')
      .insert({ user_id: user.id, token, expires_at });

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', `session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`);

    // Return user (without password_hash)
    const { password_hash, ...safeUser } = user;
    return res.status(200).json({ user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
}
Get Current User Endpoint
// /api/auth/me.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';
import { parse } from 'cookie';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookies = parse(req.headers.cookie || '');
  const token = cookies.session;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Find valid session
    const { data: session } = await supabase
      .from('sessions')
      .select('user_id, expires_at')
      .eq('token', token)
      .single();

    if (!session || new Date(session.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Session expired' });
    }

    // Get user
    const { data: user } = await supabase
      .from('users')
      .select('id, email, username, tier, xp_total, created_at')
      .eq('id', session.user_id)
      .single();

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error('Auth check error:', err);
    return res.status(500).json({ error: 'Auth check failed' });
  }
}
Logout Endpoint
// /api/auth/logout.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';
import { parse } from 'cookie';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookies = parse(req.headers.cookie || '');
  const token = cookies.session;

  if (token) {
    // Delete session from database
    await supabase.from('sessions').delete().eq('token', token);
  }

  // Clear cookie
  res.setHeader('Set-Cookie', 'session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');

  return res.status(200).json({ message: 'Logged out' });
}
Auth Middleware Helper
// /api/_lib/auth.ts
import { VercelRequest } from '@vercel/node';
import { supabase } from './supabase';
import { parse } from 'cookie';

interface AuthUser {
  id: string;
  email: string;
  username: string;
  tier: string;
  xp_total: number;
}

export async function getAuthUser(req: VercelRequest): Promise<AuthUser | null> {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.session;

  if (!token) return null;

  const { data: session } = await supabase
    .from('sessions')
    .select('user_id, expires_at')
    .eq('token', token)
    .single();

  if (!session || new Date(session.expires_at) < new Date()) {
    return null;
  }

  const { data: user } = await supabase
    .from('users')
    .select('id, email, username, tier, xp_total')
    .eq('id', session.user_id)
    .single();

  return user;
}

export function getTierWeight(tier: string): number {
  return { free: 1.0, member: 1.5, superfan: 3.0 }[tier] || 1.0;
}
Example Admin Endpoint (Demo Mode - No Auth)
// /api/admin/generate-script.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ⚠️ DEMO MODE: No authentication required
  // TODO (Production): Add admin authentication
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { matchupId } = req.body;
  
  // ... generate script logic
  
  return res.status(200).json({ success: true });
}
6.3 Vue.js Frontend Auth Integration
Auth Store (Pinia)
// stores/auth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: string;
  email: string;
  username: string;
  tier: 'free' | 'member' | 'superfan';
  xp_total: number;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(true);

  const isLoggedIn = computed(() => !!user.value);
  const isMember = computed(() => user.value?.tier === 'member' || user.value?.tier === 'superfan');
  const isSuperfan = computed(() => user.value?.tier === 'superfan');

  async function checkAuth() {
    loading.value = true;
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        user.value = data.user;
      } else {
        user.value = null;
      }
    } catch {
      user.value = null;
    } finally {
      loading.value = false;
    }
  }

  async function register(email: string, username: string, password: string) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    user.value = data.user;
    return data.user;
  }

  async function login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    user.value = data.user;
    return data.user;
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    user.value = null;
  }

  return { user, loading, isLoggedIn, isMember, isSuperfan, checkAuth, register, login, logout };
});
Login/Register Component
<!-- components/AuthModal.vue -->
<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div class="bg-slate-800 rounded-xl p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-white mb-6">
        {{ isLogin ? 'Welcome Back' : 'Create Account' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-slate-300 text-sm mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div v-if="!isLogin">
          <label class="block text-slate-300 text-sm mb-1">Username</label>
          <input
            v-model="form.username"
            type="text"
            required
            minlength="3"
            maxlength="20"
            pattern="[a-zA-Z0-9_]+"
            class="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
          />
          <p class="text-slate-400 text-xs mt-1">3-20 characters, letters/numbers/underscores only</p>
        </div>

        <div>
          <label class="block text-slate-300 text-sm mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            minlength="8"
            class="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition disabled:opacity-50"
        >
          {{ loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account') }}
        </button>
      </form>

      <p class="text-slate-400 text-center mt-6">
        {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
        <button @click="isLogin = !isLogin" class="text-orange-400 hover:underline ml-1">
          {{ isLogin ? 'Sign up' : 'Sign in' }}
        </button>
      </p>

      <button @click="$emit('close')" class="absolute top-4 right-4 text-slate-400 hover:text-white">
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';

const emit = defineEmits(['close']);
const auth = useAuthStore();

const isLogin = ref(true);
const loading = ref(false);
const error = ref('');

const form = reactive({
  email: '',
  username: '',
  password: ''
});

async function handleSubmit() {
  loading.value = true;
  error.value = '';

  try {
    if (isLogin.value) {
      await auth.login(form.email, form.password);
    } else {
      await auth.register(form.email, form.username, form.password);
    }
    emit('close');
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>
Vue Router (Demo Mode)
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Fan-facing pages
import Home from '@/views/Home.vue';
import Predict from '@/views/Predict.vue';
import Leaderboard from '@/views/Leaderboard.vue';
import Profile from '@/views/Profile.vue';

// Admin pages (lazy-loaded)
const AdminDashboard = () => import('@/views/admin/Dashboard.vue');
const AdminMatchups = () => import('@/views/admin/Matchups.vue');
const AdminScripts = () => import('@/views/admin/Scripts.vue');
const AdminVideos = () => import('@/views/admin/Videos.vue');
const AdminUsers = () => import('@/views/admin/Users.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ========== FAN-FACING ROUTES ==========
    { path: '/', name: 'home', component: Home },
    { path: '/predict', name: 'predict', component: Predict, meta: { requiresAuth: true } },
    { path: '/leaderboard', name: 'leaderboard', component: Leaderboard },
    { path: '/profile', name: 'profile', component: Profile, meta: { requiresAuth: true } },

    // ========== ADMIN ROUTES (⚠️ DEMO MODE: No auth required) ==========
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboard,
      // No meta.requiresAdmin for demo mode
      children: [
        { path: '', name: 'admin-dashboard', component: AdminDashboard },
        { path: 'matchups', name: 'admin-matchups', component: AdminMatchups },
        { path: 'scripts', name: 'admin-scripts', component: AdminScripts },
        { path: 'videos', name: 'admin-videos', component: AdminVideos },
        { path: 'users', name: 'admin-users', component: AdminUsers },
      ]
    },

    // Catch-all redirect
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  
  // Wait for auth check on first load
  if (auth.loading) {
    await auth.checkAuth();
  }

  // Check if route requires authentication (fan routes only)
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next({ name: 'home', query: { login: 'true' } });
  }

  // ⚠️ DEMO MODE: Admin routes accessible to anyone
  // TODO (Production): Add admin authentication check here

  next();
});

export default router;
Admin Layout Component
<!-- views/admin/Dashboard.vue -->
<template>
  <div class="min-h-screen bg-slate-900 flex">
    <!-- Admin Sidebar -->
    <aside class="w-64 bg-slate-800 p-6">
      <h1 class="text-xl font-bold text-orange-500 mb-2">⚠️ Admin Panel</h1>
      <p class="text-xs text-yellow-400 mb-8">DEMO MODE — No auth required</p>
      
      <nav class="space-y-2">
        <router-link 
          to="/admin" 
          class="block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700"
          exact-active-class="bg-orange-500/20 text-orange-400"
        >
          Dashboard
        </router-link>
        <router-link 
          to="/admin/matchups" 
          class="block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700"
          active-class="bg-orange-500/20 text-orange-400"
        >
          Matchups
        </router-link>
        <router-link 
          to="/admin/scripts" 
          class="block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700"
          active-class="bg-orange-500/20 text-orange-400"
        >
          Scripts & Render
        </router-link>
        <router-link 
          to="/admin/videos" 
          class="block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700"
          active-class="bg-orange-500/20 text-orange-400"
        >
          Videos
        </router-link>
        <router-link 
          to="/admin/users" 
          class="block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700"
          active-class="bg-orange-500/20 text-orange-400"
        >
          Users
        </router-link>
      </nav>

      <div class="mt-8 pt-8 border-t border-slate-700">
        <router-link to="/" class="text-slate-400 hover:text-white text-sm">
          ← Back to Fan Site
        </router-link>
      </div>
    </aside>

    <!-- Admin Content -->
    <main class="flex-1 p-8">
      <router-view />
    </main>
  </div>
</template>
6.4 Script Generation (Admin Workflow)
Trigger: Admin initiates after prediction window closes

Process:

Query all predictions for matchup
Calculate weighted outcomes per category
Send to Gemini 3 Flash for narrative script generation
Output structured JSON with timestamps
Store script in database
6.5 Gemini 3 Flash Script Generation
API Integration
// scripts/generate-script.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function aggregatePredictions(matchupId) {
  // Fetch all predictions with tier weights
  const { data: predictions } = await supabase
    .from("predictions")
    .select(`
      category,
      selection,
      tier_weight,
      users!inner(tier)
    `)
    .eq("matchup_id", matchupId);

  // Calculate weighted outcomes per category
  const outcomes = {};
  
  for (const pred of predictions) {
    const weight = pred.tier_weight * getTierMultiplier(pred.users.tier);
    
    if (!outcomes[pred.category]) {
      outcomes[pred.category] = {};
    }
    
    if (!outcomes[pred.category][pred.selection]) {
      outcomes[pred.category][pred.selection] = 0;
    }
    
    outcomes[pred.category][pred.selection] += weight;
  }

  // Normalize to percentages and determine winners
  const finalOutcomes = {};
  for (const [category, selections] of Object.entries(outcomes)) {
    const total = Object.values(selections).reduce((a, b) => a + b, 0);
    const winner = Object.entries(selections)
      .sort((a, b) => b[1] - a[1])[0];
    
    finalOutcomes[category] = {
      winner: winner[0],
      confidence: (winner[1] / total * 100).toFixed(1),
      allVotes: selections
    };
  }

  return finalOutcomes;
}

function getTierMultiplier(tier) {
  return { free: 1.0, member: 1.5, superfan: 3.0 }[tier] || 1.0;
}

async function generateScript(matchupId) {
  const outcomes = await aggregatePredictions(matchupId);
  
  // Fetch matchup details
  const { data: matchup } = await supabase
    .from("matchups")
    .select("*")
    .eq("id", matchupId)
    .single();

  // Fetch winning stadium
  const { data: stadiumVotes } = await supabase
    .from("stadium_votes")
    .select("stadium_selection")
    .eq("matchup_id", matchupId);
  
  const stadiumCounts = {};
  stadiumVotes.forEach(v => {
    stadiumCounts[v.stadium_selection] = (stadiumCounts[v.stadium_selection] || 0) + 1;
  });
  const winningStadium = Object.entries(stadiumCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "levis_stadium";

  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `
You are a sports screenplay writer creating an anime-style football game script.

MATCHUP: ${matchup.away_team} vs ${matchup.home_team}
STADIUM: ${winningStadium}
DATE: Super Bowl LX

FAN-VOTED OUTCOMES (use these as canonical events):
${JSON.stringify(outcomes, null, 2)}

IMPORTANT VISUAL CONSTRAINTS:
- All players wear full helmets with dark visors - faces are NEVER visible
- Uniforms match real team colors exactly:
  * Seahawks: College Navy (#002244), Action Green (#69BE28), Wolf Grey
  * Patriots: Navy Blue (#002244), Red (#C60C30), Silver (#B0B7BC)
- Anime style: dynamic action lines, dramatic angles, speed effects
- No real player names - use jersey numbers and positions only

Generate TWO scripts in JSON format:

1. FULL GAME SCRIPT (2 minutes / 120 seconds)
2. TRAILER SCRIPT (10 seconds)

Each script should have this structure:
{
  "type": "full" | "trailer",
  "duration_seconds": number,
  "stadium": "${winningStadium}",
  "teams": {
    "home": { "name": "Seattle Seahawks", "colors": ["#002244", "#69BE28"] },
    "away": { "name": "New England Patriots", "colors": ["#002244", "#C60C30"] }
  },
  "scenes": [
    {
      "scene_id": number,
      "start_time": number (seconds),
      "end_time": number (seconds),
      "scene_type": "establishing" | "gameplay" | "celebration" | "tension" | "climax",
      "camera": {
        "shot_type": "wide" | "medium" | "close-up" | "aerial" | "tracking",
        "movement": "static" | "pan_left" | "pan_right" | "zoom_in" | "zoom_out" | "dolly"
      },
      "visual_description": "Detailed description for video generation...",
      "audio": {
        "crowd_intensity": 1-10,
        "commentary_cue": "optional narration text",
        "sfx": ["crowd_roar", "whistle", "impact", "music_swell"]
      },
      "game_state": {
        "quarter": number,
        "time_remaining": "string",
        "score_home": number,
        "score_away": number,
        "possession": "home" | "away",
        "down_and_distance": "optional string"
      }
    }
  ],
  "key_moments": [
    {
      "timestamp": number,
      "event": "first_score" | "lead_change" | "turnover" | "powerup_activation" | "game_winner",
      "description": "Brief description"
    }
  ]
}

FULL SCRIPT REQUIREMENTS:
- Must be exactly 120 seconds
- Include all fan-voted outcomes naturally
- Build dramatic tension toward the final outcome
- 15-20 scenes minimum
- Include SUPERHERO-STYLE power-up activation: freeze frame, icon reveal, transformation, execution
- Power-ups are: SUPER SPEED (⚡), FORCE FIELD (🛡️), LASER ARM (🔥), MAGNET HANDS (🧲), X-RAY VISION (👁️), UNSTOPPABLE FORCE (🌪️)

TRAILER SCRIPT REQUIREMENTS:
- Must be exactly 10 seconds
- Fast cuts, high energy
- Tease the key dramatic moment
- End with "GridironScript" title card
- 5-7 rapid scenes

Return ONLY valid JSON with both scripts in an array: [fullScript, trailerScript]
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Parse JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Failed to parse script JSON");
  
  const scripts = JSON.parse(jsonMatch[0]);
  
  // Store in database
  await supabase
    .from("generated_scripts")
    .insert({
      matchup_id: matchupId,
      script_json: { full: scripts[0], trailer: scripts[1] }
    });

  return scripts;
}

export { generateScript, aggregatePredictions };
6.6 Video Generation (fal.ai Veo 3.1)
API Integration
// scripts/render-video.js
import { fal } from "@fal-ai/client";
import { createClient } from "@supabase/supabase-js";

fal.config({ credentials: process.env.FAL_KEY });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function renderScene(scene, scriptContext) {
  const duration = scene.end_time - scene.start_time;
  
  // Build detailed prompt for Veo 3.1
  const prompt = buildScenePrompt(scene, scriptContext);
  
  const result = await fal.subscribe("fal-ai/veo3.1", {
    input: {
      prompt: prompt,
      aspect_ratio: "16:9",
      duration: `${Math.min(duration, 8)}s`, // Veo max 8s per clip
      resolution: "1080p",
      audio_enabled: true
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        console.log(`Scene ${scene.scene_id}: ${update.logs?.slice(-1)[0]?.message}`);
      }
    }
  });

  return {
    scene_id: scene.scene_id,
    video_url: result.data.video.url,
    duration: duration
  };
}

function buildScenePrompt(scene, context) {
  const { teams, stadium } = context;
  
  // Stadium-specific visual modifiers
  const stadiumStyles = {
    "levis_stadium": "sunny California stadium, realistic lighting",
    "frozen_tundra": "heavy snow falling, breath visible, icy field",
    "neon_vegas": "midnight, neon lights everywhere, cyberpunk aesthetic",
    "space_station": "orbital view of Earth through dome, futuristic",
    "ancient_colosseum": "Roman ruins, gladiator aesthetic, torchlight",
    "underwater_dome": "deep blue water outside glass dome, bioluminescent"
  };

  const styleModifier = stadiumStyles[stadium] || stadiumStyles["levis_stadium"];

  return `
Anime-style American football scene. ${styleModifier}

VISUAL: ${scene.visual_description}

TEAMS:
- Home team (Seahawks): Navy blue (#002244) and bright green (#69BE28) uniforms
- Away team (Patriots): Navy blue (#002244) and red (#C60C30) uniforms

CRITICAL: All players wear football helmets with dark visors - NO faces visible.
Style: Japanese sports anime (like Eyeshield 21), dynamic action lines, dramatic angles.

Camera: ${scene.camera.shot_type} shot, ${scene.camera.movement}

Audio: Crowd intensity ${scene.audio.crowd_intensity}/10. ${scene.audio.commentary_cue || ""}

Game situation: Q${scene.game_state.quarter}, ${scene.game_state.time_remaining} remaining.
Score: Seahawks ${scene.game_state.score_home} - Patriots ${scene.game_state.score_away}
`.trim();
}

async function renderTrailerOnly(matchupId) {
  // Fetch script (both full and trailer were generated by Gemini)
  const { data: scriptData } = await supabase
    .from("generated_scripts")
    .select("script_json")
    .eq("matchup_id", matchupId)
    .single();

  const fullScript = scriptData.script_json.full;
  const trailerScript = scriptData.script_json.trailer;

  // LOG: Full script is stored but NOT rendered (saves cost)
  console.log(`Full script generated with ${fullScript.scenes.length} scenes (${fullScript.duration_seconds}s)`);
  console.log("Full script saved to database for future rendering.");
  console.log("---");

  // RENDER: Only the 10-second trailer
  console.log("Rendering TRAILER ONLY (10 seconds)...");
  const trailerSceneVideos = [];
  
  for (const scene of trailerScript.scenes) {
    console.log(`Rendering trailer scene ${scene.scene_id}/${trailerScript.scenes.length}...`);
    const rendered = await renderScene(scene, trailerScript);
    trailerSceneVideos.push(rendered);
    
    // Rate limiting pause between API calls
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Concatenate trailer clips
  const trailerVideoUrl = await concatenateVideos(trailerSceneVideos, "trailer");

  // Update database with trailer URL only
  // Full video URL remains null until admin triggers full render
  await supabase
    .from("generated_scripts")
    .update({
      video_url_trailer: trailerVideoUrl,
      video_url_full: null // Not rendered yet
    })
    .eq("matchup_id", matchupId);

  console.log("✅ Trailer rendered successfully!");
  console.log(`Trailer URL: ${trailerVideoUrl}`);

  return { 
    trailerVideoUrl,
    fullScriptReady: true,
    fullScriptSceneCount: fullScript.scenes.length,
    message: "Full 2-minute script is stored. Trigger renderFullEpisode() when ready."
  };
}

// OPTIONAL: Render full episode later (cost: ~$36)
async function renderFullEpisode(matchupId) {
  const { data: scriptData } = await supabase
    .from("generated_scripts")
    .select("script_json")
    .eq("matchup_id", matchupId)
    .single();

  const fullScript = scriptData.script_json.full;

  console.log(`Rendering FULL EPISODE (${fullScript.duration_seconds} seconds, ${fullScript.scenes.length} scenes)...`);
  console.log("⚠️ Estimated cost: ~$36 for 120 seconds of Veo 3.1 rendering");
  
  const fullSceneVideos = [];
  
  for (const scene of fullScript.scenes) {
    console.log(`Rendering scene ${scene.scene_id}/${fullScript.scenes.length}...`);
    const rendered = await renderScene(scene, fullScript);
    fullSceneVideos.push(rendered);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  const fullVideoUrl = await concatenateVideos(fullSceneVideos, "full");

  await supabase
    .from("generated_scripts")
    .update({ video_url_full: fullVideoUrl })
    .eq("matchup_id", matchupId);

  console.log("✅ Full episode rendered!");
  return { fullVideoUrl };
}

async function concatenateVideos(sceneVideos, type) {
  // Use fal's FFmpeg utilities or external service
  // This is a placeholder for the concatenation logic
  
  const videoUrls = sceneVideos.map(s => s.video_url);
  
  // Option 1: Use fal's video composition API
  // Option 2: Download and process with FFmpeg locally
  // Option 3: Use a cloud video processing service
  
  // For MVP, return the first video as placeholder
  // Full implementation would stitch all clips together
  
  console.log(`Concatenating ${videoUrls.length} clips for ${type} video`);
  return videoUrls[0]; // Placeholder
}

export { renderTrailerOnly, renderFullEpisode, renderScene };
6.7 Sample Generated Script JSON
{
  "type": "full",
  "duration_seconds": 120,
  "stadium": "levis_stadium",
  "teams": {
    "home": {
      "name": "Seattle Seahawks",
      "colors": ["#002244", "#69BE28"]
    },
    "away": {
      "name": "New England Patriots",
      "colors": ["#002244", "#C60C30"]
    }
  },
  "scenes": [
    {
      "scene_id": 1,
      "start_time": 0,
      "end_time": 8,
      "scene_type": "establishing",
      "camera": {
        "shot_type": "aerial",
        "movement": "slow_zoom_in"
      },
      "visual_description": "Sweeping aerial shot of Levi's Stadium at sunset. 70,000 fans in team colors. Giant 'SUPER BOWL LX' banner. Camera slowly pushes toward the 50-yard line.",
      "audio": {
        "crowd_intensity": 8,
        "commentary_cue": "Welcome to Super Bowl Sixty... where legends are made.",
        "sfx": ["crowd_roar", "flyover_jets"]
      },
      "game_state": {
        "quarter": 1,
        "time_remaining": "15:00",
        "score_home": 0,
        "score_away": 0,
        "possession": null,
        "down_and_distance": null
      }
    },
    {
      "scene_id": 2,
      "start_time": 8,
      "end_time": 14,
      "scene_type": "gameplay",
      "camera": {
        "shot_type": "medium",
        "movement": "tracking"
      },
      "visual_description": "Coin toss at midfield. Seahawks captain in navy and green raises fist as coin lands. Cut to Patriots captain shaking head. Seahawks win the toss.",
      "audio": {
        "crowd_intensity": 7,
        "commentary_cue": "Seattle wins the toss and elects to receive.",
        "sfx": ["whistle"]
      },
      "game_state": {
        "quarter": 1,
        "time_remaining": "15:00",
        "score_home": 0,
        "score_away": 0,
        "possession": "home",
        "down_and_distance": null
      }
    },
    {
      "scene_id": 3,
      "start_time": 14,
      "end_time": 24,
      "scene_type": "gameplay",
      "camera": {
        "shot_type": "wide",
        "movement": "pan_right"
      },
      "visual_description": "Opening kickoff. Ball soars through California sky. Seahawks returner catches at the 5, explosive speed lines as he hits the hole. Breaks one tackle at the 20, anime-style impact effects. Finally brought down at the 35.",
      "audio": {
        "crowd_intensity": 9,
        "commentary_cue": null,
        "sfx": ["crowd_roar", "impact", "whistle"]
      },
      "game_state": {
        "quarter": 1,
        "time_remaining": "14:55",
        "score_home": 0,
        "score_away": 0,
        "possession": "home",
        "down_and_distance": "1st & 10"
      }
    },
    {
      "scene_id": 4,
      "start_time": 24,
      "end_time": 35,
      "scene_type": "gameplay",
      "camera": {
        "shot_type": "close-up",
        "movement": "dolly"
      },
      "visual_description": "Seahawks QB in huddle, visor reflecting stadium lights. Helmet numbers visible: 14. Claps hands, team breaks. Cut to under-center view, defense shifts. Snap, play-action fake, launches deep pass.",
      "audio": {
        "crowd_intensity": 10,
        "commentary_cue": "First play, going DEEP!",
        "sfx": ["crowd_roar"]
      },
      "game_state": {
        "quarter": 1,
        "time_remaining": "14:50",
        "score_home": 0,
        "score_away": 0,
        "possession": "home",
        "down_and_distance": "1st & 10"
      }
    },
    {
      "scene_id": 5,
      "start_time": 35,
      "end_time": 45,
      "scene_type": "climax",
      "camera": {
        "shot_type": "tracking",
        "movement": "zoom_in"
      },
      "visual_description": "Ball spirals in slow motion, anime light trails. Seahawks WR (#11) sprints past Patriots DB. Leaps at the goal line, ball arrives perfectly. TOUCHDOWN. Green and navy confetti effects, speed lines radiating.",
      "audio": {
        "crowd_intensity": 10,
        "commentary_cue": "TOUCHDOWN SEAHAWKS! WHAT AN OPENING STATEMENT!",
        "sfx": ["crowd_roar", "touchdown_horn", "music_swell"]
      },
      "game_state": {
        "quarter": 1,
        "time_remaining": "14:35",
        "score_home": 6,
        "score_away": 0,
        "possession": "home",
        "down_and_distance": null
      }
    }
  ],
  "key_moments": [
    {
      "timestamp": 35,
      "event": "first_score",
      "description": "Seahawks WR catches 65-yard TD on opening play"
    },
    {
      "timestamp": 85,
      "event": "powerup_activation",
      "description": "Patriots activate X-RAY VISION — defense reads the play, forces fumble"
    },
    {
      "timestamp": 110,
      "event": "game_winner",
      "description": "Seahawks hold on for 31-24 victory"
    }
  ]
}
6.8 Trailer Script JSON
{
  "type": "trailer",
  "duration_seconds": 10,
  "stadium": "levis_stadium",
  "teams": {
    "home": { "name": "Seattle Seahawks", "colors": ["#002244", "#69BE28"] },
    "away": { "name": "New England Patriots", "colors": ["#002244", "#C60C30"] }
  },
  "scenes": [
    {
      "scene_id": 1,
      "start_time": 0,
      "end_time": 1.5,
      "scene_type": "establishing",
      "camera": { "shot_type": "aerial", "movement": "rapid_zoom" },
      "visual_description": "Flash of stadium lights. 'SUPER BOWL LX' text slams into frame.",
      "audio": { "crowd_intensity": 10, "sfx": ["bass_drop", "crowd_roar"] }
    },
    {
      "scene_id": 2,
      "start_time": 1.5,
      "end_time": 3,
      "scene_type": "tension",
      "camera": { "shot_type": "close-up", "movement": "static" },
      "visual_description": "Seahawks helmet, visor reflecting field. Breath visible.",
      "audio": { "crowd_intensity": 5, "sfx": ["heartbeat"] }
    },
    {
      "scene_id": 3,
      "start_time": 3,
      "end_time": 4.5,
      "scene_type": "tension",
      "camera": { "shot_type": "close-up", "movement": "static" },
      "visual_description": "Patriots helmet, visor dark. Clenched fist.",
      "audio": { "crowd_intensity": 5, "sfx": ["heartbeat"] }
    },
    {
      "scene_id": 4,
      "start_time": 4.5,
      "end_time": 7,
      "scene_type": "gameplay",
      "camera": { "shot_type": "tracking", "movement": "rapid_pan" },
      "visual_description": "RAPID CUTS: Ball spiral. Diving catch. Bone-crushing tackle. Speed lines everywhere. Anime impact frames.",
      "audio": { "crowd_intensity": 10, "sfx": ["impacts", "crowd_roar"] }
    },
    {
      "scene_id": 5,
      "start_time": 7,
      "end_time": 8.5,
      "scene_type": "climax",
      "camera": { "shot_type": "wide", "movement": "slow_motion" },
      "visual_description": "Game-winning play frozen mid-action. Player silhouette against stadium lights.",
      "audio": { "crowd_intensity": 8, "commentary_cue": "THIS IS IT...", "sfx": ["music_swell"] }
    },
    {
      "scene_id": 6,
      "start_time": 8.5,
      "end_time": 10,
      "scene_type": "celebration",
      "camera": { "shot_type": "medium", "movement": "static" },
      "visual_description": "GRIDIRONSCRIPT logo slams into frame. 'YOU WROTE THE SCRIPT' tagline. Release date.",
      "audio": { "crowd_intensity": 10, "sfx": ["logo_slam", "crowd_roar"] }
    }
  ],
  "key_moments": []
}
7. Admin Workflow
7.1 Step-by-Step Process
Phase 1: Prediction Collection (Days 1-5)
Admin creates matchup in Supabase
Prediction window opens on web app
Fans submit predictions (weighted by tier)
Real-time counters update on frontend
Admin monitors submission volume
Phase 2: Script Generation (Day 6)
Admin closes prediction window
Admin triggers generateScript(matchupId) function
Gemini 3 Flash aggregates weighted predictions
AI generates BOTH full (2-min) + trailer (10-sec) scripts as JSON
Scripts saved to Supabase
Phase 3: Trailer Rendering (Day 6)
Admin reviews generated script JSON
Admin triggers renderTrailerOnly(matchupId) function
Only the 10-second trailer is rendered via Veo 3.1 (~$3 cost)
Full 2-minute script is stored but NOT rendered (saves ~$36)
Trailer uploaded to CDN
Phase 4: Trailer Distribution (Day 7)
Trailer premieres on social (TikTok, Instagram, YouTube Shorts)
Trailer drives engagement and builds anticipation
Gauge audience interest before committing to full render
Phase 5: Full Episode Render (Optional)
If trailer performs well, admin triggers renderFullEpisode(matchupId)
Veo 3.1 renders all scenes from stored script (~$36 cost)
Full video uploaded to YouTube
XP rewards distributed to prediction winners
7.2 Cost-Optimized Workflow
┌─────────────────────────────────────────────────────────────────┐
│                    RENDER DECISION FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   [Fan Predictions] ──▶ [Gemini 3 Flash] ──▶ [Both Scripts]    │
│                              ~$0.75                             │
│                                 │                               │
│                    ┌────────────┴────────────┐                  │
│                    ▼                         ▼                  │
│            ┌──────────────┐          ┌──────────────┐          │
│            │ FULL SCRIPT  │          │   TRAILER    │          │
│            │  (2 minutes) │          │ (10 seconds) │          │
│            │              │          │              │          │
│            │  📦 STORED   │          │  🎬 RENDER   │          │
│            │  (not rendered)│        │   via Veo    │          │
│            │   $0 cost    │          │    ~$3       │          │
│            └──────────────┘          └──────────────┘          │
│                    │                         │                  │
│                    │                         ▼                  │
│                    │                 [Trailer Released]         │
│                    │                         │                  │
│                    │              ┌──────────┴──────────┐       │
│                    │              ▼                     ▼       │
│                    │     [Trailer Flops]      [Trailer Pops]   │
│                    │              │                     │       │
│                    │              ▼                     ▼       │
│                    │        [Skip Full]        [Render Full]   │
│                    │          $0 saved              ~$36       │
│                    │                                   │       │
│                    └───────────────────────────────────┘       │
│                                                                 │
│   TOTAL COST PER EPISODE:                                      │
│   • Trailer only: ~$4 (script + trailer render)                │
│   • Full episode: ~$40 (script + trailer + full render)        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
7.3 Admin Dashboard (/admin)
⚠️ DEMO MODE: Admin is accessible to anyone who knows the URL.

NOT linked from main navigation, footer, or any public page
Access via direct URL: https://gridironscript.com/admin
No authentication required for demo
TODO (Production): Add is_admin flag and proper auth
Admin Features
Route	Purpose
/admin	Dashboard overview — active matchup stats, render status
/admin/matchups	Create, edit, open/close prediction windows
/admin/predictions	Real-time vote distributions, tier breakdowns, CSV export
/admin/scripts	Review generated JSON, trigger renderTrailerOnly() or renderFullEpisode()
/admin/videos	Preview/QA trailers, manage YouTube uploads
/admin/users	User management, tier overrides
Render Controls (Scripts Page)
┌─────────────────────────────────────────────────────────┐
│  🎬 Super Bowl LX — Script Ready                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Full Script:    ✅ Generated (15 scenes, 120s)        │
│  Trailer Script: ✅ Generated (6 scenes, 10s)          │
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐      │
│  │  🎬 Render Trailer  │  │  🎬 Render Full     │      │
│  │      (~$3)          │  │     (~$36)          │      │
│  │   [RECOMMENDED]     │  │   [ON DEMAND]       │      │
│  └─────────────────────┘  └─────────────────────┘      │
│                                                         │
│  📝 Preview Script JSON   📊 View Vote Breakdown       │
│                                                         │
└─────────────────────────────────────────────────────────┘
8. Visual Style Guide
8.1 Anime Aesthetic Requirements
Character Design
Helmets: Full coverage, dark/reflective visors, NO face visibility
Body Type: Athletic, exaggerated proportions common in sports anime
Motion: Speed lines, impact frames, dramatic poses
Team Uniforms
Seattle Seahawks
Element	Color	Hex Code
Primary	College Navy	#002244
Secondary	Action Green	#69BE28
Accent	Wolf Grey	#A5ACAF
Helmet	Navy with Green stripe	—
New England Patriots
Element	Color	Hex Code
Primary	Navy Blue	#002244
Secondary	Red	#C60C30
Accent	Silver	#B0B7BC
Helmet	Silver with Red stripe	—
Visual Effects
Speed Lines: Radiating from fast-moving objects
Impact Frames: Flash frames on big hits
Slow Motion: Key moments rendered at reduced speed with motion blur
Superpower Visual Effects
Power	Visual Treatment
⚡ SUPER SPEED	Lightning trails, slow-mo world, sonic boom rings
🛡️ FORCE FIELD	Blue hexagonal energy shield, ripple on impact
🔥 LASER ARM	Red tracer on ball, heat distortion, smoke trail
🧲 MAGNET HANDS	Gold particle streams between hands and ball
👁️ X-RAY VISION	Freeze frame, glowing player outlines, prediction lines
🌪️ UNSTOPPABLE FORCE	Orange aura, defenders flying backward, ground crack
9. Monetization & Tier Pricing
Tier	Monthly Price	Annual Price	Features
Free	$0	$0	Basic predictions, 1 submission, 1x voting weight
Member	$4.99	$49.99/yr	Full predictions, 3 submissions, 1.5x voting weight, early VOD
Superfan	$14.99	$149.99/yr	All features, unlimited submissions, 3x voting weight, stadium/power-up control, exclusive badge
Additional Revenue Streams:

Digital collectibles (prediction moment NFTs)
Sponsored power-ups (brand integration)
Premium video content (director's cut, behind-the-scenes)
Merchandise tie-ins
10. Technical Requirements
10.1 Technology Stack
Layer	Technology	Notes
Frontend	Vue.js 3 + TypeScript	Composition API, <script setup>
Styling	Tailwind CSS	Utility-first, dark theme
State	Pinia	Vue's official state management
Backend	Vercel Functions	Serverless API routes
Database	Supabase (PostgreSQL)	Accessed via Vercel Functions only
Auth	Custom (bcrypt + sessions)	Email/password/username
AI (Script)	Gemini 3 Flash	gemini-3-flash-preview
AI (Video)	fal.ai Veo 3.1	Text-to-video rendering
Hosting	Vercel	Frontend + Functions
Storage	Cloudflare R2	Video file CDN
10.2 Dependencies
// package.json
{
  "dependencies": {
    "vue": "^3.4",
    "pinia": "^2.1",
    "vue-router": "^4.2",
    "@supabase/supabase-js": "^2.39",
    "@google/generative-ai": "^0.2",
    "@fal-ai/client": "^0.14",
    "bcryptjs": "^2.4",
    "cookie": "^0.6"
  },
  "devDependencies": {
    "typescript": "^5.3",
    "tailwindcss": "^3.4",
    "@vercel/node": "^3.0",
    "vite": "^5.0"
  }
}
10.3 Vercel CLI Setup & Configuration
Install Vercel CLI
# Install globally
npm install -g vercel

# Login to Vercel
vercel login
Initialize Project
# In project root
vercel init

# Link to existing project (or create new)
vercel link
Project Configuration
// vercel.json
{
  "framework": "vue",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node@3"
    }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
Set Environment Variables via CLI
# Add environment variables (prompted for values)
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_KEY
vercel env add GEMINI_API_KEY
vercel env add FAL_KEY

# Or set directly (for CI/CD)
vercel env add SUPABASE_URL production < <(echo "https://xxxxx.supabase.co")

# Pull env vars to local .env file
vercel env pull .env.local
Development
# Run locally with Vercel dev server (includes Functions)
vercel dev

# This starts:
# - Vue dev server at http://localhost:3000
# - API functions at http://localhost:3000/api/*
Deployment
# Deploy to preview (creates unique URL)
vercel

# Deploy to production
vercel --prod

# Deploy with specific environment
vercel --env production
Useful CLI Commands
# List all deployments
vercel ls

# View deployment logs
vercel logs <deployment-url>

# Inspect a deployment
vercel inspect <deployment-url>

# Rollback to previous deployment
vercel rollback

# View environment variables
vercel env ls

# Remove environment variable
vercel env rm VARIABLE_NAME
Project Structure for Vercel
gridironscript/
├── api/                    # Vercel Functions (auto-detected)
│   ├── _lib/
│   │   ├── supabase.ts
│   │   └── auth.ts
│   ├── auth/
│   │   ├── register.ts
│   │   ├── login.ts
│   │   ├── logout.ts
│   │   └── me.ts
│   ├── predictions/
│   │   ├── submit.ts
│   │   └── list.ts
│   ├── matchups/
│   │   └── current.ts
│   └── admin/
│       ├── generate-script.ts
│       ├── render-trailer.ts
│       └── render-full.ts
├── src/                    # Vue.js app
│   ├── views/
│   ├── components/
│   ├── stores/
│   └── router/
├── public/
├── vercel.json
├── package.json
├── vite.config.ts
└── tsconfig.json
10.4 Environment Variables
# .env.local (pulled via: vercel env pull)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxxxx          # Server-side only, never expose
GEMINI_API_KEY=AIzaxxxxx
FAL_KEY=fal_xxxxx
10.5 API Keys & Estimated Costs
Service	Purpose	Est. Cost
Supabase	Database	Free tier → $25/mo
Gemini 3 Flash API	Script generation	~$0.10/1K input tokens
fal.ai (Veo 3.1)	Video rendering	$0.20-0.40/sec
Vercel	Hosting + Functions	Free tier → $20/mo
Cloudflare R2	Video storage	$0.015/GB stored
10.6 Estimated Rendering Costs Per Episode
Trailer-Only Workflow (Default)
Item	Calculation	Cost
Script Generation (Gemini 3 Flash)	~10K tokens	$1.00
Trailer Render (10 sec)	10 sec × $0.30/sec	$3.00
Full Script	Stored, not rendered	$0.00
Total (Trailer Only)	—	~$4
Full Episode Workflow (Optional)
Item	Calculation	Cost
Script Generation	(already done)	$0.00
Trailer Render	(already done)	$0.00
Full Video Render (2 min)	120 sec × $0.30/sec	$36.00
Total (Full Episode)	—	~$40
💡 Cost Optimization: By rendering only the trailer initially, you save $36 per episode until you confirm audience interest.

11. Launch Roadmap
Phase 1: MVP (4 weeks)
[ ] Supabase schema setup
[ ] Vue.js 3 + Tailwind frontend scaffold
[ ] Vercel Functions API routes
[ ] Email/password/username auth system
[ ] Basic prediction web app
[ ] Gemini 3 Flash script generation
[ ] Trailer-only Veo 3.1 rendering
[ ] Demo trailer for Super Bowl LX
Phase 2: Automation (4 weeks)
[ ] Automated trailer render pipeline
[ ] Admin dashboard with render controls
[ ] XP reward system + leaderboards
[ ] Full episode render option (on-demand)
[ ] Video concatenation via FFmpeg
Phase 3: Scale (8 weeks)
[ ] Full tier system (Free/Member/Superfan)
[ ] Payment integration (Stripe)
[ ] Stadium voting
[ ] Superpower system
[ ] YouTube channel launch
[ ] Weekly trailer + selective full episode cadence
12. Success Metrics
Metric	Week 1 Target	Month 1 Target
Registered Users	500	5,000
Predictions Submitted	2,000	25,000
Member Conversions	50	500
Superfan Conversions	10	100
YouTube Views (Full Video)	10,000	100,000
YouTube Views (Trailer)	50,000	500,000
Appendix A: UI/UX Wireframe Reference
Fan-Facing Site (/)
Based on provided screenshots, the fan-facing web app should include:

Header: "GridironScript" logo + XP counter (e.g., "Your XP: 1000")
Hero Section: "You're The Scriptwriter" + "How It Works" (3-step explainer)
Matchup Selector: Team cards with logos, records, and "BACKED BY" real player endorsements
Prediction Cards: Sequential numbered questions (01, 02, 03...) with radio options and XP multipliers
Locked Content: "🔒 Superfan Only" overlay with "Unlock All Questions" CTA
Submit Button: Prominent action to finalize predictions
Color Scheme:

Background: Dark navy (#0f172a)
Cards: Slightly lighter navy (#1e293b)
Accent: Orange/gold (#f97316) for CTAs
Text: White (#ffffff) and grey (#94a3b8)
⚠️ NO admin links anywhere on the fan site. The header, footer, and navigation should ONLY contain fan-facing links: Home, Predict, Leaderboard, Profile, Login/Logout.

Admin Dashboard (/admin) — Separate Interface
The admin dashboard is a completely separate interface accessed only via direct URL.

⚠️ DEMO MODE: No authentication required. Access via /admin.

Admin Header:

"⚠️ Admin Panel (Demo)" branding (distinct from fan site)
"← Back to Fan Site" link
Admin Sidebar:

Dashboard
Matchups
Scripts & Render
Videos
Users
Admin Color Scheme:

Same dark theme but with subtle differences to indicate admin context
Red/warning accents for destructive actions
Green for successful renders