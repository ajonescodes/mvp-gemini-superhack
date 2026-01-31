import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getAuthUser, getTierWeight } from './_lib/auth.js'
import { supabase } from './_lib/supabase.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = req.query.action as string
  const user = await getAuthUser(req)

  // POST /api/predictions?action=submit
  if (req.method === 'POST' && action === 'submit') {
    if (!user) return res.status(401).json({ error: 'Not authenticated' })
    const { matchup_id, category, selection } = req.body
    if (!matchup_id || !category || !selection) {
      return res.status(400).json({ error: 'matchup_id, category, and selection are required' })
    }

    const { data: matchup } = await supabase.from('matchups').select('id, status').eq('id', matchup_id).single()
    if (!matchup) return res.status(404).json({ error: 'Matchup not found' })
    if (matchup.status !== 'open') return res.status(400).json({ error: 'Predictions are closed' })

    const { data: prediction, error } = await supabase
      .from('predictions')
      .upsert({
        user_id: user.id, matchup_id, category, selection,
        tier_weight: getTierWeight(user.tier),
        submitted_at: new Date().toISOString(),
      }, { onConflict: 'user_id,matchup_id,category' })
      .select()
      .single()

    if (error) return res.status(500).json({ error: 'Failed to submit prediction' })
    return res.status(200).json({ prediction })
  }

  // GET /api/predictions?action=list&matchup_id=xxx
  if (req.method === 'GET' && action === 'list') {
    if (!user) return res.status(401).json({ error: 'Not authenticated' })
    const matchupId = req.query.matchup_id as string
    if (!matchupId) return res.status(400).json({ error: 'matchup_id is required' })

    const { data: predictions } = await supabase
      .from('predictions')
      .select('id, category, selection, submitted_at')
      .eq('user_id', user.id)
      .eq('matchup_id', matchupId)

    return res.status(200).json({ predictions: predictions || [] })
  }

  // GET /api/predictions?action=results&matchup_id=xxx
  if (req.method === 'GET' && action === 'results') {
    if (!user) return res.status(401).json({ error: 'Not authenticated' })
    const matchupId = req.query.matchup_id as string
    if (!matchupId) return res.status(400).json({ error: 'matchup_id is required' })

    const { data: predictions } = await supabase
      .from('predictions')
      .select('category, selection')
      .eq('user_id', user.id)
      .eq('matchup_id', matchupId)

    const { data: script } = await supabase
      .from('generated_scripts')
      .select('outcomes, script_json')
      .eq('matchup_id', matchupId)
      .single()

    if (!script) return res.status(404).json({ error: 'Results not available yet' })

    return res.status(200).json({
      predictions: predictions || [],
      outcomes: script.outcomes || {},
      final_score: script.script_json?.final_score,
    })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
