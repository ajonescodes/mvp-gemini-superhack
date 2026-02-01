<template>
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black/60 backdrop-blur-sm" 
      @click="$emit('close')"
    ></div>
    
    <!-- Modal -->
    <div class="relative w-full sm:max-w-md bg-slate-800 rounded-t-2xl sm:rounded-xl p-6 animate-slide-up sm:animate-none">
      <!-- Close Button -->
      <button 
        @click="$emit('close')" 
        class="absolute top-4 right-4 text-slate-400 hover:text-white transition"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Header -->
      <div class="text-center mb-6">
        <h2 class="font-display text-3xl text-white mb-2 tracking-wide">REDEEM YOUR POINTS</h2>
        <div class="flex items-center justify-center gap-2 text-3xl">
          <span class="text-orange-500">🏆</span>
          <span class="font-display text-4xl text-white">{{ auth.user?.xp_total || 0 }} XP</span>
        </div>
      </div>

      <!-- Rewards List -->
      <div class="space-y-3">
        <div 
          v-for="reward in rewards" 
          :key="reward.id"
          class="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ reward.icon }}</span>
            <div>
              <p class="text-white font-medium">{{ reward.title }}</p>
              <p class="text-slate-400 text-sm">{{ reward.cost.toLocaleString() }} XP</p>
            </div>
          </div>
          <button 
            disabled
            class="px-3 py-1.5 bg-slate-600 text-slate-400 text-sm font-medium rounded-lg cursor-not-allowed flex items-center gap-1"
          >
            <span>🔒</span>
            <span>Coming Soon</span>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-slate-500 text-sm mt-6">
        More rewards coming soon! Keep earning XP by shaping the story.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

defineEmits(['close'])

const auth = useAuthStore()

const rewards = [
  {
    id: 1,
    icon: '🎫',
    title: '15% off Seahawks Pro Shop',
    cost: 3000,
  },
  {
    id: 2,
    icon: '🖼️',
    title: 'Custom avatar frame',
    cost: 1500,
  },
  {
    id: 3,
    icon: '🎤',
    title: 'Virtual meet & greet with legend',
    cost: 25000,
  },
]
</script>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
