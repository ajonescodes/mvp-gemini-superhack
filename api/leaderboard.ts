import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from './_lib/supabase.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { data: users } = await supabase
    .from('users')
    .select('id, username, tier, xp_total')
    .order('xp_total', { ascending: false })
    .limit(50)

  return res.status(200).json({ users: users || [] })
}
