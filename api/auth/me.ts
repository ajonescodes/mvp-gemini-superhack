import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getAuthUser } from '../_lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const user = await getAuthUser(req)

    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    return res.status(200).json({ user })
  } catch (error) {
    console.error('Me error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
