<template>
  <div class="min-h-screen bg-slate-900 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Your Results</h1>
        <p class="text-slate-400">See how your predictions matched up</p>
      </div>

      <!-- Loading State -->
      <div v-if="results.loading" class="text-center py-20">
        <div class="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-slate-400">Loading results...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="results.error" class="text-center py-20">
        <p class="text-red-400 mb-4">{{ results.error }}</p>
        <button @click="loadResults" class="btn-secondary">Try Again</button>
      </div>

      <!-- No Results -->
      <div v-else-if="!results.results" class="text-center py-20">
        <p class="text-slate-400">No results available yet.</p>
        <router-link to="/" class="text-orange-500 hover:underline mt-4 inline-block">
          Return home
        </router-link>
      </div>

      <!-- Results Content -->
      <div v-else>
        <!-- Final Score Card -->
        <div v-if="results.results.final_score" class="card mb-8 text-center">
          <p class="text-orange-500 font-bold text-sm mb-4">FINAL SCORE</p>
          <div class="flex items-center justify-center gap-8">
            <div>
              <p class="text-4xl font-black text-white">{{ results.results.final_score.seahawks }}</p>
              <p class="text-slate-400">Seahawks</p>
            </div>
            <span class="text-2xl text-slate-600">-</span>
            <div>
              <p class="text-4xl font-black text-white">{{ results.results.final_score.patriots }}</p>
              <p class="text-slate-400">Patriots</p>
            </div>
          </div>
        </div>

        <!-- XP Summary -->
        <div class="card mb-8 bg-gradient-to-r from-orange-500/20 to-transparent">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-400 text-sm">Total XP Earned</p>
              <p class="text-3xl font-bold text-white">
                <span class="text-orange-500">+{{ results.results.total_xp }}</span> XP
              </p>
            </div>
            <div class="text-right">
              <p class="text-slate-400 text-sm">Correct Predictions</p>
              <p class="text-2xl font-bold text-white">
                {{ correctCount }} / {{ results.results.predictions.length }}
              </p>
            </div>
          </div>
        </div>

        <!-- Result Cards -->
        <div class="space-y-4">
          <ResultCard
            v-for="result in results.results.predictions"
            :key="result.category"
            :result="result"
          />
        </div>

        <!-- Watch CTA -->
        <div class="mt-8 text-center">
          <router-link to="/watch" class="btn-primary">
            Watch the Trailer
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useMatchupsStore } from '@/stores/matchups'
import { useResultsStore } from '@/stores/results'
import ResultCard from '@/components/ResultCard.vue'

const matchups = useMatchupsStore()
const results = useResultsStore()

const correctCount = computed(() => {
  return results.results?.predictions.filter(p => p.correct).length || 0
})

async function loadResults() {
  await matchups.fetchCurrentMatchup()
  if (matchups.currentMatchup) {
    await results.fetchResults(matchups.currentMatchup.id)
  }
}

onMounted(loadResults)
</script>
