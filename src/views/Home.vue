<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Animated background -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      
      <!-- Background image overlay -->
      <div 
        class="absolute inset-0 opacity-20 bg-cover bg-center"
        :style="{ backgroundImage: `url('/images/Gemini_Generated_Image_uy5u78uy5u78uy5u-3.png')` }"
      ></div>
      
      <!-- Floating elements -->
      <div class="absolute top-1/4 left-10 w-20 h-20 opacity-30 animate-float-slow">
        <div class="w-full h-full bg-seahawks-green rounded-full blur-xl"></div>
      </div>
      <div class="absolute bottom-1/3 right-10 w-16 h-16 opacity-30 animate-float-fast">
        <div class="w-full h-full bg-patriots-red rounded-full blur-xl"></div>
      </div>
      
      <!-- Main content -->
      <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 class="font-display text-6xl sm:text-7xl md:text-9xl text-white mb-4 animate-pulse-glow tracking-wider">
          PROMPT<span class="text-orange-500">PLAY</span>
        </h1>
        <p class="font-display text-2xl md:text-3xl text-slate-300 mb-8 max-w-2xl mx-auto tracking-wide">
          THE GAME BEFORE THE GAME
        </p>
        <p class="text-slate-400 mb-8 max-w-xl mx-auto">
          Write the script for the ultimate anime-style pregame show, streamed live on YouTube before kickoff. 
          Your votes shape the story. AI brings it to life.
        </p>
        <router-link 
          to="/predict"
          class="btn-primary text-lg"
        >
          WRITE YOUR STORY
        </router-link>
      </div>
      
      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-20 px-4">
      <h2 class="font-display text-5xl text-center text-white mb-4 tracking-wide">HOW IT WORKS</h2>
      <p class="text-slate-400 text-center mb-16 max-w-xl mx-auto">
        Three simple steps to co-write the pregame show everyone will be watching
      </p>
      <div class="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        <div class="text-center p-6">
          <div class="w-20 h-20 mx-auto mb-4 bg-slate-800 rounded-2xl flex items-center justify-center text-4xl">
            🎯
          </div>
          <div class="text-orange-500 font-bold text-sm mb-2">STEP 1</div>
          <h3 class="font-display text-2xl text-white mb-2 tracking-wide">VOTE</h3>
          <p class="text-slate-400">
            Decide who scores first, who wins, and more. Pick superpowers for each team!
          </p>
        </div>
        <div class="text-center p-6">
          <div class="w-20 h-20 mx-auto mb-4 bg-slate-800 rounded-2xl flex items-center justify-center text-4xl">
            🤖
          </div>
          <div class="text-orange-500 font-bold text-sm mb-2">STEP 2</div>
          <h3 class="font-display text-2xl text-white mb-2 tracking-wide">AI GENERATES</h3>
          <p class="text-slate-400">
            Community votes shape the story. AI creates an anime-style video of the game you wrote.
          </p>
        </div>
        <div class="text-center p-6">
          <div class="w-20 h-20 mx-auto mb-4 bg-slate-800 rounded-2xl flex items-center justify-center text-4xl">
            🏆
          </div>
          <div class="text-orange-500 font-bold text-sm mb-2">STEP 3</div>
          <h3 class="font-display text-2xl text-white mb-2 tracking-wide">WATCH LIVE</h3>
          <p class="text-slate-400">
            Tune in to YouTube before kickoff. See YOUR story play out live!
          </p>
        </div>
      </div>
    </section>

    <!-- Current Matchup -->
    <section class="py-20 px-4 bg-slate-800/50">
      <div class="max-w-3xl mx-auto text-center">
        <p class="font-display text-orange-500 text-xl mb-4 tracking-widest">SUPER BOWL LX</p>
        
        <!-- Teams -->
        <div class="flex items-center justify-center gap-4 sm:gap-8 mb-6">
          <div class="text-center">
            <div class="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-2 bg-seahawks-navy rounded-xl flex items-center justify-center">
              <span class="text-seahawks-green text-3xl sm:text-4xl font-black">SEA</span>
            </div>
            <p class="text-white font-semibold">Seahawks</p>
            <p class="text-slate-400 text-sm">14-3</p>
          </div>
          
          <span class="font-display text-5xl sm:text-6xl text-slate-600">VS</span>
          
          <div class="text-center">
            <div class="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-2 bg-patriots-navy rounded-xl flex items-center justify-center">
              <span class="text-patriots-red text-3xl sm:text-4xl font-black">NE</span>
            </div>
            <p class="text-white font-semibold">Patriots</p>
            <p class="text-slate-400 text-sm">14-3</p>
          </div>
        </div>
        
        <!-- Matchup Image -->
        <div class="mb-8 rounded-xl overflow-hidden max-w-lg mx-auto">
          <img 
            src="/images/Gemini_Generated_Image_uy5u78uy5u78uy5u-3.png" 
            alt="Super Bowl LX Matchup" 
            class="w-full h-auto"
          />
        </div>
        
        <p class="text-slate-400 mb-4">February 8, 2026</p>
        
        <!-- Prediction Count -->
        <p class="text-2xl text-white mb-8" v-if="matchups.hasActiveMatchup">
          <span class="text-orange-500 font-bold">{{ matchups.predictionCount.toLocaleString() }}</span> 
          fans writing the story
        </p>
        
        <!-- Status-based CTA -->
        <div v-if="matchups.hasActiveMatchup">
          <router-link 
            v-if="matchups.isOpen"
            to="/predict" 
            class="btn-primary"
          >
            JOIN THE SCRIPT
          </router-link>
          <router-link 
            v-else-if="matchups.isComplete"
            to="/watch" 
            class="btn-primary"
          >
            WATCH NOW
          </router-link>
          <p v-else class="text-slate-400">
            Predictions closed. Generating video...
          </p>
        </div>
        <p v-else class="text-slate-400">
          No active matchup. Check back soon!
        </p>
      </div>
    </section>

    <!-- Features Preview -->
    <section class="py-20 px-4">
      <div class="max-w-5xl mx-auto">
        <h2 class="font-display text-4xl text-center text-white mb-12 tracking-wide">ANIME-STYLE ACTION</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div class="rounded-xl overflow-hidden">
            <img 
              src="/images/Gemini_Generated_Image_uy5u78uy5u78uy5u.png" 
              alt="Action Scene" 
              class="w-full h-auto"
            />
            <div class="p-4 bg-slate-800">
              <p class="text-white font-semibold">Dynamic Gameplay</p>
              <p class="text-slate-400 text-sm">Speed lines, dramatic angles, and explosive action</p>
            </div>
          </div>
          <div class="rounded-xl overflow-hidden">
            <img 
              src="/images/Gemini_Generated_Image_uy5u78uy5u78uy5u-2.png" 
              alt="Power-up Scene" 
              class="w-full h-auto"
            />
            <div class="p-4 bg-slate-800">
              <p class="text-white font-semibold">Superpowers Unleashed</p>
              <p class="text-slate-400 text-sm">Each team gets a superpower you choose</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-20 px-4 text-center">
      <h2 class="font-display text-4xl text-white mb-4 tracking-wide">READY TO WRITE THE PREGAME SHOW?</h2>
      <p class="text-slate-400 mb-8 max-w-md mx-auto">
        Every vote shapes the story. The show streams live before kickoff.
      </p>
      <router-link to="/predict" class="btn-primary">
        CAST YOUR VOTES
      </router-link>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMatchupsStore } from '@/stores/matchups'

const matchups = useMatchupsStore()

onMounted(async () => {
  await matchups.fetchCurrentMatchup()
  if (matchups.hasActiveMatchup) {
    await matchups.fetchPredictionCount()
  }
})
</script>
