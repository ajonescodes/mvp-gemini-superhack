import { parse } from 'cookie'
import type { VercelRequest } from '@vercel/node'
import { supabase } from './supabase.js'

export interface User {
  id: string
  email: string
  username: string
  tier: 'free' | 'superfan'
  xp_total: number
}

export async function getAuthUser(req: VercelRequest): Promise<User | null> {
  const cookies = parse(req.headers.cookie || '')
  const token = cookies.session
  
  if (!token) return null

  const { data: session } = await supabase
    .from('sessions')
    .select('user_id, expires_at')
    .eq('token', token)
    .single()

  if (!session || new Date(session.expires_at) < new Date()) {
    return null
  }

  const { data: user } = await supabase
    .from('users')
    .select('id, email, username, tier, xp_total')
    .eq('id', session.user_id)
    .single()

  return user as User | null
}

export function getTierWeight(tier: string): number {
  return tier === 'superfan' ? 3.0 : 1.0
}
