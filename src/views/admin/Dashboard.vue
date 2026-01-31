<template>
  <div>
    <h1 class="text-2xl font-bold text-white mb-8">Dashboard</h1>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card">
        <p class="text-slate-400 text-sm mb-1">Total Users</p>
        <p class="text-3xl font-bold text-white">{{ stats.totalUsers }}</p>
      </div>
      <div class="card">
        <p class="text-slate-400 text-sm mb-1">Total Predictions</p>
        <p class="text-3xl font-bold text-white">{{ stats.totalPredictions }}</p>
      </div>
      <div class="card">
        <p class="text-slate-400 text-sm mb-1">Superfans</p>
        <p class="text-3xl font-bold text-orange-500">{{ stats.superfans }}</p>
      </div>
    </div>

    <!-- Current Matchup Status -->
    <div class="card mb-8">
      <h2 class="text-lg font-bold text-white mb-4">Current Matchup</h2>
      <div v-if="matchups.currentMatchup">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-white font-semibold">
              {{ matchups.currentMatchup.home_team }} vs {{ matchups.currentMatchup.away_team }}
            </p>
            <p class="text-slate-400 text-sm">{{ matchups.currentMatchup.matchup_date }}</p>
          </div>
          <span 
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="{
              'bg-green-500/20 text-green-400': matchups.currentMatchup.status === 'open',
              'bg-yellow-500/20 text-yellow-400': matchups.currentMatchup.status === 'closed',
              'bg-orange-500/20 text-orange-400': matchups.currentMatchup.status === 'processing',
              'bg-blue-500/20 text-blue-400': matchups.currentMatchup.status === 'complete',
            }"
          >
            {{ matchups.currentMatchup.status.toUpperCase() }}
          </span>
        </div>

        <!-- Quick Actions -->
        <div class="flex flex-wrap gap-4">
          <router-link to="/admin/matchups" class="btn-secondary text-sm">
            Manage Matchup
          </router-link>
          <router-link to="/admin/scripts" class="btn-secondary text-sm">
            Generate Script
          </router-link>
          <router-link to="/admin/videos" class="btn-secondary text-sm">
            Render Video
          </router-link>
        </div>
      </div>
      <div v-else>
        <p class="text-slate-400">No active matchup</p>
        <router-link to="/admin/matchups" class="text-orange-500 hover:underline text-sm">
          Create one →
        </router-link>
      </div>
    </div>

    <!-- Workflow Guide -->
    <div class="card">
      <h2 class="text-lg font-bold text-white mb-4">Demo Workflow</h2>
      <ol class="space-y-3 text-slate-300">
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-sm flex-shrink-0">1</span>
          <span>Ensure matchup exists and status is <span class="text-green-400">"open"</span></span>
        </li>
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-sm flex-shrink-0">2</span>
          <span>Have users submit predictions at <code class="text-orange-400">/predict</code></span>
        </li>
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-sm flex-shrink-0">3</span>
          <span>Change matchup status to <span class="text-yellow-400">"closed"</span></span>
        </li>
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-sm flex-shrink-0">4</span>
          <span>Go to Scripts → Generate Script (uses Gemini)</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-sm flex-shrink-0">5</span>
          <span>Go to Videos → Render Trailer (uses Veo)</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-sm flex-shrink-0">6</span>
          <span>Change matchup status to <span class="text-blue-400">"complete"</span></span>
        </li>
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-sm flex-shrink-0">7</span>
          <span>Users can view results at <code class="text-orange-400">/results</code> and watch at <code class="text-orange-400">/watch</code></span>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMatchupsStore } from '@/stores/matchups'

const matchups = useMatchupsStore()

const stats = ref({
  totalUsers: 0,
  totalPredictions: 0,
  superfans: 0,
})

async function fetchStats() {
  try {
    const res = await fetch('/api/admin/stats')
    if (res.ok) {
      const data = await res.json()
      stats.value = data
    }
  } catch {
    // Use defaults
  }
}

onMounted(async () => {
  await matchups.fetchCurrentMatchup()
  await fetchStats()
})
</script>
