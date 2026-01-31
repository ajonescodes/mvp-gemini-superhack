import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  username: string
  tier: 'free' | 'superfan'
  xp_total: number
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const isLoggedIn = computed(() => !!user.value)
  const isSuperfan = computed(() => user.value?.tier === 'superfan')

  async function checkAuth() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        user.value = data.user
      } else {
        user.value = null
      }
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  async function register(email: string, username: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      user.value = data.user
      return data.user
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      user.value = data.user
      return data.user
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      user.value = null
    }
  }

  // Update XP locally (called after submission)
  function updateXP(amount: number) {
    if (user.value) {
      user.value.xp_total += amount
    }
  }

  return {
    user,
    loading,
    error,
    isLoggedIn,
    isSuperfan,
    checkAuth,
    register,
    login,
    logout,
    updateXP,
  }
})
