<template>
  <Teleport to="body">
    <div 
      v-if="show" 
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="$emit('close')"
    >
      <div class="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <!-- Header with gradient -->
        <div class="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-center">
          <div class="text-4xl mb-2">⚡</div>
          <h2 class="text-2xl font-bold text-white">Become a Superfan</h2>
          <p class="text-orange-100 text-sm mt-1">Get more influence on the pregame show</p>
        </div>

        <!-- Benefits -->
        <div class="p-6 space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-lg">🔓</span>
            </div>
            <div>
              <p class="text-white font-medium">All Voting Categories Unlocked</p>
              <p class="text-slate-400 text-sm">Access power-ups, stadium voting & exclusive story choices</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-lg">3️⃣</span>
            </div>
            <div>
              <p class="text-white font-medium">3x Voting Weight</p>
              <p class="text-slate-400 text-sm">Your votes have more influence on the show</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-lg">🎬</span>
            </div>
            <div>
              <p class="text-white font-medium">Early Show Access</p>
              <p class="text-slate-400 text-sm">Watch the generated show 24 hours before the stream</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-lg">🏆</span>
            </div>
            <div>
              <p class="text-white font-medium">Exclusive Badge</p>
              <p class="text-slate-400 text-sm">Stand out on the leaderboard with your Superfan badge</p>
            </div>
          </div>
        </div>

        <!-- Price & CTA -->
        <div class="px-6 pb-6">
          <!-- Mock notice -->
          <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
            <p class="text-yellow-400 text-sm text-center">
              ⚠️ Demo Mode: No payment required — instant upgrade!
            </p>
          </div>

          <div class="text-center mb-4">
            <span class="text-slate-400 line-through text-lg">$1.99/mo</span>
            <span class="text-green-400 font-bold text-2xl ml-2">FREE</span>
            <span class="text-slate-500 text-sm block">for demo</span>
          </div>

          <button
            @click="handleUpgrade"
            :disabled="upgrading"
            class="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold rounded-xl transition text-lg"
          >
            {{ upgrading ? 'Upgrading...' : '⚡ Unlock Superfan Now' }}
          </button>

          <button
            @click="$emit('close')"
            class="w-full py-3 text-slate-400 hover:text-white transition mt-2"
          >
            Maybe later
          </button>

          <p v-if="error" class="text-red-400 text-sm text-center mt-2">
            {{ error }}
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'upgraded'): void
}>()

const auth = useAuthStore()
const upgrading = ref(false)
const error = ref('')

async function handleUpgrade() {
  if (!auth.isLoggedIn) {
    error.value = 'Please log in first'
    return
  }

  upgrading.value = true
  error.value = ''

  try {
    const res = await fetch('/api/auth?action=upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await res.json()
    
    if (!res.ok) {
      throw new Error(data.error || 'Upgrade failed')
    }

    // Update the local user state
    if (auth.user) {
      auth.user.tier = 'superfan'
    }

    emit('upgraded')
    emit('close')
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Upgrade failed'
  } finally {
    upgrading.value = false
  }
}
</script>
