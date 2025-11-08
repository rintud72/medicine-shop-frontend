<script setup>
import { useAuthStore } from './stores/authStore'
// 1. cartStore ইমপোর্ট করুন
import { useCartStore } from './stores/cartStore'
import { watch } from 'vue' // 2. watch ইমপোর্ট করুন

const authStore = useAuthStore()
const cartStore = useCartStore() // 3. cartStore ইনস্ট্যান্স

const handleLogout = () => {
  authStore.logout()
}

// ... (watch ফাংশনটি যেমন ছিল তেমনই থাকবে) ...
watch(
  () => authStore.isAuthenticated,
  (isLoggedIn) => {
    if (isLoggedIn) {
      console.log('App.vue Watcher: User logged in, fetching cart...')
      cartStore.fetchCart()
    } else {
      console.log('App.vue Watcher: User logged out, clearing cart.')
      cartStore.items = [] // স্টেট সরাসরি রিসেট
    }
  },
  { immediate: true }
)
</script>

<template>
  <div id="app-container">
    <nav class="navbar">
      <div class="nav-brand">
        <router-link to="/">Medicine Shop</router-link>
      </div>
      <div class="nav-links">
        <router-link to="/">Home</router-link>
        
        <router-link v-if="authStore.isAuthenticated" to="/cart">Cart</router-link>
        <router-link v-if="authStore.isAuthenticated" to="/my-orders">My Orders</router-link>

        <router-link 
          v-if="authStore.isAuthenticated && authStore.user?.role === 'ADMIN'" 
          to="/admin/dashboard"
          class="admin-link"
        >
          Admin Panel
        </router-link>

        <router-link v-if="!authStore.isAuthenticated" to="/login">Login</router-link>
        <router-link v-if="!authStore.isAuthenticated" to="/register">Register</router-link>
        
        <span v-if="authStore.isAuthenticated" class="user-greeting">
          Hello, {{ authStore.user.name }}
        </span>
        <a v-if="authStore.isAuthenticated" @click="handleLogout" href="#" class="logout-link">Logout</a>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
/* ... আপনার পুরনো Navbar, .main-content ইত্যাদি স্টাইল ... */
.admin-link {
  font-weight: bold;
  color: #ffc107 !important; 
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  padding: 1rem 2rem;
  color: white;
}
.nav-brand a {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}
.nav-links a, .nav-links .user-greeting {
  color: white;
  text-decoration: none;
  margin-left: 20px;
}
.nav-links a:hover {
  text-decoration: underline;
}
.nav-links a.router-link-active {
  font-weight: bold;
  color: #42b983;
}
.logout-link {
  cursor: pointer;
  color: #ffc107 !important;
}
.main-content {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
}

/* ----------------------------------------------------------------- */
/* ✅ অ্যাডমিন ফর্মের Width (আগের ফিক্স) */
/* ----------------------------------------------------------------- */
.admin-layout .form-group input,
.admin-layout .form-group textarea {
  width: 100% !important;
  box-sizing: border-box !important;
  font-size: 1rem !important;
}
.admin-layout .form-group textarea {
  min-height: 80px;
  resize: vertical;
}

/* ----------------------------------------------------------------- */
/* ✅ নতুন ফিক্স: অ্যাডমিন ফর্মের কালার এবং স্টাইল */
/* ----------------------------------------------------------------- */
.admin-layout .medicine-form h3 {
  color: #333 !important; /* "Add New Medicine" লেখাটি দেখানো */
  text-align: center;
  margin-top: 0;
  margin-bottom: 20px;
}

.admin-layout .form-group label {
  color: #333 !important; /* লেবেলের লেখা কালো করা */
  font-weight: bold;
  margin-bottom: 5px;
}

.admin-layout .form-group input,
.admin-layout .form-group textarea {
  background-color: #FFFFFF !important; /* ইনপুট বক্স সাদা করা */
  color: #212529 !important; /* ইনপুটের লেখা কালো করা */
  border: 1px solid #ced4da !important;
  padding: 10px !important;
  border-radius: 4px !important;
}

.admin-layout .form-group input[type="file"] {
  padding: 5px !important;
  background-color: #f8f9fa !important; /* ফাইল ইনপুটের জন্য সামান্য আলাদা রঙ */
}

.admin-layout .medicine-form button {
  display: block;
  width: 200px;
  margin: 20px auto 0 auto;
  font-size: 1rem;
  font-weight: bold;
}
/* ----------------------------------------------------------------- */
</style>