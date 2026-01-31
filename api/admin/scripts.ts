import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const matchupId = req.query.matchup_id as string
  if (!matchupId) {
    return res.status(400).json({ error: 'matchup_id is required' })
  }

  try {
    const { data: script, error } = await supabase
      .from('generated_scripts')
      .select('*')
      .eq('matchup_id', matchupId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      // No script found is okay
      return res.status(200).json({ script: null })
    }

    return res.status(200).json({ script })
  } catch (error) {
    console.error('Get script error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
