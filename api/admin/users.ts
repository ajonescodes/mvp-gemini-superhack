import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET: List users
  if (req.method === 'GET') {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, email, username, tier, xp_total, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('List users error:', error)
        return res.status(500).json({ error: 'Failed to list users' })
      }

      return res.status(200).json({ users: users || [] })
    } catch (error) {
      console.error('List users error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
