<template>
  <div>
    <h1 class="text-2xl font-bold text-white mb-8">Scripts</h1>

    <!-- Generate Script Section -->
    <div class="card mb-8">
      <h2 class="text-lg font-bold text-white mb-4">Generate Script</h2>
      <p class="text-slate-400 mb-4">
        Uses Gemini AI to generate drama-optimized outcomes based on community votes.
      </p>
      
      <div v-if="!matchup">
        <p class="text-slate-400">No matchup available</p>
      </div>
      <div v-else>
        <div class="mb-4">
          <p class="text-slate-300">
            <span class="text-slate-400">Matchup:</span> 
            {{ matchup.home_team }} vs {{ matchup.away_team }}
          </p>
          <p class="text-slate-300">
            <span class="text-slate-400">Status:</span> 
            <span :class="matchup.status === 'closed' ? 'text-green-400' : 'text-yellow-400'">
              {{ matchup.status }}
            </span>
          </p>
        </div>

        <button 
          @click="generateScript"
          :disabled="generating || matchup.status === 'open'"
          class="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition"
        >
          {{ generating ? 'Generating...' : 'Generate Script' }}
        </button>
        
        <p v-if="matchup.status === 'open'" class="text-yellow-400 text-sm mt-2">
          Close predictions first to generate script
        </p>
        
        <p v-if="generateError" class="text-red-400 mt-4">
          {{ generateError }}
          <button @click="generateScript" class="text-orange-400 hover:underline ml-2">Retry</button>
        </p>
        <p v-if="generateSuccess" class="text-green-400 mt-4">Script generated successfully!</p>
      </div>
    </div>

    <!-- Generated Script Display -->
    <div class="card" v-if="script">
      <h2 class="text-lg font-bold text-white mb-4">Generated Script</h2>
      
      <!-- Outcomes -->
      <div class="mb-6">
        <h3 class="text-white font-medium mb-3">Outcomes</h3>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="(value, key) in script.outcomes" :key="key" class="bg-slate-700/50 p-3 rounded-lg">
            <p class="text-slate-400 text-xs">{{ key }}</p>
            <p class="text-white font-medium">{{ value }}</p>
          </div>
        </div>
      </div>

      <!-- Final Score -->
      <div class="mb-6" v-if="script.script_json?.final_score">
        <h3 class="text-white font-medium mb-3">Final Score</h3>
        <div class="flex items-center gap-4 bg-slate-700/50 p-4 rounded-lg">
          <div class="text-center">
            <p class="text-3xl font-bold text-white">{{ script.script_json.final_score.seahawks }}</p>
            <p class="text-slate-400 text-sm">Seahawks</p>
          </div>
          <span class="text-slate-500">-</span>
          <div class="text-center">
            <p class="text-3xl font-bold text-white">{{ script.script_json.final_score.patriots }}</p>
            <p class="text-slate-400 text-sm">Patriots</p>
          </div>
        </div>
      </div>

      <!-- Key Moments -->
      <div class="mb-6" v-if="script.script_json?.key_moments">
        <h3 class="text-white font-medium mb-3">Key Moments</h3>
        <ul class="space-y-2">
          <li v-for="(moment, i) in script.script_json.key_moments" :key="i" class="text-slate-300 flex items-start gap-2">
            <span class="text-orange-500">•</span>
            {{ moment }}
          </li>
        </ul>
      </div>

      <!-- Trailer Prompt -->
      <div v-if="script.script_json?.trailer_prompt">
        <h3 class="text-white font-medium mb-3">Trailer Prompt</h3>
        <p class="text-slate-300 bg-slate-700/50 p-4 rounded-lg">
          {{ script.script_json.trailer_prompt }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Matchup {
  id: string
  home_team: string
  away_team: string
  status: string
}

interface Script {
  id: string
  matchup_id: string
  script_json: {
    final_score?: { seahawks: number; patriots: number }
    key_moments?: string[]
    trailer_prompt?: string
  }
  outcomes: Record<string, string>
}

const matchup = ref<Matchup | null>(null)
const script = ref<Script | null>(null)
const generating = ref(false)
const generateError = ref('')
const generateSuccess = ref(false)

async function fetchMatchup() {
  try {
    const res = await fetch('/api/matchups/current')
    const data = await res.json()
    matchup.value = data.matchup || null
  } catch {
    matchup.value = null
  }
}

async function fetchScript() {
  if (!matchup.value) return
  try {
    const res = await fetch(`/api/admin/scripts?matchup_id=${matchup.value.id}`)
    if (res.ok) {
      const data = await res.json()
      script.value = data.script || null
    }
  } catch {
    script.value = null
  }
}

async function generateScript() {
  if (!matchup.value) return
  generating.value = true
  generateError.value = ''
  generateSuccess.value = false

  try {
    const res = await fetch('/api/admin/generate-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchup_id: matchup.value.id }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Generation failed')
    }

    generateSuccess.value = true
    await fetchScript()
  } catch (err) {
    generateError.value = err instanceof Error ? err.message : 'Generation failed'
  } finally {
    generating.value = false
  }
}

onMounted(async () => {
  await fetchMatchup()
  if (matchup.value) {
    await fetchScript()
  }
})
</script>
