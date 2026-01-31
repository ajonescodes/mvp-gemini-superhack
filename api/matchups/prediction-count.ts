import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const matchupId = req.query.matchup_id as string
    if (!matchupId) {
      return res.status(400).json({ error: 'matchup_id is required' })
    }

    // Count unique users who have made predictions
    const { data, error } = await supabase
      .from('predictions')
      .select('user_id')
      .eq('matchup_id', matchupId)

    if (error) {
      console.error('Prediction count error:', error)
      return res.status(500).json({ error: 'Failed to get count' })
    }

    // Get unique user count
    const uniqueUsers = new Set(data?.map(p => p.user_id) || [])
    const totalCount = data?.length || 0

    return res.status(200).json({
      count: totalCount,
      unique_users: uniqueUsers.size,
    })
  } catch (error) {
    console.error('Prediction count error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
