<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const orders = ref([])
const loading = ref(true)
const authStore = useAuthStore()

// পেজ লোড হলে এই ফাংশনটি রান হবে
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    loading.value = false
    return
  }

  try {
    // টোকেন সহ হেডার তৈরি
    const headers = {
      'Authorization': `Bearer ${authStore.token}`
    }
    
    // API কল [API: GET /api/orders/my-history]
    const response = await axios.get('http://localhost:5000/api/orders/my-history', { headers })
    
    orders.value = response.data.orders

  } catch (error) {
    console.error("Failed to fetch order history:", error)
  }
  
  loading.value = false
})

</script>

<template>
  <div>
    <h2>Your Order History</h2>
    
    <div v-if="loading">Loading your orders...</div>
    
    <div v-else-if="!authStore.isAuthenticated">
      Please log in to see your order history.
    </div>

    <div v-else-if="orders.length === 0">
      You have no orders yet.
    </div>

    <div v-else class="order-list">
      <div v-for="order in orders" :key="order._id" class="order-card">
        <div class="order-header">
          <h3>{{ order.medicineId ? order.medicineId.name : 'Medicine Deleted' }}</h3>
          <span :class="['status', order.status.toLowerCase()]">{{ order.status }}</span>
        </div>
        
        <div class="order-body" v-if="order.medicineId">
          <img :src="'http://localhost:5000' + order.medicineId.image" :alt="order.medicineId.name" class="order-image">
          <div class="order-details">
            <p><strong>Price per unit:</strong> ৳{{ order.priceAtOrder.toFixed(2) }}</p>
            <p><strong>Quantity:</strong> {{ order.quantity }}</p>
            <p><strong>Total Paid:</strong> ৳{{ (order.priceAtOrder * order.quantity).toFixed(2) }}</p>
            <p><strong>Ordered on:</strong> {{ new Date(order.createdAt).toLocaleDateString() }}</p>
          </div>
        </div>
        <div class="order-body" v-else>
          <p>Details for this medicine are no longer available.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.order-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}
.order-header h3 {
  margin: 0;
}
.status {
  padding: 5px 10px;
  border-radius: 15px;
  font-weight: bold;
  text-transform: uppercase;
}
.status.cod { background-color: #ffc107; color: #333; }
.status.paid { background-color: #28a745; color: white; }
.status.failed { background-color: #dc3545; color: white; }

.order-body {
  display: flex;
  padding: 20px;
  gap: 20px;
}
.order-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}
.order-details p {
  margin: 5px 0;
}
</style>