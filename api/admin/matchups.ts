import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // POST: Create matchup
  if (req.method === 'POST') {
    const { home_team, away_team, matchup_date, status } = req.body

    if (!home_team || !away_team || !matchup_date) {
      return res.status(400).json({ error: 'home_team, away_team, and matchup_date are required' })
    }

    try {
      const { data: matchup, error } = await supabase
        .from('matchups')
        .insert({
          home_team,
          away_team,
          matchup_date,
          status: status || 'open',
        })
        .select()
        .single()

      if (error) {
        console.error('Create matchup error:', error)
        return res.status(500).json({ error: 'Failed to create matchup' })
      }

      return res.status(201).json({ matchup })
    } catch (error) {
      console.error('Create matchup error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // PATCH: Update matchup status
  if (req.method === 'PATCH') {
    const { id, status } = req.body

    if (!id || !status) {
      return res.status(400).json({ error: 'id and status are required' })
    }

    const validStatuses = ['open', 'closed', 'processing', 'complete']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    try {
      const { data: matchup, error } = await supabase
        .from('matchups')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Update matchup error:', error)
        return res.status(500).json({ error: 'Failed to update matchup' })
      }

      return res.status(200).json({ matchup })
    } catch (error) {
      console.error('Update matchup error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // GET: List matchups
  if (req.method === 'GET') {
    try {
      const { data: matchups, error } = await supabase
        .from('matchups')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('List matchups error:', error)
        return res.status(500).json({ error: 'Failed to list matchups' })
      }

      return res.status(200).json({ matchups: matchups || [] })
    } catch (error) {
      console.error('List matchups error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
