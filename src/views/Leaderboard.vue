<template>
  <div class="min-h-screen bg-slate-900 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Leaderboard</h1>
        <p class="text-slate-400">Top prediction masters</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-slate-400">Loading leaderboard...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-400 mb-4">{{ error }}</p>
        <button @click="fetchLeaderboard" class="btn-secondary">Try Again</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="users.length === 0" class="text-center py-20">
        <p class="text-slate-400">No users on the leaderboard yet.</p>
        <router-link to="/predict" class="text-orange-500 hover:underline mt-4 inline-block">
          Be the first to predict!
        </router-link>
      </div>

      <!-- Leaderboard List -->
      <div v-else class="space-y-3">
        <!-- Top 3 Podium -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <!-- Second Place -->
          <div v-if="users[1]" class="text-center pt-8">
            <div class="w-16 h-16 mx-auto bg-slate-700 rounded-full flex items-center justify-center mb-2">
              <span class="text-2xl">🥈</span>
            </div>
            <p class="text-white font-semibold truncate">{{ users[1].username }}</p>
            <p class="text-orange-400 font-bold">{{ users[1].xp_total.toLocaleString() }}</p>
          </div>
          
          <!-- First Place -->
          <div v-if="users[0]" class="text-center">
            <div class="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-2">
              <span class="text-3xl">👑</span>
            </div>
            <p class="text-white font-bold text-lg truncate">{{ users[0].username }}</p>
            <p class="text-orange-400 font-bold text-xl">{{ users[0].xp_total.toLocaleString() }}</p>
          </div>
          
          <!-- Third Place -->
          <div v-if="users[2]" class="text-center pt-12">
            <div class="w-14 h-14 mx-auto bg-slate-700 rounded-full flex items-center justify-center mb-2">
              <span class="text-xl">🥉</span>
            </div>
            <p class="text-white font-semibold truncate">{{ users[2].username }}</p>
            <p class="text-orange-400 font-bold">{{ users[2].xp_total.toLocaleString() }}</p>
          </div>
        </div>

        <!-- Rest of leaderboard -->
        <div 
          v-for="(user, index) in users.slice(3)" 
          :key="user.id"
          class="card flex items-center justify-between"
          :class="{ 'bg-orange-500/10 border border-orange-500/30': user.id === currentUserId }"
        >
          <div class="flex items-center gap-4">
            <span class="text-slate-400 font-mono w-8">{{ index + 4 }}</span>
            <div>
              <p class="text-white font-semibold">{{ user.username }}</p>
              <span 
                v-if="user.tier === 'superfan'" 
                class="text-xs text-orange-400 font-bold"
              >
                SUPERFAN
              </span>
            </div>
          </div>
          <p class="text-orange-400 font-bold">{{ user.xp_total.toLocaleString() }} XP</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface LeaderboardUser {
  id: string
  username: string
  tier: string
  xp_total: number
}

const auth = useAuthStore()
const users = ref<LeaderboardUser[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const currentUserId = computed(() => auth.user?.id)

async function fetchLeaderboard() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('/api/leaderboard')
    if (!res.ok) throw new Error('Failed to load leaderboard')
    const data = await res.json()
    users.value = data.users || []
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load'
  } finally {
    loading.value = false
  }
}

onMounted(fetchLeaderboard)
</script>
