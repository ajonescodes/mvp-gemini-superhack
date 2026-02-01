<template>
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black/60 backdrop-blur-sm" 
      @click="$emit('close')"
    ></div>
    
    <!-- Modal -->
    <div class="relative w-full sm:max-w-md bg-slate-800 rounded-t-2xl sm:rounded-xl p-6 sm:p-8 animate-slide-up sm:animate-none">
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
      <h2 class="font-display text-3xl text-white mb-2 tracking-wide">
        {{ isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT' }}
      </h2>
      <p class="text-slate-400 mb-6">
        {{ isLogin ? 'Sign in to submit your votes' : 'Join to shape the show and earn XP' }}
      </p>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="label">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="input"
            placeholder="you@example.com"
          />
        </div>

        <div v-if="!isLogin">
          <label class="label">Username</label>
          <input
            v-model="form.username"
            type="text"
            required
            minlength="3"
            maxlength="20"
            pattern="[a-zA-Z0-9_]+"
            class="input"
            placeholder="your_username"
          />
          <p class="text-slate-500 text-xs mt-1">3-20 characters, letters/numbers/underscores only</p>
        </div>

        <div>
          <label class="label">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            minlength="8"
            class="input"
            placeholder="••••••••"
          />
          <p v-if="!isLogin" class="text-slate-500 text-xs mt-1">At least 8 characters</p>
        </div>

        <!-- Error Message -->
        <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition"
        >
          {{ loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account') }}
        </button>
      </form>

      <!-- Toggle -->
      <p class="text-slate-400 text-center mt-6">
        {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
        <button 
          @click="isLogin = !isLogin; error = ''" 
          class="text-orange-400 hover:underline ml-1 font-medium"
        >
          {{ isLogin ? 'Sign up' : 'Sign in' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject } from 'vue'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['close'])
const auth = useAuthStore()

const isLogin = ref(true)
const loading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  username: '',
  password: '',
})

// Get callback for after auth (if provided)
const onAuthSuccess = inject<(() => void) | undefined>('onAuthSuccess', undefined)

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    if (isLogin.value) {
      await auth.login(form.email, form.password)
    } else {
      await auth.register(form.email, form.username, form.password)
    }
    
    emit('close')
    
    // Call success callback if provided
    if (onAuthSuccess) {
      onAuthSuccess()
    }
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Authentication failed'
  } finally {
    loading.value = false
  }
}
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
