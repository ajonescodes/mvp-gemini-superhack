<template>
  <div 
    class="card"
    :class="[
      result.correct 
        ? 'border-l-4 border-green-500' 
        : 'border-l-4 border-red-500'
    ]"
  >
    <div class="flex items-start justify-between">
      <div>
        <h3 class="text-white font-semibold mb-1">{{ getCategoryQuestion(result.category) }}</h3>
        <div class="flex items-center gap-2 text-sm">
          <span class="text-slate-400">Your pick:</span>
          <span 
            class="font-medium"
            :class="result.correct ? 'text-green-400' : 'text-red-400'"
          >
            {{ getOptionLabel(result.category, result.selection) }}
          </span>
        </div>
        <div v-if="!result.correct" class="flex items-center gap-2 text-sm mt-1">
          <span class="text-slate-400">Actual:</span>
          <span class="text-white font-medium">
            {{ getOptionLabel(result.category, result.outcome) }}
          </span>
        </div>
      </div>
      <div class="text-right">
        <div 
          class="flex items-center gap-2 mb-1"
          :class="result.correct ? 'text-green-400' : 'text-red-400'"
        >
          <span v-if="result.correct" class="text-lg">✓</span>
          <span v-else class="text-lg">✗</span>
        </div>
        <p 
          v-if="result.correct"
          class="text-green-400 font-bold"
        >
          +{{ result.xp_earned }} XP
        </p>
        <p v-else class="text-slate-500 text-sm">0 XP</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PredictionResult } from '@/stores/results'
import { CATEGORIES } from '@/constants/categories'

defineProps<{
  result: PredictionResult
}>()

function getCategoryQuestion(categoryId: string): string {
  return CATEGORIES.find(c => c.id === categoryId)?.question || categoryId
}

function getOptionLabel(categoryId: string, optionId: string): string {
  const category = CATEGORIES.find(c => c.id === categoryId)
  return category?.options.find(o => o.id === optionId)?.label || optionId
}
</script>
