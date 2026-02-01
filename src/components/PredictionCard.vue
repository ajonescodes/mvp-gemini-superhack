<template>
  <div 
    class="card relative"
    :class="{ 'opacity-60': locked }"
  >
    <!-- Locked Overlay -->
    <div 
      v-if="locked" 
      @click="$emit('unlock')"
      class="absolute inset-0 bg-slate-900/80 rounded-xl flex items-center justify-center z-10 cursor-pointer hover:bg-slate-900/70 transition"
    >
      <div class="text-center">
        <span class="text-3xl mb-2 block">🔒</span>
        <p class="text-slate-300 font-medium">Superfan Only</p>
        <p class="text-orange-400 text-sm font-medium hover:underline">Tap to unlock →</p>
      </div>
    </div>

    <!-- Question Number -->
    <div class="flex items-start gap-4 mb-4">
      <div class="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
        <span class="text-orange-500 font-bold">{{ String(index).padStart(2, '0') }}</span>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-white">{{ category.question }}</h3>
        <p class="text-slate-500 text-sm">Cast your vote</p>
      </div>
    </div>

    <!-- Options -->
    <div class="space-y-2">
      <button
        v-for="option in category.options"
        :key="option.id"
        @click="!locked && $emit('select', option.id)"
        :disabled="locked"
        class="w-full p-4 rounded-lg border-2 transition flex items-center justify-between text-left"
        :class="[
          selected === option.id
            ? 'border-orange-500 bg-orange-500/10'
            : 'border-slate-700 hover:border-slate-600 bg-slate-800/50',
          submitted === option.id && selected !== option.id
            ? 'border-green-500/50'
            : ''
        ]"
      >
        <div class="flex items-center gap-3">
          <!-- Radio indicator -->
          <div 
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
            :class="[
              selected === option.id
                ? 'border-orange-500 bg-orange-500'
                : 'border-slate-600'
            ]"
          >
            <div 
              v-if="selected === option.id" 
              class="w-2 h-2 bg-white rounded-full"
            ></div>
          </div>
          
          <span class="text-white">{{ option.label }}</span>
        </div>
        
        <!-- Multiplier Badge -->
        <span 
          class="px-2 py-1 text-xs font-bold rounded"
          :class="[
            option.multiplier >= 5 
              ? 'bg-purple-500/20 text-purple-400' 
              : option.multiplier >= 2.5 
                ? 'bg-orange-500/20 text-orange-400'
                : 'bg-slate-700 text-slate-400'
          ]"
        >
          {{ option.multiplier }}x
        </span>
      </button>
    </div>

    <!-- Saved indicator -->
    <div 
      v-if="submitted && submitted === selected" 
      class="mt-3 flex items-center gap-2 text-green-400 text-sm"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      <span>Saved</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '@/constants/categories'

defineProps<{
  category: Category
  index: number
  selected?: string
  submitted?: string
  locked?: boolean
}>()

defineEmits<{
  (e: 'select', optionId: string): void
  (e: 'unlock'): void
}>()
</script>
