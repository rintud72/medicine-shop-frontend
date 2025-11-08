// src/stores/authStore.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed } from 'vue'
// remove useRouter import!
// import { useRouter } from 'vue-router'
import router from '../router' // <-- import router instance directly

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/register`, {
        name, email, password
      })
      console.log('Registration response:', response.data.message)
      router.push('/verify-otp') // <-- use imported router
      return true
    } catch (error) {
      const msg = error?.response?.data?.message ?? 'Registration failed'
      console.error('Registration failed:', msg, error)
      alert('Registration failed: ' + msg)
      return false
    }
  }

  const verifyOTP = async (email, otp) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/verify-otp`, { email, otp })
      alert('Verification successful! You can now log in.')
      router.push('/login')
    } catch (error) {
      const msg = error?.response?.data?.message ?? 'OTP verification failed'
      console.error('OTP verification failed:', msg, error)
      alert('OTP verification failed: ' + msg)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/login`, { email, password })
      const { token: apiToken, user: apiUser } = response.data
      token.value = apiToken
      user.value = apiUser
      localStorage.setItem('token', apiToken)
      localStorage.setItem('user', JSON.stringify(apiUser))
      alert('Login successful!')
      router.push('/') // <-- use imported router
      return true
    } catch (error) {
      const msg = error?.response?.data?.message ?? 'Login error'
      console.error('Login failed:', msg, error)
      alert('Login failed: ' + msg)
      return false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    alert('Logged out successfully.')
    router.push('/login')
  }

  return {
    token,
    user,
    isAuthenticated,
    register,
    verifyOTP,
    login,
    logout
  }
})
