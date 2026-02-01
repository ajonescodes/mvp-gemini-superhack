<template>
  <div class="min-h-screen bg-slate-900 py-8 px-4">
    <!-- Upgrade Modal -->
    <UpgradeModal 
      :show="showUpgradeModal" 
      @close="showUpgradeModal = false"
      @upgraded="showUpgradeModal = false"
    />

    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="font-display text-4xl sm:text-5xl text-white mb-2 tracking-wide">WRITE THE STORY</h1>
        <p class="text-slate-400">
          {{ auth.isLoggedIn ? 'Cast your votes to shape the pregame show' : 'Cast your votes, then sign in to submit' }}
        </p>
        <p class="text-slate-500 text-sm mt-2">
          Your choices influence the AI-generated anime streamed live before kickoff
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
        <p class="text-slate-400 text-lg mb-4">Voting is closed.</p>
        <p class="text-slate-500">The AI is generating the pregame show. Check back soon!</p>
      </div>

      <!-- Complete State -->
      <div v-else-if="matchups.isComplete" class="text-center py-20">
        <p class="text-white text-lg mb-4">The pregame show has been generated!</p>
        <div class="flex gap-4 justify-center">
          <router-link to="/results" class="btn-secondary">
            View Your Results
          </router-link>
          <router-link to="/watch" class="btn-primary">
            WATCH NOW
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
            <span v-if="auth.isSuperfan" class="px-4 bg-slate-900 text-orange-400 text-sm font-medium">
              ⚡ Superfan Exclusive
            </span>
            <button 
              v-else
              @click="handleUnlockClick"
              class="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold rounded-full transition flex items-center gap-2"
            >
              <span>⚡</span>
              <span>Unlock Superfan Content</span>
            </button>
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
            @unlock="handleUnlockClick"
          />
        </div>

        <!-- Submit Section -->
        <div class="sticky bottom-0 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pt-8 pb-4">
          <div class="bg-slate-800 rounded-xl p-4">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-white font-semibold">
                  {{ predictions.selectionCount }} / {{ totalCategories }} votes cast
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
                {{ predictions.submitting ? 'Submitting...' : 'Submit Votes' }}
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
import { ref, computed, onMounted, provide, inject } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMatchupsStore } from '@/stores/matchups'
import { usePredictionsStore } from '@/stores/predictions'
import { FREE_CATEGORIES, SUPERFAN_CATEGORIES } from '@/constants/categories'
import PredictionCard from '@/components/PredictionCard.vue'
import UpgradeModal from '@/components/UpgradeModal.vue'

const auth = useAuthStore()
const matchups = useMatchupsStore()
const predictions = usePredictionsStore()

const showAuthModal = inject('showAuthModal') as () => void
const showUpgradeModal = ref(false)

const freeCategories = FREE_CATEGORIES
const superfanCategories = SUPERFAN_CATEGORIES

const totalCategories = computed(() => {
  return auth.isSuperfan 
    ? freeCategories.length + superfanCategories.length 
    : freeCategories.length
})

function handleSuperfanSelect(categoryId: string, optionId: string) {
  if (!auth.isSuperfan) {
    showUpgradeModal.value = true
    return
  }
  predictions.selectOption(categoryId, optionId)
}

function handleUnlockClick() {
  if (!auth.isLoggedIn) {
    showAuthModal()
    return
  }
  showUpgradeModal.value = true
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
