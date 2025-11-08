<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

// 1. authStore এবং router অ্যাক্সেস করি
const authStore = useAuthStore()

// 2. ফর্মের ডেটা রাখার জন্য ref তৈরি করি
const name = ref('')
const email = ref('')
const password = ref('')

// 3. ফর্ম সাবমিট হলে authStore-এর register ফাংশনকে কল করি
const handleRegister = async () => {
  if (!name.value || !email.value || !password.value) {
    alert('Please fill in all fields.')
    return
  }
  
  // ব্যাকএন্ডে রেজিস্ট্রেশনের রিকোয়েস্ট পাঠাই
  // [API: /api/users/register]
  await authStore.register(name.value, email.value, password.value)
  
  // সফল হলে authStore নিজেই পেজ পরিবর্তন (navigate) করে দেবে
}
</script>

<template>
  <div class="auth-form">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label>Name:</label>
        <input type="text" v-model="name" required>
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" v-model="password" required>
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<style scoped>
/* একটি বেসিক ফর্ম স্টাইল */
.auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box; /* Padding ঠিক রাখে */
}
button {
  background-color: #42b983;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>