<template>
  <div class="min-h-screen bg-slate-900 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-800 border-r border-slate-700 hidden md:block">
      <div class="p-4 border-b border-slate-700">
        <h2 class="text-lg font-bold text-white">Admin Panel</h2>
        <p class="text-slate-400 text-sm">PromptPlay Sports</p>
      </div>
      <nav class="p-4 space-y-2">
        <router-link 
          to="/admin"
          exact
          class="block px-4 py-2 rounded-lg transition"
          :class="$route.name === 'admin-dashboard' ? 'bg-orange-500 text-white' : 'text-slate-300 hover:bg-slate-700'"
        >
          Dashboard
        </router-link>
        <router-link 
          to="/admin/matchups"
          class="block px-4 py-2 rounded-lg transition"
          :class="$route.name === 'admin-matchups' ? 'bg-orange-500 text-white' : 'text-slate-300 hover:bg-slate-700'"
        >
          Matchups
        </router-link>
        <router-link 
          to="/admin/scripts"
          class="block px-4 py-2 rounded-lg transition"
          :class="$route.name === 'admin-scripts' ? 'bg-orange-500 text-white' : 'text-slate-300 hover:bg-slate-700'"
        >
          Scripts
        </router-link>
        <router-link 
          to="/admin/videos"
          class="block px-4 py-2 rounded-lg transition"
          :class="$route.name === 'admin-videos' ? 'bg-orange-500 text-white' : 'text-slate-300 hover:bg-slate-700'"
        >
          Videos
        </router-link>
        <router-link 
          to="/admin/users"
          class="block px-4 py-2 rounded-lg transition"
          :class="$route.name === 'admin-users' ? 'bg-orange-500 text-white' : 'text-slate-300 hover:bg-slate-700'"
        >
          Users
        </router-link>
      </nav>
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 w-64">
        <router-link to="/" class="text-slate-400 hover:text-white transition text-sm">
          ← Back to Site
        </router-link>
      </div>
    </aside>

    <!-- Mobile Header -->
    <div class="md:hidden fixed top-0 left-0 right-0 bg-slate-800 border-b border-slate-700 z-50">
      <div class="flex items-center justify-between p-4">
        <h2 class="text-lg font-bold text-white">Admin</h2>
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-slate-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <!-- Mobile Menu -->
      <nav v-if="mobileMenuOpen" class="p-4 space-y-2 border-t border-slate-700">
        <router-link to="/admin" class="block py-2 text-slate-300" @click="mobileMenuOpen = false">Dashboard</router-link>
        <router-link to="/admin/matchups" class="block py-2 text-slate-300" @click="mobileMenuOpen = false">Matchups</router-link>
        <router-link to="/admin/scripts" class="block py-2 text-slate-300" @click="mobileMenuOpen = false">Scripts</router-link>
        <router-link to="/admin/videos" class="block py-2 text-slate-300" @click="mobileMenuOpen = false">Videos</router-link>
        <router-link to="/admin/users" class="block py-2 text-slate-300" @click="mobileMenuOpen = false">Users</router-link>
        <router-link to="/" class="block py-2 text-slate-400" @click="mobileMenuOpen = false">← Back to Site</router-link>
      </nav>
    </div>

    <!-- Main Content -->
    <main class="flex-1 p-4 md:p-8 mt-16 md:mt-0">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)
</script>
