// adminStore.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import { useAuthStore } from './authStore'

export const useAdminStore = defineStore('admin', () => {
  const orders = ref([])
  const loading = ref(false)
  const authStore = useAuthStore()

  const getAuthHeaders = () => {
    return {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    }
  }

  const fetchOrders = async () => {
    loading.value = true
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/orders`, getAuthHeaders())
      const fetched = response.data?.orders ?? []
      // sort newest first safely
      orders.value = fetched.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } catch (error) {
      const msg = error?.response?.data?.message ?? 'Failed to fetch admin orders'
      console.error('Failed to fetch orders:', msg, error)
      alert(msg)
    } finally {
      loading.value = false
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/orders/${orderId}`,
        { status: newStatus },
        getAuthHeaders()
      )
      const updated = response.data?.order
      const index = orders.value.findIndex(o => o._id === orderId)
      if (index !== -1 && updated) {
        orders.value[index] = updated
      } else if (updated) {
        // if it wasn't in the list, push it
        orders.value.unshift(updated)
      }
      alert('Order status updated!')
    } catch (error) {
      const msg = error?.response?.data?.message ?? 'Failed to update status'
      console.error('Failed to update status:', msg, error)
      alert(msg)
    }
  }

  return {
    orders,
    loading,
    fetchOrders,
    updateOrderStatus
  }
})
