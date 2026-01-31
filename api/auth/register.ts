import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { supabase } from '../_lib/supabase'
import { setSessionCookie } from '../_lib/cookie'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, username, password } = req.body

  // Validate input
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Email, username, and password are required' })
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return res.status(400).json({ error: 'Username must be 3-20 characters, letters/numbers/underscores only' })
  }

  try {
    // Check if email or username already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .limit(1)

    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'Email or username already taken' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const { data: user, error: createError } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        username,
        password_hash: passwordHash,
        tier: 'free',
        xp_total: 0,
      })
      .select('id, email, username, tier, xp_total')
      .single()

    if (createError) {
      console.error('Create user error:', createError)
      return res.status(500).json({ error: 'Failed to create account' })
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

    return res.status(201).json({ user })
  } catch (error) {
    console.error('Register error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
