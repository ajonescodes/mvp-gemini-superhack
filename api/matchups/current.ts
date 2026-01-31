import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get the most recent matchup
    const { data: matchup, error } = await supabase
      .from('matchups')
      .select('id, home_team, away_team, matchup_date, status, created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      // No matchup found is okay
      return res.status(200).json({ matchup: null })
    }

    // If matchup is complete, get the video URL
    let videoUrl = null
    if (matchup && matchup.status === 'complete') {
      const { data: script } = await supabase
        .from('generated_scripts')
        .select('video_url_trailer')
        .eq('matchup_id', matchup.id)
        .single()
      
      videoUrl = script?.video_url_trailer || null
    }

    return res.status(200).json({
      matchup: matchup ? {
        ...matchup,
        video_url_trailer: videoUrl,
      } : null,
    })
  } catch (error) {
    console.error('Current matchup error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
