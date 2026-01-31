import type { VercelRequest, VercelResponse } from '@vercel/node'
import { fal } from '@fal-ai/client'
import { supabase } from '../_lib/supabase'
import fs from 'fs'
import path from 'path'

// Configure fal with API key from Vercel integration
fal.config({ credentials: process.env.FAL_KEY })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { matchup_id } = req.body
  if (!matchup_id) {
    return res.status(400).json({ error: 'matchup_id is required' })
  }

  try {
    // Get script for this matchup
    const { data: script, error: scriptError } = await supabase
      .from('generated_scripts')
      .select('*')
      .eq('matchup_id', matchup_id)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single()

    if (scriptError || !script) {
      return res.status(404).json({ error: 'Script not found. Generate a script first.' })
    }

    const trailerPromptFromGemini = script.script_json?.trailer_prompt || ''
    const outcomes = script.outcomes || {}

    // Build the full Veo prompt
    const veoPrompt = `Anime-style American football trailer, 8 seconds, high energy.

${trailerPromptFromGemini}

MATCH THIS EXACT STYLE:
- Bold cel-shaded anime aesthetic with thick outlines
- Dynamic speed lines radiating from action
- Dramatic lighting with stadium glow effects
- Muscular athletic builds, exaggerated poses
- Full football helmets with dark visors (no faces visible)

TEAMS:
- Seahawks: Navy blue (#002244) jerseys with bright green (#69BE28) accents
- Patriots: Navy blue (#002244) jerseys with red (#C60C30) accents and silver helmets

GAME CONTEXT:
- Winner: ${outcomes.final_outcome === 'seahawks' ? 'Seattle Seahawks' : 'New England Patriots'}
- Final Score: ${script.script_json?.final_score?.seahawks || 24} - ${script.script_json?.final_score?.patriots || 21}
- Overtime: ${outcomes.overtime === 'yes' ? 'Yes, went to OT!' : 'No'}

SEQUENCE:
1. Dramatic face-off at 50-yard line
2. Explosive gameplay action with speed lines
3. Power-up activation with energy effects (${outcomes.seahawks_powerup} for Seahawks, ${outcomes.patriots_powerup} for Patriots)
4. Winning moment celebration

AUDIO: Epic orchestral music, crowd roar, impact sounds.`

    // Read reference image for style guidance
    let imageUrl: string | undefined
    try {
      const refImagePath = path.join(process.cwd(), 'public/images/Gemini_Generated_Image_uy5u78uy5u78uy5u-3.png')
      if (fs.existsSync(refImagePath)) {
        const imageBuffer = fs.readFileSync(refImagePath)
        const imageBase64 = imageBuffer.toString('base64')
        imageUrl = `data:image/png;base64,${imageBase64}`
      }
    } catch (e) {
      console.log('Reference image not found, proceeding without it')
    }

    // Call fal.ai Veo 3.1
    const result = await fal.subscribe('fal-ai/veo3.1/fast', {
      input: {
        prompt: veoPrompt,
        ...(imageUrl ? { image_url: imageUrl } : {}),
        aspect_ratio: '16:9',
        duration: '8s',
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          console.log('Video generation in progress...')
        }
      },
    })

    // Extract video URL from result
    const videoUrl = (result.data as { video?: { url?: string } })?.video?.url

    if (!videoUrl) {
      throw new Error('No video URL in response')
    }

    // Update script with video URL
    await supabase
      .from('generated_scripts')
      .update({ video_url_trailer: videoUrl })
      .eq('id', script.id)

    return res.status(200).json({
      video_url: videoUrl,
      message: 'Trailer rendered successfully',
    })
  } catch (error) {
    console.error('Render trailer error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Trailer rendering failed',
    })
  }
}
