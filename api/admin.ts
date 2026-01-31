import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { fal } from '@fal-ai/client'
import { supabase } from './_lib/supabase.js'
import { MULTIPLIERS, BASE_XP } from './_lib/multipliers.js'

fal.config({ credentials: process.env.FAL_KEY })
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = req.query.action as string

  // GET /api/admin?action=stats
  if (req.method === 'GET' && action === 'stats') {
    const { count: totalUsers } = await supabase.from('users').select('id', { count: 'exact', head: true })
    const { count: superfans } = await supabase.from('users').select('id', { count: 'exact', head: true }).eq('tier', 'superfan')
    const { count: totalPredictions } = await supabase.from('predictions').select('id', { count: 'exact', head: true })
    return res.status(200).json({ totalUsers: totalUsers || 0, superfans: superfans || 0, totalPredictions: totalPredictions || 0 })
  }

  // GET /api/admin?action=users
  if (req.method === 'GET' && action === 'users') {
    const { data: users } = await supabase.from('users').select('id, email, username, tier, xp_total, created_at').order('created_at', { ascending: false })
    return res.status(200).json({ users: users || [] })
  }

  // PATCH /api/admin?action=user&id=xxx
  if (req.method === 'PATCH' && action === 'user') {
    const id = req.query.id as string
    const { tier } = req.body
    if (!id || !tier) return res.status(400).json({ error: 'id and tier required' })
    const { data: user } = await supabase.from('users').update({ tier }).eq('id', id).select('id, email, username, tier, xp_total').single()
    return res.status(200).json({ user })
  }

  // POST/PATCH /api/admin?action=matchup
  if (action === 'matchup') {
    if (req.method === 'POST') {
      const { home_team, away_team, matchup_date, status } = req.body
      const { data: matchup } = await supabase.from('matchups').insert({ home_team, away_team, matchup_date, status: status || 'open' }).select().single()
      return res.status(201).json({ matchup })
    }
    if (req.method === 'PATCH') {
      const { id, status } = req.body
      const { data: matchup } = await supabase.from('matchups').update({ status }).eq('id', id).select().single()
      return res.status(200).json({ matchup })
    }
  }

  // GET /api/admin?action=vote-distribution&matchup_id=xxx
  if (req.method === 'GET' && action === 'vote-distribution') {
    const matchupId = req.query.matchup_id as string
    const { data: predictions } = await supabase.from('predictions').select('category, selection, tier_weight').eq('matchup_id', matchupId)
    const categories: Record<string, Record<string, { count: number; weighted: number; pct: number }>> = {}
    for (const p of predictions || []) {
      if (!categories[p.category]) categories[p.category] = {}
      if (!categories[p.category][p.selection]) categories[p.category][p.selection] = { count: 0, weighted: 0, pct: 0 }
      categories[p.category][p.selection].count += 1
      categories[p.category][p.selection].weighted += Number(p.tier_weight)
    }
    for (const cat of Object.keys(categories)) {
      const total = Object.values(categories[cat]).reduce((a, b) => a + b.weighted, 0)
      for (const opt of Object.keys(categories[cat])) {
        categories[cat][opt].pct = total > 0 ? Math.round((categories[cat][opt].weighted / total) * 100) : 0
      }
    }
    return res.status(200).json({ categories })
  }

  // GET /api/admin?action=scripts&matchup_id=xxx
  if (req.method === 'GET' && action === 'scripts') {
    const matchupId = req.query.matchup_id as string
    const { data: script } = await supabase.from('generated_scripts').select('*').eq('matchup_id', matchupId).order('generated_at', { ascending: false }).limit(1).single()
    return res.status(200).json({ script: script || null })
  }

  // POST /api/admin?action=generate-script
  if (req.method === 'POST' && action === 'generate-script') {
    const { matchup_id } = req.body
    const { data: matchup } = await supabase.from('matchups').select('*').eq('id', matchup_id).single()
    if (!matchup) return res.status(404).json({ error: 'Matchup not found' })

    // Aggregate votes
    const { data: predictions } = await supabase.from('predictions').select('category, selection, tier_weight').eq('matchup_id', matchup_id)
    const aggregated: Record<string, Record<string, number>> = {}
    for (const p of predictions || []) {
      if (!aggregated[p.category]) aggregated[p.category] = {}
      aggregated[p.category][p.selection] = (aggregated[p.category][p.selection] || 0) + Number(p.tier_weight)
    }
    for (const cat of Object.keys(aggregated)) {
      const total = Object.values(aggregated[cat]).reduce((a, b) => a + b, 0)
      for (const opt of Object.keys(aggregated[cat])) {
        aggregated[cat][opt] = Math.round((aggregated[cat][opt] / total) * 100)
      }
    }

    const prompt = `You are a sports screenplay writer creating an anime-style football game narrative.
MATCHUP: ${matchup.home_team} vs ${matchup.away_team} (Super Bowl LX)
FAN VOTES: ${JSON.stringify(aggregated, null, 2)}
RULES: 1. Respect fan consensus but allow upsets (15-25% chance) 2. PRIORITIZE DRAMA 3. Outcomes must be coherent
OUTPUT (valid JSON only):
{"outcomes":{"opening_possession":"seahawks or patriots","first_score_method":"sea_td or sea_fg or ne_td or ne_fg or safety","first_td_position":"wr or rb or te or qb_rush or def_st","scoring_pace":"under_35 or 35_to_50 or over_50","first_field_goal":"seahawks or patriots or no_fgs","final_outcome":"seahawks or patriots","victory_margin":"1_to_7 or 8_to_14 or 15_plus","overtime":"no or yes","consecutive_scores":"2_in_row or 3_in_row or 4_plus","seahawks_powerup":"super_speed or force_field or laser_arm","patriots_powerup":"super_speed or magnet_hands or xray_vision","powerup_timing":"opening_drive or halftime or clutch_time"},"final_score":{"seahawks":0,"patriots":0},"trailer_prompt":"8-second dramatic anime trailer description","key_moments":["moment1","moment2","moment3"]}`

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return res.status(500).json({ error: 'Failed to parse response' })
    const scriptData = JSON.parse(jsonMatch[0])

    const { data: script } = await supabase.from('generated_scripts').insert({ matchup_id, script_json: scriptData, outcomes: scriptData.outcomes }).select().single()

    // Calculate XP
    for (const p of predictions || []) {
      if (scriptData.outcomes[p.category] === p.selection) {
        const xp = Math.round(BASE_XP * (MULTIPLIERS[p.category]?.[p.selection] || 1))
        const { data: u } = await supabase.from('predictions').select('user_id').eq('matchup_id', matchup_id).eq('category', p.category).eq('selection', p.selection)
        for (const pred of u || []) {
          const { data: user } = await supabase.from('users').select('xp_total').eq('id', pred.user_id).single()
          if (user) await supabase.from('users').update({ xp_total: user.xp_total + xp }).eq('id', pred.user_id)
        }
      }
    }

    return res.status(200).json({ script })
  }

  // POST /api/admin?action=render-trailer
  if (req.method === 'POST' && action === 'render-trailer') {
    const { matchup_id } = req.body
    const { data: script } = await supabase.from('generated_scripts').select('*').eq('matchup_id', matchup_id).order('generated_at', { ascending: false }).limit(1).single()
    if (!script) return res.status(404).json({ error: 'Script not found' })

    const veoPrompt = `Anime-style American football trailer, 8 seconds, high energy. ${script.script_json?.trailer_prompt || ''} Bold cel-shaded anime aesthetic, speed lines, dramatic lighting. Seahawks: Navy + Green. Patriots: Navy + Red.`

    const result = await fal.subscribe('fal-ai/veo3.1/fast', {
      input: { prompt: veoPrompt, aspect_ratio: '16:9', duration: '8s' },
      logs: true,
    })

    const videoUrl = (result.data as { video?: { url?: string } })?.video?.url
    if (!videoUrl) return res.status(500).json({ error: 'No video URL' })

    await supabase.from('generated_scripts').update({ video_url_trailer: videoUrl }).eq('id', script.id)
    return res.status(200).json({ video_url: videoUrl })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
