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
    const { data: predictions, error } = await supabase
      .from('predictions')
      .select('category, selection, tier_weight')
      .eq('matchup_id', matchupId)

    if (error) {
      console.error('Vote distribution error:', error)
      return res.status(500).json({ error: 'Failed to get vote distribution' })
    }

    // Aggregate votes by category
    const categories: Record<string, Record<string, { count: number; weighted: number; pct: number }>> = {}

    for (const pred of predictions || []) {
      if (!categories[pred.category]) {
        categories[pred.category] = {}
      }
      if (!categories[pred.category][pred.selection]) {
        categories[pred.category][pred.selection] = { count: 0, weighted: 0, pct: 0 }
      }
      categories[pred.category][pred.selection].count += 1
      categories[pred.category][pred.selection].weighted += Number(pred.tier_weight)
    }

    // Calculate percentages
    for (const category of Object.keys(categories)) {
      const totalWeighted = Object.values(categories[category]).reduce((a, b) => a + b.weighted, 0)
      for (const option of Object.keys(categories[category])) {
        categories[category][option].pct = totalWeighted > 0
          ? Math.round((categories[category][option].weighted / totalWeighted) * 100)
          : 0
      }
    }

    return res.status(200).json({ categories })
  } catch (error) {
    console.error('Vote distribution error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
