<template>
  <div>
    <h1 class="text-2xl font-bold text-white mb-8">Videos</h1>

    <!-- Render Trailer Section -->
    <div class="card mb-8">
      <h2 class="text-lg font-bold text-white mb-4">Render Trailer</h2>
      <p class="text-slate-400 mb-4">
        Uses fal.ai Veo 3.1 to generate an 8-second anime-style trailer from the script.
      </p>
      
      <div v-if="!matchup">
        <p class="text-slate-400">No matchup available</p>
      </div>
      <div v-else-if="!hasScript">
        <p class="text-yellow-400">Generate a script first before rendering the trailer.</p>
        <router-link to="/admin/scripts" class="text-orange-500 hover:underline text-sm">
          Go to Scripts →
        </router-link>
      </div>
      <div v-else>
        <div class="mb-4">
          <p class="text-slate-300">
            <span class="text-slate-400">Matchup:</span> 
            {{ matchup.home_team }} vs {{ matchup.away_team }}
          </p>
          <p class="text-slate-300">
            <span class="text-slate-400">Script:</span> 
            <span class="text-green-400">Ready</span>
          </p>
        </div>

        <button 
          @click="renderTrailer"
          :disabled="rendering"
          class="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition"
        >
          {{ rendering ? 'Rendering...' : 'Render 8s Trailer' }}
        </button>
        
        <p v-if="rendering" class="text-slate-400 text-sm mt-2">
          This may take 1-2 minutes...
        </p>
        
        <p v-if="renderError" class="text-red-400 mt-4">
          {{ renderError }}
          <button @click="renderTrailer" class="text-orange-400 hover:underline ml-2">Retry</button>
        </p>
        <p v-if="renderSuccess" class="text-green-400 mt-4">Trailer rendered successfully!</p>
      </div>
    </div>

    <!-- Video Preview -->
    <div class="card" v-if="videoUrl">
      <h2 class="text-lg font-bold text-white mb-4">Trailer Preview</h2>
      
      <div class="rounded-xl overflow-hidden bg-black mb-4">
        <video 
          :src="videoUrl"
          controls
          class="w-full aspect-video"
          poster="/images/Gemini_Generated_Image_uy5u78uy5u78uy5u-3.png"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div class="flex flex-wrap gap-4">
        <a 
          :href="videoUrl" 
          target="_blank"
          class="btn-secondary text-sm"
        >
          Open in New Tab
        </a>
        <router-link to="/watch" class="btn-secondary text-sm">
          View Public Page
        </router-link>
      </div>
    </div>

    <!-- Reference Images -->
    <div class="card mt-8">
      <h2 class="text-lg font-bold text-white mb-4">Reference Images</h2>
      <p class="text-slate-400 text-sm mb-4">
        These images are used to guide Veo's visual style
      </p>
      <div class="grid grid-cols-3 gap-4">
        <div class="rounded-lg overflow-hidden">
          <img src="/images/Gemini_Generated_Image_uy5u78uy5u78uy5u.png" alt="Action" class="w-full h-auto" />
          <p class="text-slate-400 text-xs text-center mt-1">Action</p>
        </div>
        <div class="rounded-lg overflow-hidden">
          <img src="/images/Gemini_Generated_Image_uy5u78uy5u78uy5u-2.png" alt="Power-up" class="w-full h-auto" />
          <p class="text-slate-400 text-xs text-center mt-1">Power-up</p>
        </div>
        <div class="rounded-lg overflow-hidden">
          <img src="/images/Gemini_Generated_Image_uy5u78uy5u78uy5u-3.png" alt="Face-off" class="w-full h-auto" />
          <p class="text-slate-400 text-xs text-center mt-1">Face-off (used)</p>
        </div>
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
  video_url_trailer?: string
}

const matchup = ref<Matchup | null>(null)
const hasScript = ref(false)
const videoUrl = ref<string | null>(null)
const rendering = ref(false)
const renderError = ref('')
const renderSuccess = ref(false)

async function fetchMatchup() {
  try {
    const res = await fetch('/api/matchups/current')
    const data = await res.json()
    matchup.value = data.matchup || null
    videoUrl.value = data.matchup?.video_url_trailer || null
  } catch {
    matchup.value = null
  }
}

async function checkScript() {
  if (!matchup.value) return
  try {
    const res = await fetch(`/api/admin/scripts?matchup_id=${matchup.value.id}`)
    if (res.ok) {
      const data = await res.json()
      hasScript.value = !!data.script
    }
  } catch {
    hasScript.value = false
  }
}

async function renderTrailer() {
  if (!matchup.value) return
  rendering.value = true
  renderError.value = ''
  renderSuccess.value = false

  try {
    const res = await fetch('/api/admin/render-trailer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchup_id: matchup.value.id }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Rendering failed')
    }

    const data = await res.json()
    videoUrl.value = data.video_url
    renderSuccess.value = true
    
    // Refresh matchup to get updated video_url
    await fetchMatchup()
  } catch (err) {
    renderError.value = err instanceof Error ? err.message : 'Rendering failed'
  } finally {
    rendering.value = false
  }
}

onMounted(async () => {
  await fetchMatchup()
  if (matchup.value) {
    await checkScript()
  }
})
</script>
