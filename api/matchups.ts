import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from './_lib/supabase.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = req.query.action as string

  // GET /api/matchups?action=current
  if (req.method === 'GET' && action === 'current') {
    const { data: matchup } = await supabase
      .from('matchups')
      .select('id, home_team, away_team, matchup_date, status, created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    let videoUrl = null
    if (matchup && (matchup.status === 'closed' || matchup.status === 'complete')) {
      const { data: script } = await supabase
        .from('generated_scripts')
        .select('video_url_trailer')
        .eq('matchup_id', matchup.id)
        .order('generated_at', { ascending: false })
        .limit(1)
        .single()
      videoUrl = script?.video_url_trailer || null
    }

    return res.status(200).json({
      matchup: matchup ? { ...matchup, video_url_trailer: videoUrl } : null,
    })
  }

  // GET /api/matchups?action=prediction-count&matchup_id=xxx
  if (req.method === 'GET' && action === 'prediction-count') {
    const matchupId = req.query.matchup_id as string
    if (!matchupId) return res.status(400).json({ error: 'matchup_id is required' })

    const { data } = await supabase.from('predictions').select('user_id').eq('matchup_id', matchupId)
    const uniqueUsers = new Set(data?.map(p => p.user_id) || [])
    return res.status(200).json({ count: data?.length || 0, unique_users: uniqueUsers.size })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
