<template>
  <div class="min-h-screen bg-slate-900 text-white">
    <Navbar />
    <main>
      <router-view />
    </main>
    <AuthModal v-if="showAuthModal" @close="showAuthModal = false" />
    <RewardsModal v-if="showRewardsModal" @close="showRewardsModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import AuthModal from '@/components/AuthModal.vue'
import RewardsModal from '@/components/RewardsModal.vue'

const auth = useAuthStore()
const showAuthModal = ref(false)
const showRewardsModal = ref(false)

// Provide modal controls to child components
provide('showAuthModal', () => { showAuthModal.value = true })
provide('showRewardsModal', () => { showRewardsModal.value = true })
provide('closeAuthModal', () => { showAuthModal.value = false })

// Check auth on app mount
onMounted(() => {
  auth.checkAuth()
})
</script>
