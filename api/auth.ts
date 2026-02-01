import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { parse } from 'cookie'
import { supabase } from './_lib/supabase.js'
import { setSessionCookie, clearSessionCookie } from './_lib/cookie.js'
import { getAuthUser } from './_lib/auth.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = req.query.action as string

  // GET /api/auth?action=me
  if (req.method === 'GET' && action === 'me') {
    const user = await getAuthUser(req)
    if (!user) return res.status(401).json({ error: 'Not authenticated' })
    return res.status(200).json({ user })
  }

  // POST /api/auth?action=register
  if (req.method === 'POST' && action === 'register') {
    const { email, username, password } = req.body
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .limit(1)

    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'Email or username already taken' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const { data: user, error } = await supabase
      .from('users')
      .insert({ email: email.toLowerCase(), username, password_hash: passwordHash, tier: 'free', xp_total: 0 })
      .select('id, email, username, tier, xp_total')
      .single()

    if (error) return res.status(500).json({ error: 'Failed to create account' })

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await supabase.from('sessions').insert({ user_id: user.id, token, expires_at: expiresAt.toISOString() })
    setSessionCookie(res, token)
    return res.status(201).json({ user })
  }

  // POST /api/auth?action=login
  if (req.method === 'POST' && action === 'login') {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })

    const { data: user } = await supabase
      .from('users')
      .select('id, email, username, tier, xp_total, password_hash')
      .eq('email', email.toLowerCase())
      .single()

    if (!user) return res.status(401).json({ error: 'Invalid email or password' })
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' })

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await supabase.from('sessions').insert({ user_id: user.id, token, expires_at: expiresAt.toISOString() })
    setSessionCookie(res, token)
    const { password_hash: _, ...safeUser } = user
    return res.status(200).json({ user: safeUser })
  }

  // POST /api/auth?action=logout
  if (req.method === 'POST' && action === 'logout') {
    const cookies = parse(req.headers.cookie || '')
    if (cookies.session) await supabase.from('sessions').delete().eq('token', cookies.session)
    clearSessionCookie(res)
    return res.status(200).json({ message: 'Logged out successfully' })
  }

  // POST /api/auth?action=upgrade (Mock upgrade to Superfan - Demo only)
  if (req.method === 'POST' && action === 'upgrade') {
    const user = await getAuthUser(req)
    if (!user) return res.status(401).json({ error: 'Not authenticated' })

    if (user.tier === 'superfan') {
      return res.status(200).json({ message: 'Already a Superfan!', user })
    }

    // Mock upgrade - no payment required for demo
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ tier: 'superfan' })
      .eq('id', user.id)
      .select('id, email, username, tier, xp_total')
      .single()

    if (error) return res.status(500).json({ error: 'Failed to upgrade' })

    return res.status(200).json({ message: 'Upgraded to Superfan!', user: updatedUser })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
