import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/authStore' // 1. authStore ইমপোর্ট করুন

// ইউজার পেজগুলো
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import VerifyOTP from './pages/VerifyOTP.vue'
import Cart from './pages/Cart.vue'
import MyOrders from './pages/MyOrders.vue'

// 2. অ্যাডমিন লেআউট এবং পেজগুলো ইমপোর্ট করুন
import AdminLayout from '../src/layouts/AdminLayout.vue'
import AdminDashboard from './pages/admin/AdminDashboard.vue'
import ManageMedicines from './pages/admin/ManageMedicines.vue'
import ManageOrders from './pages/admin/ManageOrders.vue'


const routes = [
  // ... (আপনার আগের ইউজার রুটগুলো: Home, Login, Register...)
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/verify-otp', name: 'VerifyOTP', component: VerifyOTP },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/my-orders', name: 'MyOrders', component: MyOrders },

  // -----------------------------------------------------------------
  // ✅ নতুন অ্যাডমিন রুট (নেস্টেড রুট)
  // -----------------------------------------------------------------
  {
    path: '/admin',
    component: AdminLayout, // 3. মূল কম্পোনেন্ট হলো AdminLayout
    meta: { requiresAdmin: true }, // 4. এই রুট এবং এর সব চাইল্ড অ্যাডমিন-অনলি
    children: [
      {
        path: 'dashboard', // /admin/dashboard
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: 'medicines', // /admin/medicines
        name: 'ManageMedicines',
        component: ManageMedicines
      },
      {
        path: 'orders', // /admin/orders
        name: 'ManageOrders',
        component: ManageOrders
      },
      // ডিফল্টভাবে /admin-এ গেলে /admin/dashboard-এ পাঠিয়ে দেবে
      {
        path: '',
        redirect: { name: 'AdminDashboard' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// -----------------------------------------------------------------
// ✅ নেভিগেশন গার্ড (Navigation Guard)
// -----------------------------------------------------------------
// 5. রুট পরিবর্তন করার আগে এটি চেক করবে
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // চেক করুন যে রুটটি অ্যাডমিন অ্যাক্সেস চায় কিনা
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    
    // ইউজার কি লগইন করা আছে? এবং সে কি অ্যাডমিন?
    if (authStore.isAuthenticated && authStore.user?.role === 'ADMIN') {
      next() // হ্যাঁ, তাকে যেতে দিন
    } else if (authStore.isAuthenticated) {
      alert('You do not have permission to access this page.')
      next({ name: 'Home' }) // অ্যাডমিন নয়, হোম পেজে পাঠান
    } else {
      alert('Please log in as an admin to continue.')
      next({ name: 'Login' }) // লগইন করা নেই, লগইন পেজে পাঠান
    }
  } else {
    next() // এই রুটটি অ্যাডমিন অ্যাক্সেস চায় না, যেতে দিন
  }
})

export default router