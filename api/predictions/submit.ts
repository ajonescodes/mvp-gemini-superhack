import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getAuthUser, getTierWeight } from '../_lib/auth'
import { supabase } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const user = await getAuthUser(req)
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const { matchup_id, category, selection } = req.body

    if (!matchup_id || !category || !selection) {
      return res.status(400).json({ error: 'matchup_id, category, and selection are required' })
    }

    // Verify matchup exists and is open
    const { data: matchup } = await supabase
      .from('matchups')
      .select('id, status')
      .eq('id', matchup_id)
      .single()

    if (!matchup) {
      return res.status(404).json({ error: 'Matchup not found' })
    }

    if (matchup.status !== 'open') {
      return res.status(400).json({ error: 'Predictions are closed for this matchup' })
    }

    // Calculate tier weight
    const tierWeight = getTierWeight(user.tier)

    // Upsert prediction (update if exists, insert if not)
    const { data: prediction, error } = await supabase
      .from('predictions')
      .upsert(
        {
          user_id: user.id,
          matchup_id,
          category,
          selection,
          tier_weight: tierWeight,
          submitted_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,matchup_id,category',
        }
      )
      .select()
      .single()

    if (error) {
      console.error('Submit prediction error:', error)
      return res.status(500).json({ error: 'Failed to submit prediction' })
    }

    return res.status(200).json({ prediction })
  } catch (error) {
    console.error('Submit error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
