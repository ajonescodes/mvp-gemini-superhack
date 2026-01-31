import type { VercelResponse } from '@vercel/node'

export function setSessionCookie(res: VercelResponse, token: string) {
  const isProduction = process.env.VERCEL_ENV === 'production'
  const cookieOptions = [
    `session=${token}`,
    'HttpOnly',
    'Path=/',
    'Max-Age=604800', // 7 days
    'SameSite=Lax',
    isProduction ? 'Secure' : '',
  ].filter(Boolean).join('; ')

  res.setHeader('Set-Cookie', cookieOptions)
}

export function clearSessionCookie(res: VercelResponse) {
  const isProduction = process.env.VERCEL_ENV === 'production'
  const cookieOptions = [
    'session=',
    'HttpOnly',
    'Path=/',
    'Max-Age=0',
    'SameSite=Lax',
    isProduction ? 'Secure' : '',
  ].filter(Boolean).join('; ')

  res.setHeader('Set-Cookie', cookieOptions)
}
