<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2">
          <span class="font-display text-3xl text-white tracking-wider">PROMPT<span class="text-orange-500">PLAY</span></span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-6">
          <router-link 
            to="/" 
            class="text-slate-300 hover:text-white transition"
            :class="{ 'text-white font-semibold': $route.name === 'home' }"
          >
            Home
          </router-link>
          <router-link 
            to="/predict" 
            class="text-slate-300 hover:text-white transition"
            :class="{ 'text-white font-semibold': $route.name === 'predict' }"
          >
            Vote
          </router-link>
          <router-link 
            to="/leaderboard" 
            class="text-slate-300 hover:text-white transition"
            :class="{ 'text-white font-semibold': $route.name === 'leaderboard' }"
          >
            Leaderboard
          </router-link>
          <router-link 
            v-if="matchups.isComplete"
            to="/watch" 
            class="text-slate-300 hover:text-white transition"
            :class="{ 'text-white font-semibold': $route.name === 'watch' }"
          >
            Watch
          </router-link>
        </div>

        <!-- User Section -->
        <div class="flex items-center gap-4">
          <template v-if="auth.isLoggedIn">
            <!-- XP Badge (clickable for rewards) -->
            <button 
              @click="openRewardsModal" 
              class="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full hover:bg-slate-700 transition"
            >
              <span class="text-orange-500 font-bold">🏆</span>
              <span class="text-white font-semibold">{{ formatNumber(auth.user?.xp_total || 0) }} XP</span>
              <span class="text-slate-400 text-xs">▼</span>
            </button>
            
            <!-- User Info -->
            <div class="hidden sm:flex items-center gap-2">
              <span class="text-slate-300">{{ auth.user?.username }}</span>
              <span 
                v-if="auth.isSuperfan" 
                class="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-bold rounded"
              >
                SUPERFAN
              </span>
            </div>
            
            <!-- Logout -->
            <button 
              @click="handleLogout" 
              class="text-slate-400 hover:text-white transition text-sm"
            >
              Logout
            </button>
          </template>
          
          <template v-else>
            <button 
              @click="openAuthModal" 
              class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
            >
              Login
            </button>
          </template>

          <!-- Mobile Menu Button -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen" 
            class="md:hidden p-2 text-slate-300 hover:text-white"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                v-if="!mobileMenuOpen" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path 
                v-else 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div 
      v-if="mobileMenuOpen" 
      class="md:hidden bg-slate-800 border-t border-slate-700"
    >
      <div class="px-4 py-4 space-y-3">
        <router-link 
          to="/" 
          class="block py-2 text-slate-300 hover:text-white"
          @click="mobileMenuOpen = false"
        >
          Home
        </router-link>
        <router-link 
          to="/predict" 
          class="block py-2 text-slate-300 hover:text-white"
          @click="mobileMenuOpen = false"
        >
          Vote
        </router-link>
        <router-link 
          to="/leaderboard" 
          class="block py-2 text-slate-300 hover:text-white"
          @click="mobileMenuOpen = false"
        >
          Leaderboard
        </router-link>
        <router-link 
          v-if="matchups.isComplete"
          to="/watch" 
          class="block py-2 text-slate-300 hover:text-white"
          @click="mobileMenuOpen = false"
        >
          Watch
        </router-link>
        <router-link 
          v-if="auth.isLoggedIn && matchups.isComplete"
          to="/results" 
          class="block py-2 text-slate-300 hover:text-white"
          @click="mobileMenuOpen = false"
        >
          Results
        </router-link>
      </div>
    </div>
  </nav>
  
  <!-- Spacer for fixed navbar -->
  <div class="h-16"></div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMatchupsStore } from '@/stores/matchups'

const auth = useAuthStore()
const matchups = useMatchupsStore()
const mobileMenuOpen = ref(false)

const openAuthModal = inject('showAuthModal') as () => void
const openRewardsModal = inject('showRewardsModal') as () => void

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

async function handleLogout() {
  await auth.logout()
  mobileMenuOpen.value = false
}

onMounted(() => {
  matchups.fetchCurrentMatchup()
})
</script>
