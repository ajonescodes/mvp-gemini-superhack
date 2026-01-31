import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MULTIPLIERS, BASE_XP } from '@/constants/multipliers'

export interface PredictionResult {
  category: string
  selection: string
  outcome: string
  correct: boolean
  xp_earned: number
}

export interface Results {
  predictions: PredictionResult[]
  outcomes: Record<string, string>
  total_xp: number
  final_score?: {
    seahawks: number
    patriots: number
  }
}

export const useResultsStore = defineStore('results', () => {
  const results = ref<Results | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchResults(matchupId: string) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`/api/predictions?action=results&matchup_id=${matchupId}`)
      if (!res.ok) {
        throw new Error('Failed to load results')
      }
      const data = await res.json()
      
      // Calculate XP for each prediction
      const predictionResults: PredictionResult[] = []
      let totalXP = 0
      
      for (const pred of data.predictions || []) {
        const outcome = data.outcomes?.[pred.category]
        const correct = pred.selection === outcome
        const xp_earned = correct 
          ? Math.round(BASE_XP * (MULTIPLIERS[pred.category]?.[pred.selection] || 1))
          : 0
        
        if (correct) totalXP += xp_earned
        
        predictionResults.push({
          category: pred.category,
          selection: pred.selection,
          outcome: outcome || '',
          correct,
          xp_earned,
        })
      }
      
      results.value = {
        predictions: predictionResults,
        outcomes: data.outcomes || {},
        total_xp: totalXP,
        final_score: data.final_score,
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load results'
    } finally {
      loading.value = false
    }
  }

  function clearResults() {
    results.value = null
  }

  return {
    results,
    loading,
    error,
    fetchResults,
    clearResults,
  }
})
