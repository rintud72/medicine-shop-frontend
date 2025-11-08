<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const email = ref('') // রেজিস্ট্রেশনের সময় ব্যবহৃত ইমেইল
const otp = ref('')

const handleVerify = async () => {
  if (!email.value || !otp.value) {
    alert('Please fill in both fields.')
    return
  }
  // [API: /api/users/verify-otp]
  await authStore.verifyOTP(email.value, otp.value)
}
</script>

<template>
  <div class="auth-form">
    <h2>Verify OTP</h2>
    <p>Please enter the email you used for registration and the OTP sent to you.</p>
    <form @submit.prevent="handleVerify">
      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label>OTP:</label>
        <input type="text" v-model="otp" required>
      </div>
      <button type="submit">Verify</button>
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