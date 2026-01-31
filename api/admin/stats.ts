import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })

    // Get superfans count
    const { count: superfans } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('tier', 'superfan')

    // Get total predictions
    const { count: totalPredictions } = await supabase
      .from('predictions')
      .select('id', { count: 'exact', head: true })

    return res.status(200).json({
      totalUsers: totalUsers || 0,
      superfans: superfans || 0,
      totalPredictions: totalPredictions || 0,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
