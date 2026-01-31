import type { VercelRequest, VercelResponse } from '@vercel/node'
import { parse } from 'cookie'
import { supabase } from '../_lib/supabase'
import { clearSessionCookie } from '../_lib/cookie'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const cookies = parse(req.headers.cookie || '')
    const token = cookies.session

    if (token) {
      // Delete session from database
      await supabase.from('sessions').delete().eq('token', token)
    }

    // Clear cookie
    clearSessionCookie(res)

    return res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
