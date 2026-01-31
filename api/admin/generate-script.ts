import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '../_lib/supabase'
import { MULTIPLIERS, BASE_XP } from '../_lib/multipliers'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

async function aggregateVotes(matchupId: string) {
  const { data: predictions } = await supabase
    .from('predictions')
    .select('category, selection, tier_weight')
    .eq('matchup_id', matchupId)

  const aggregated: Record<string, Record<string, number>> = {}

  for (const p of predictions || []) {
    if (!aggregated[p.category]) aggregated[p.category] = {}
    aggregated[p.category][p.selection] =
      (aggregated[p.category][p.selection] || 0) + Number(p.tier_weight)
  }

  // Convert to percentages
  for (const cat of Object.keys(aggregated)) {
    const total = Object.values(aggregated[cat]).reduce((a, b) => a + b, 0)
    for (const opt of Object.keys(aggregated[cat])) {
      aggregated[cat][opt] = Math.round((aggregated[cat][opt] / total) * 100)
    }
  }

  return aggregated
}

async function calculateAndUpdateXP(matchupId: string, outcomes: Record<string, string>) {
  const { data: predictions } = await supabase
    .from('predictions')
    .select('user_id, category, selection')
    .eq('matchup_id', matchupId)

  const userXP: Record<string, number> = {}

  for (const p of predictions || []) {
    if (outcomes[p.category] === p.selection) {
      const multiplier = MULTIPLIERS[p.category]?.[p.selection] || 1.0
      const xp = Math.round(BASE_XP * multiplier)
      userXP[p.user_id] = (userXP[p.user_id] || 0) + xp
    }
  }

  // Update user totals
  for (const [userId, xp] of Object.entries(userXP)) {
    const { data: user } = await supabase
      .from('users')
      .select('xp_total')
      .eq('id', userId)
      .single()

    if (user) {
      await supabase
        .from('users')
        .update({ xp_total: user.xp_total + xp })
        .eq('id', userId)
    }
  }

  return userXP
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { matchup_id } = req.body
  if (!matchup_id) {
    return res.status(400).json({ error: 'matchup_id is required' })
  }

  try {
    // Get matchup
    const { data: matchup } = await supabase
      .from('matchups')
      .select('*')
      .eq('id', matchup_id)
      .single()

    if (!matchup) {
      return res.status(404).json({ error: 'Matchup not found' })
    }

    // Aggregate votes
    const aggregatedVotes = await aggregateVotes(matchup_id)

    // Build prompt
    const prompt = `You are a sports screenplay writer creating an anime-style football game narrative.

MATCHUP: ${matchup.home_team} vs ${matchup.away_team} (Super Bowl LX)

FAN VOTES (weighted by tier - higher % = more fans voted for this):
${JSON.stringify(aggregatedVotes, null, 2)}

MULTIPLIERS (higher = rarer outcome):
- 1.2x-1.8x = Safe bet
- 2.0x-3.0x = Coin flip  
- 3.5x-5.0x = Risky
- 6.0x-12.0x = Long shot

RULES:
1. Respect fan consensus but allow upsets (15-25% chance)
2. Higher multiplier options should be rare for maximum impact
3. PRIORITIZE DRAMA: close games, lead changes, clutch moments
4. Power-ups activate at high-tension moments
5. Outcomes must be logically coherent

OUTPUT (valid JSON only):
{
  "outcomes": {
    "opening_possession": "seahawks or patriots",
    "first_score_method": "sea_td or sea_fg or ne_td or ne_fg or safety",
    "first_td_position": "wr or rb or te or qb_rush or def_st",
    "scoring_pace": "under_35 or 35_to_50 or over_50",
    "first_field_goal": "seahawks or patriots or no_fgs",
    "final_outcome": "seahawks or patriots",
    "victory_margin": "1_to_7 or 8_to_14 or 15_plus",
    "overtime": "no or yes",
    "consecutive_scores": "2_in_row or 3_in_row or 4_plus",
    "seahawks_powerup": "super_speed or force_field or laser_arm",
    "patriots_powerup": "super_speed or magnet_hands or xray_vision",
    "powerup_timing": "opening_drive or halftime or clutch_time"
  },
  "final_score": { "seahawks": number, "patriots": number },
  "trailer_prompt": "8-second dramatic anime trailer description - be specific about visuals, camera angles, and action",
  "key_moments": ["moment1", "moment2", "moment3"]
}

VISUAL CONSTRAINTS:
- Players wear helmets with dark visors - NO faces
- Seahawks: Navy (#002244) + Green (#69BE28)
- Patriots: Navy (#002244) + Red (#C60C30)
- Anime style: action lines, dramatic angles, speed effects`

    // Generate with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON from Gemini response')
    }

    const scriptData = JSON.parse(jsonMatch[0])

    // Store script
    const { data: script, error: insertError } = await supabase
      .from('generated_scripts')
      .insert({
        matchup_id,
        script_json: scriptData,
        outcomes: scriptData.outcomes,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert script error:', insertError)
      throw new Error('Failed to store script')
    }

    // Calculate and update XP
    const xpResults = await calculateAndUpdateXP(matchup_id, scriptData.outcomes)

    return res.status(200).json({
      script,
      xp_awarded: xpResults,
    })
  } catch (error) {
    console.error('Generate script error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Script generation failed',
    })
  }
}
