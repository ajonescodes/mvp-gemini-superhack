import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, tier, xp_total')
      .order('xp_total', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Leaderboard error:', error)
      return res.status(500).json({ error: 'Failed to fetch leaderboard' })
    }

    return res.status(200).json({ users: users || [] })
  } catch (error) {
    console.error('Leaderboard error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
