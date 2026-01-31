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

    // Get user's predictions
    const { data: predictions, error: predError } = await supabase
      .from('predictions')
      .select('category, selection')
      .eq('user_id', user.id)
      .eq('matchup_id', matchupId)

    if (predError) {
      console.error('Fetch predictions error:', predError)
      return res.status(500).json({ error: 'Failed to fetch predictions' })
    }

    // Get script with outcomes
    const { data: script, error: scriptError } = await supabase
      .from('generated_scripts')
      .select('outcomes, script_json')
      .eq('matchup_id', matchupId)
      .single()

    if (scriptError || !script) {
      return res.status(404).json({ error: 'Results not available yet' })
    }

    return res.status(200).json({
      predictions: predictions || [],
      outcomes: script.outcomes || {},
      final_score: script.script_json?.final_score,
    })
  } catch (error) {
    console.error('Results error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
