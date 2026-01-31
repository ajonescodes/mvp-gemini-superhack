import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getAuthUser } from '../_lib/auth'
import { supabase } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const user = await getAuthUser(req)
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const matchupId = req.query.matchup_id as string
    if (!matchupId) {
      return res.status(400).json({ error: 'matchup_id is required' })
    }

    const { data: predictions, error } = await supabase
      .from('predictions')
      .select('id, category, selection, submitted_at')
      .eq('user_id', user.id)
      .eq('matchup_id', matchupId)

    if (error) {
      console.error('List predictions error:', error)
      return res.status(500).json({ error: 'Failed to fetch predictions' })
    }

    return res.status(200).json({ predictions: predictions || [] })
  } catch (error) {
    console.error('List error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
