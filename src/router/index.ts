import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy-loaded views
const Home = () => import('@/views/Home.vue')
const Predict = () => import('@/views/Predict.vue')
const Results = () => import('@/views/Results.vue')
const Watch = () => import('@/views/Watch.vue')
const Leaderboard = () => import('@/views/Leaderboard.vue')

// Admin views
const AdminLayout = () => import('@/views/admin/AdminLayout.vue')
const AdminDashboard = () => import('@/views/admin/Dashboard.vue')
const AdminMatchups = () => import('@/views/admin/Matchups.vue')
const AdminScripts = () => import('@/views/admin/Scripts.vue')
const AdminVideos = () => import('@/views/admin/Videos.vue')
const AdminUsers = () => import('@/views/admin/Users.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/predict', name: 'predict', component: Predict }, // NO auth required to view
    { path: '/results', name: 'results', component: Results, meta: { requiresAuth: true } },
    { path: '/watch', name: 'watch', component: Watch }, // Public for sharing
    { path: '/leaderboard', name: 'leaderboard', component: Leaderboard },
    
    // Admin routes (no auth for demo)
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: '', name: 'admin-dashboard', component: AdminDashboard },
        { path: 'matchups', name: 'admin-matchups', component: AdminMatchups },
        { path: 'scripts', name: 'admin-scripts', component: AdminScripts },
        { path: 'videos', name: 'admin-videos', component: AdminVideos },
        { path: 'users', name: 'admin-users', component: AdminUsers },
      ],
    },
    
    // Catch-all redirect
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// Navigation guards
router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore()
  
  // Wait for auth check if loading
  if (auth.loading) {
    await auth.checkAuth()
  }
  
  // Check if route requires auth
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next({ name: 'home' })
  }
  
  next()
})

export default router
