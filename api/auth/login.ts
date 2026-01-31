import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { supabase } from '../_lib/supabase'
import { setSessionCookie } from '../_lib/cookie'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    // Find user
    const { data: user } = await supabase
      .from('users')
      .select('id, email, username, tier, xp_total, password_hash')
      .eq('email', email.toLowerCase())
      .single()

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Create session
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await supabase.from('sessions').insert({
      user_id: user.id,
      token,
      expires_at: expiresAt.toISOString(),
    })

    // Set cookie
    setSessionCookie(res, token)

    // Return user without password hash
    const { password_hash: _, ...safeUser } = user

    return res.status(200).json({ user: safeUser })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
