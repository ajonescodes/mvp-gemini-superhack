<template>
  <div>
    <h1 class="text-2xl font-bold text-white mb-8">Matchups</h1>

    <!-- Current Matchup -->
    <div class="card mb-8">
      <h2 class="text-lg font-bold text-white mb-4">Current Matchup</h2>
      
      <div v-if="loading" class="text-slate-400">Loading...</div>
      
      <div v-else-if="matchup">
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p class="text-slate-400 text-sm">Home Team</p>
            <p class="text-white font-semibold">{{ matchup.home_team }}</p>
          </div>
          <div>
            <p class="text-slate-400 text-sm">Away Team</p>
            <p class="text-white font-semibold">{{ matchup.away_team }}</p>
          </div>
          <div>
            <p class="text-slate-400 text-sm">Date</p>
            <p class="text-white">{{ matchup.matchup_date }}</p>
          </div>
          <div>
            <p class="text-slate-400 text-sm">Status</p>
            <p class="text-white">{{ matchup.status }}</p>
          </div>
        </div>

        <!-- Status Controls -->
        <div class="border-t border-slate-700 pt-4">
          <p class="text-slate-400 text-sm mb-3">Change Status</p>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="status in ['open', 'closed', 'processing', 'complete']"
              :key="status"
              @click="updateStatus(status)"
              :disabled="updating || matchup.status === status"
              class="px-4 py-2 rounded-lg text-sm font-medium transition"
              :class="[
                matchup.status === status 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              ]"
            >
              {{ status }}
            </button>
          </div>
        </div>

        <p v-if="updateError" class="text-red-400 text-sm mt-4">{{ updateError }}</p>
        <p v-if="updateSuccess" class="text-green-400 text-sm mt-4">Status updated!</p>
      </div>

      <div v-else>
        <p class="text-slate-400 mb-4">No matchup found. Creating seed data...</p>
        <button @click="createSeedMatchup" :disabled="creating" class="btn-primary">
          {{ creating ? 'Creating...' : 'Create Demo Matchup' }}
        </button>
      </div>
    </div>

    <!-- Vote Distribution -->
    <div class="card">
      <h2 class="text-lg font-bold text-white mb-4">Vote Distribution</h2>
      
      <div v-if="loadingVotes" class="text-slate-400">Loading votes...</div>
      
      <div v-else-if="Object.keys(voteDistribution).length === 0" class="text-slate-400">
        No votes yet
      </div>
      
      <div v-else class="space-y-6">
        <div v-for="(options, category) in voteDistribution" :key="category">
          <h3 class="text-white font-medium mb-2">{{ getCategoryQuestion(category) }}</h3>
          <div class="space-y-2">
            <div v-for="(data, option) in options" :key="option" class="flex items-center gap-4">
              <div class="flex-1">
                <div class="flex items-center justify-between text-sm mb-1">
                  <span class="text-slate-300">{{ getOptionLabel(category, option) }}</span>
                  <span class="text-slate-400">{{ data.count }} votes ({{ data.pct }}%)</span>
                </div>
                <div class="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-orange-500 rounded-full transition-all"
                    :style="{ width: `${data.pct}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CATEGORIES } from '@/constants/categories'

interface Matchup {
  id: string
  home_team: string
  away_team: string
  matchup_date: string
  status: string
}

interface VoteData {
  count: number
  weighted: number
  pct: number
}

const matchup = ref<Matchup | null>(null)
const loading = ref(true)
const updating = ref(false)
const creating = ref(false)
const updateError = ref('')
const updateSuccess = ref(false)

const voteDistribution = ref<Record<string, Record<string, VoteData>>>({})
const loadingVotes = ref(false)

async function fetchMatchup() {
  loading.value = true
  try {
    const res = await fetch('/api/matchups/current')
    const data = await res.json()
    matchup.value = data.matchup || null
  } catch {
    matchup.value = null
  } finally {
    loading.value = false
  }
}

async function updateStatus(status: string) {
  if (!matchup.value) return
  updating.value = true
  updateError.value = ''
  updateSuccess.value = false
  
  try {
    const res = await fetch('/api/admin/matchups', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: matchup.value.id, status }),
    })
    
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Failed to update')
    }
    
    matchup.value.status = status
    updateSuccess.value = true
    setTimeout(() => { updateSuccess.value = false }, 3000)
  } catch (err) {
    updateError.value = err instanceof Error ? err.message : 'Update failed'
  } finally {
    updating.value = false
  }
}

async function createSeedMatchup() {
  creating.value = true
  try {
    const res = await fetch('/api/admin/matchups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        home_team: 'Seattle Seahawks',
        away_team: 'New England Patriots',
        matchup_date: '2026-02-08',
        status: 'open',
      }),
    })
    
    if (res.ok) {
      await fetchMatchup()
    }
  } catch {
    // Handle error
  } finally {
    creating.value = false
  }
}

async function fetchVoteDistribution() {
  if (!matchup.value) return
  loadingVotes.value = true
  try {
    const res = await fetch(`/api/admin/vote-distribution?matchup_id=${matchup.value.id}`)
    const data = await res.json()
    voteDistribution.value = data.categories || {}
  } catch {
    voteDistribution.value = {}
  } finally {
    loadingVotes.value = false
  }
}

function getCategoryQuestion(categoryId: string): string {
  return CATEGORIES.find(c => c.id === categoryId)?.question || categoryId
}

function getOptionLabel(categoryId: string, optionId: string): string {
  const category = CATEGORIES.find(c => c.id === categoryId)
  return category?.options.find(o => o.id === optionId)?.label || optionId
}

onMounted(async () => {
  await fetchMatchup()
  if (matchup.value) {
    await fetchVoteDistribution()
  }
})
</script>
