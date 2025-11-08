<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert('Please fill in all fields.')
    return
  }
  // [API: /api/users/login]
  await authStore.login(email.value, password.value)
  // সফল হলে authStore নিজেই হোম পেজে পাঠিয়ে দেবে
}
</script>

<template>
  <div class="auth-form">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" v-model="password" required>
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<style scoped>
.auth-form { max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; }
.form-group input { width: 100%; padding: 8px; box-sizing: border-box; }
button { background-color: #42b983; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; }
</style>