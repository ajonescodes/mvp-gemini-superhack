<template>
  <div class="min-h-screen bg-slate-900 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Make Your Predictions</h1>
        <p class="text-slate-400">
          {{ auth.isLoggedIn ? 'Select your picks for each category' : 'Fill in your picks, then sign in to submit' }}
        </p>
      </div>

      <!-- No Matchup State -->
      <div v-if="!matchups.hasActiveMatchup" class="text-center py-20">
        <p class="text-slate-400 text-lg">No active matchup available.</p>
        <router-link to="/" class="text-orange-500 hover:underline mt-4 inline-block">
          Return home
        </router-link>
      </div>

      <!-- Closed State -->
      <div v-else-if="!matchups.isOpen && !matchups.isComplete" class="text-center py-20">
        <p class="text-slate-400 text-lg mb-4">Predictions are closed.</p>
        <p class="text-slate-500">The AI is generating the game video. Check back soon!</p>
      </div>

      <!-- Complete State -->
      <div v-else-if="matchups.isComplete" class="text-center py-20">
        <p class="text-white text-lg mb-4">The game has been generated!</p>
        <div class="flex gap-4 justify-center">
          <router-link to="/results" class="btn-secondary">
            View Your Results
          </router-link>
          <router-link to="/watch" class="btn-primary">
            Watch Trailer
          </router-link>
        </div>
      </div>

      <!-- Prediction Cards -->
      <div v-else class="space-y-6">
        <!-- Free Categories -->
        <div v-for="(category, index) in freeCategories" :key="category.id">
          <PredictionCard
            :category="category"
            :index="index + 1"
            :selected="predictions.selections[category.id]"
            :submitted="predictions.submittedSelections[category.id]"
            @select="(optionId) => predictions.selectOption(category.id, optionId)"
          />
        </div>

        <!-- Superfan Divider -->
        <div class="relative py-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-700"></div>
          </div>
          <div class="relative flex justify-center">
            <span class="px-4 bg-slate-900 text-slate-400 text-sm">
              Superfan Exclusive
            </span>
          </div>
        </div>

        <!-- Superfan Categories -->
        <div v-for="(category, index) in superfanCategories" :key="category.id">
          <PredictionCard
            :category="category"
            :index="freeCategories.length + index + 1"
            :selected="predictions.selections[category.id]"
            :submitted="predictions.submittedSelections[category.id]"
            :locked="!auth.isSuperfan"
            @select="(optionId) => handleSuperfanSelect(category.id, optionId)"
          />
        </div>

        <!-- Submit Section -->
        <div class="sticky bottom-0 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pt-8 pb-4">
          <div class="bg-slate-800 rounded-xl p-4">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-white font-semibold">
                  {{ predictions.selectionCount }} / {{ totalCategories }} predictions
                </p>
                <p v-if="predictions.hasUnsavedChanges" class="text-orange-400 text-sm">
                  Unsaved changes
                </p>
                <p v-else-if="predictions.success" class="text-green-400 text-sm">
                  All predictions saved!
                </p>
              </div>
              <button
                @click="handleSubmit"
                :disabled="predictions.submitting || predictions.selectionCount === 0"
                class="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition"
              >
                {{ predictions.submitting ? 'Submitting...' : 'Submit Predictions' }}
              </button>
            </div>
            <p v-if="predictions.error" class="text-red-400 text-sm">
              {{ predictions.error }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, inject } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMatchupsStore } from '@/stores/matchups'
import { usePredictionsStore } from '@/stores/predictions'
import { FREE_CATEGORIES, SUPERFAN_CATEGORIES } from '@/constants/categories'
import PredictionCard from '@/components/PredictionCard.vue'

const auth = useAuthStore()
const matchups = useMatchupsStore()
const predictions = usePredictionsStore()

const showAuthModal = inject('showAuthModal') as () => void

const freeCategories = FREE_CATEGORIES
const superfanCategories = SUPERFAN_CATEGORIES

const totalCategories = computed(() => {
  return auth.isSuperfan 
    ? freeCategories.length + superfanCategories.length 
    : freeCategories.length
})

function handleSuperfanSelect(categoryId: string, optionId: string) {
  if (!auth.isSuperfan) {
    // Could show upgrade prompt here
    return
  }
  predictions.selectOption(categoryId, optionId)
}

async function handleSubmit() {
  if (!auth.isLoggedIn) {
    // Provide callback for after auth success
    provide('onAuthSuccess', async () => {
      if (matchups.currentMatchup) {
        await predictions.submitPredictions(matchups.currentMatchup.id)
      }
    })
    showAuthModal()
    return
  }

  if (matchups.currentMatchup) {
    await predictions.submitPredictions(matchups.currentMatchup.id)
  }
}

onMounted(async () => {
  await matchups.fetchCurrentMatchup()
  
  // Load existing predictions if logged in
  if (auth.isLoggedIn && matchups.currentMatchup) {
    await predictions.loadExistingPredictions(matchups.currentMatchup.id)
  }
})
</script>
