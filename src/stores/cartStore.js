// cartStore.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import { useAuthStore } from './authStore'
import router from '../router' // use router instance for stability

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const loading = ref(false)

  const getAuthHeaders = () => {
    const authStore = useAuthStore()
    return {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    }
  }

  const fetchCart = async () => {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) return
    loading.value = true
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart`, getAuthHeaders())
      items.value = response.data.cart?.items ?? []
    } catch (error) {
      console.error('Failed to fetch cart:', error)
      items.value = []
    } finally {
      loading.value = false
    }
  }

  const addToCart = async (medicineId, quantity = 1) => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      alert('Please log in to add items to your cart.')
      return
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart/add`,
        { medicineId, quantity },
        getAuthHeaders()
      )
      alert('Item added to cart!')
      await fetchCart()
    } catch (error) {
      const msg = error?.response?.data?.message ?? 'Server error'
      console.error('Failed to add to cart:', msg, error)
      alert('Failed to add item: ' + msg)
    }
  }

  const removeFromCart = async (orderId) => {
    if (!useAuthStore().isAuthenticated) return
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart/remove-item/${orderId}`,
        getAuthHeaders()
      )
      alert('Item removed successfully.')
      await fetchCart()
    } catch (error) {
      const msg = error?.response?.data?.message ?? 'Remove failed'
      console.error('Failed to remove from cart:', msg, error)
      alert('Failed to remove item: ' + msg)
    }
  }

  const checkout = async () => {
    if (!useAuthStore().isAuthenticated) return false
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart/checkout`, {}, getAuthHeaders()
      )
      alert('Order placed successfully! (COD)')
      items.value = []
      router.push('/my-orders')
      return true
    } catch (error) {
      const msg = error?.response?.data?.message ?? 'Checkout failed'
      console.error('Checkout failed:', msg, error)
      alert('Checkout failed: ' + msg)
      return false
    }
  }

  const startOnlinePayment = async () => {
    if (!useAuthStore().isAuthenticated) return
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/create-order`,
        {},
        getAuthHeaders()
      )

      if (!window.Razorpay) {
        alert('Payment gateway not loaded. Please try again later.')
        return
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Medicine Shop",
        description: "Payment for your medicine order",
        order_id: data.orderId,
        handler: async function (response) {
          await verifyPaymentOnServer(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          )
        },
        prefill: {
          name: data.userName,
          email: data.userEmail
        },
        theme: {
          color: "#3399cc"
        }
      };
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      const msg = error?.response?.data?.message ?? 'Server error'
      console.error('Online payment initiation failed:', msg, error)
      alert('Payment failed: ' + msg)
    }
  }

  const verifyPaymentOnServer = async (orderId, paymentId, signature) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/verify-payment`,
        {
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature
        },
        getAuthHeaders()
      )
      alert('Payment successful! Your order is confirmed.')
      items.value = []
      router.push('/my-orders')
    } catch (error) {
      const msg = error?.response?.data?.message ?? 'Payment verification failed'
      console.error('Payment verification failed:', msg, error)
      alert('Payment verification failed. Your order status is "Failed".')
      router.push('/my-orders')
    }
  }

  return {
    items,
    loading,
    fetchCart,
    addToCart,
    removeFromCart,
    checkout,
    startOnlinePayment
  }
})
