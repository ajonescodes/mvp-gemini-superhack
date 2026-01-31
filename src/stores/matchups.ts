import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Matchup {
  id: string
  home_team: string
  away_team: string
  matchup_date: string
  status: 'open' | 'closed' | 'processing' | 'complete'
  video_url_trailer?: string
  created_at: string
}

export const useMatchupsStore = defineStore('matchups', () => {
  const currentMatchup = ref<Matchup | null>(null)
  const predictionCount = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const hasActiveMatchup = computed(() => !!currentMatchup.value)
  const isOpen = computed(() => currentMatchup.value?.status === 'open')
  const isComplete = computed(() => currentMatchup.value?.status === 'complete')

  async function fetchCurrentMatchup() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch('/api/matchups?action=current')
      const data = await res.json()
      currentMatchup.value = data.matchup || null
    } catch (err) {
      error.value = 'Failed to load matchup'
      currentMatchup.value = null
    } finally {
      loading.value = false
    }
  }

  async function fetchPredictionCount() {
    if (!currentMatchup.value) return
    try {
      const res = await fetch(`/api/matchups?action=prediction-count&matchup_id=${currentMatchup.value.id}`)
      const data = await res.json()
      predictionCount.value = data.unique_users || 0
    } catch {
      predictionCount.value = 0
    }
  }

  return {
    currentMatchup,
    predictionCount,
    loading,
    error,
    hasActiveMatchup,
    isOpen,
    isComplete,
    fetchCurrentMatchup,
    fetchPredictionCount,
  }
})
