<template>
  <div>
    <h1 class="text-2xl font-bold text-white mb-8">Users</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-20">
      <div class="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-slate-400">Loading users...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-400 mb-4">{{ error }}</p>
      <button @click="fetchUsers" class="btn-secondary">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="users.length === 0" class="text-center py-20">
      <p class="text-slate-400">No users registered yet.</p>
    </div>

    <!-- Users Table -->
    <div v-else class="card overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-slate-700">
            <th class="text-left py-3 px-4 text-slate-400 font-medium">Username</th>
            <th class="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
            <th class="text-left py-3 px-4 text-slate-400 font-medium">Tier</th>
            <th class="text-left py-3 px-4 text-slate-400 font-medium">XP</th>
            <th class="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="user in users" 
            :key="user.id"
            class="border-b border-slate-700/50 hover:bg-slate-700/30"
          >
            <td class="py-3 px-4 text-white font-medium">{{ user.username }}</td>
            <td class="py-3 px-4 text-slate-300">{{ user.email }}</td>
            <td class="py-3 px-4">
              <span 
                class="px-2 py-1 text-xs font-bold rounded"
                :class="user.tier === 'superfan' ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-600 text-slate-300'"
              >
                {{ user.tier.toUpperCase() }}
              </span>
            </td>
            <td class="py-3 px-4 text-orange-400 font-medium">{{ user.xp_total.toLocaleString() }}</td>
            <td class="py-3 px-4">
              <button 
                v-if="user.tier !== 'superfan'"
                @click="upgradeToSuperfan(user)"
                :disabled="upgrading === user.id"
                class="text-sm text-orange-400 hover:text-orange-300 disabled:opacity-50"
              >
                {{ upgrading === user.id ? 'Upgrading...' : 'Upgrade to Superfan' }}
              </button>
              <span v-else class="text-slate-500 text-sm">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Success Message -->
    <p v-if="upgradeSuccess" class="text-green-400 mt-4 text-center">
      User upgraded to Superfan!
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface User {
  id: string
  email: string
  username: string
  tier: string
  xp_total: number
}

const users = ref<User[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const upgrading = ref<string | null>(null)
const upgradeSuccess = ref(false)

async function fetchUsers() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('/api/admin/users')
    if (!res.ok) throw new Error('Failed to load users')
    const data = await res.json()
    users.value = data.users || []
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load'
  } finally {
    loading.value = false
  }
}

async function upgradeToSuperfan(user: User) {
  upgrading.value = user.id
  upgradeSuccess.value = false

  try {
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier: 'superfan' }),
    })

    if (!res.ok) throw new Error('Failed to upgrade')
    
    // Update local state
    user.tier = 'superfan'
    upgradeSuccess.value = true
    setTimeout(() => { upgradeSuccess.value = false }, 3000)
  } catch {
    // Handle error
  } finally {
    upgrading.value = null
  }
}

onMounted(fetchUsers)
</script>
