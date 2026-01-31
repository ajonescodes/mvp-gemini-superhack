import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../_lib/supabase'
import { MULTIPLIERS, BASE_XP } from '../_lib/multipliers'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { matchup_id } = req.body
  if (!matchup_id) {
    return res.status(400).json({ error: 'matchup_id is required' })
  }

  try {
    // Get script with outcomes
    const { data: script, error: scriptError } = await supabase
      .from('generated_scripts')
      .select('outcomes')
      .eq('matchup_id', matchup_id)
      .single()

    if (scriptError || !script) {
      return res.status(404).json({ error: 'Script not found' })
    }

    const outcomes = script.outcomes as Record<string, string>

    // Get all predictions for this matchup
    const { data: predictions, error: predError } = await supabase
      .from('predictions')
      .select('user_id, category, selection')
      .eq('matchup_id', matchup_id)

    if (predError) {
      throw new Error('Failed to fetch predictions')
    }

    // Calculate XP per user
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

    return res.status(200).json({
      message: 'XP calculated and awarded',
      users_awarded: Object.keys(userXP).length,
      total_xp_awarded: Object.values(userXP).reduce((a, b) => a + b, 0),
      details: userXP,
    })
  } catch (error) {
    console.error('Calculate XP error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'XP calculation failed',
    })
  }
}
