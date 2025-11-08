<script setup>
import { onMounted } from 'vue'
import { useAdminStore } from '../../stores/adminStore' // নতুন স্টোর ইমপোর্ট করুন

const adminStore = useAdminStore()

// পেজ লোড হওয়ার সাথে সাথে সব অর্ডার ফেচ করুন
onMounted(() => {
  adminStore.fetchOrders()
})

// অ্যাডমিন যখন ড্রপডাউন থেকে স্ট্যাটাস পরিবর্তন করবে
const handleStatusChange = (order, event) => {
  const newStatus = event.target.value
  
  if (confirm(`Are you sure you want to change order ${order._id} status to ${newStatus}?`)) {
    // স্টোরকে বলুন স্ট্যাটাস আপডেট করতে
    adminStore.updateOrderStatus(order._id, newStatus)
  } else {
    // যদি ক্যানসেল করে, ড্রপডাউনটি পুরনো ভ্যালুতে রিসেট করুন
    event.target.value = order.status
  }
}

// তারিখ ফরম্যাট করার জন্য একটি হেল্পার ফাংশন
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-IN', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}
</script>

<template>
  <div>
    <h2>Manage All Orders</h2>
    
    <div v-if="adminStore.loading">Loading all orders...</div>
    
    <table v-else class="orders-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Customer</th>
          <th>Medicine</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in adminStore.orders" :key="order._id">
          <td>{{ formatDate(order.createdAt) }}</td>
          <td>
            <div v-if="order.userId">
              <strong>{{ order.userId.name }}</strong><br>
              {{ order.userId.email }}
            </div>
            <div v-else>User Not Found</div>
          </td>
          <td>
            <div v-if="order.medicineId">
              {{ order.medicineId.name }}
            </div>
            <div v-else>Medicine Deleted</div>
          </td>
          <td>{{ order.quantity }}</td>
          <td>
            ৳{{ (order.priceAtOrder * order.quantity).toFixed(2) }}
          </td>
          <td>
            <select 
              :value="order.status" 
              @change="handleStatusChange(order, $event)" 
              :class="['status-select', order.status.toLowerCase()]"
            >
              <option value="Pending">Pending</option>
              <option value="COD">COD</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<style scoped>
.orders-table {
  width: 100%;
  border-collapse: collapse;
}
.orders-table th,
.orders-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  vertical-align: top;
  font-size: 0.9rem;
}
.orders-table th {
  background-color: #f4f4f4;
}

.status-select {
  padding: 5px 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-weight: bold;
  cursor: pointer;
}
/* স্ট্যাটাস অনুযায়ী রঙ */
.status-select.cod { background-color: #ffc107; }
.status-select.paid { background-color: #28a745; color: white; }
.status-select.failed { background-color: #dc3545; color: white; }
.status-select.pending { background-color: #f0f0f0; }
</style>