import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Prediction {
  id: string
  user_id: string
  matchup_id: string
  category: string
  selection: string
  tier_weight: number
  submitted_at: string
}

export const usePredictionsStore = defineStore('predictions', () => {
  // Local selections (before submit)
  const selections = ref<Record<string, string>>({})
  // Server-confirmed predictions
  const submittedSelections = ref<Record<string, string>>({})
  
  const submitting = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  const hasUnsavedChanges = computed(() => {
    return Object.entries(selections.value).some(
      ([cat, sel]) => submittedSelections.value[cat] !== sel
    )
  })

  const selectionCount = computed(() => Object.keys(selections.value).length)

  function selectOption(categoryId: string, optionId: string) {
    selections.value[categoryId] = optionId
  }

  function clearSelections() {
    selections.value = {}
    submittedSelections.value = {}
    success.value = false
    error.value = null
  }

  async function loadExistingPredictions(matchupId: string) {
    try {
      const res = await fetch(`/api/predictions/list?matchup_id=${matchupId}`)
      if (res.ok) {
        const data = await res.json()
        for (const p of data.predictions || []) {
          submittedSelections.value[p.category] = p.selection
          selections.value[p.category] = p.selection
        }
      }
    } catch {
      // Ignore errors - just means no existing predictions
    }
  }

  async function submitPredictions(matchupId: string) {
    submitting.value = true
    error.value = null
    success.value = false

    try {
      // Only submit changed predictions
      for (const [category, selection] of Object.entries(selections.value)) {
        if (submittedSelections.value[category] !== selection) {
          const res = await fetch('/api/predictions/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matchup_id: matchupId, category, selection }),
          })
          
          if (!res.ok) {
            const data = await res.json()
            throw new Error(data.error || 'Failed to submit prediction')
          }
          
          submittedSelections.value[category] = selection
        }
      }
      success.value = true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to submit predictions'
      throw err
    } finally {
      submitting.value = false
    }
  }

  return {
    selections,
    submittedSelections,
    submitting,
    error,
    success,
    hasUnsavedChanges,
    selectionCount,
    selectOption,
    clearSelections,
    loadExistingPredictions,
    submitPredictions,
  }
})
