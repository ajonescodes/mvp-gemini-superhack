import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' })
  }

  // PATCH: Update user tier
  if (req.method === 'PATCH') {
    const { tier } = req.body

    if (!tier || !['free', 'superfan'].includes(tier)) {
      return res.status(400).json({ error: 'Valid tier is required (free or superfan)' })
    }

    try {
      const { data: user, error } = await supabase
        .from('users')
        .update({ tier })
        .eq('id', id)
        .select('id, email, username, tier, xp_total')
        .single()

      if (error) {
        console.error('Update user error:', error)
        return res.status(500).json({ error: 'Failed to update user' })
      }

      return res.status(200).json({ user })
    } catch (error) {
      console.error('Update user error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
