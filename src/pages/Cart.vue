<script setup>
import { computed } from 'vue' // 1. onMounted-এর আর দরকার নেই
import { useCartStore } from '../stores/cartStore'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter() 

// 2. onMounted() কলটি বাদ দেওয়া হয়েছে। App.vue এটি হ্যান্ডেল করছে।
// onMounted(() => { /* ... */ }) 

// 3. COMPUTED এবং HANDLER ফাংশনগুলো ঠিক করা হয়েছে
const validCartItems = computed(() => {
  if (!cartStore.items) {
    return []
  }
  // 'null' medicineId সহ আইটেমগুলো ফিল্টার করা
  return cartStore.items.filter(item => item.medicineId != null)
})

const handleRemove = (orderId) => {
  if (confirm('Are you sure you want to remove this item?')) {
    cartStore.removeFromCart(orderId)
  }
}

const totalPrice = computed(() => {
  return validCartItems.value.reduce((total, item) => {
    // validCartItems ব্যবহার করায় item.medicineId.price সবসময় সেফ
    return total + (item.medicineId.price * item.quantity)
  }, 0)
})

// COD Checkout হ্যান্ডলার
const handleCheckout = async () => {
  if (confirm('Confirm your Cash on Delivery (COD) order?')) {
    const success = await cartStore.checkout()
    if (success) {
      router.push('/my-orders')
    }
  }
}

// অনলাইন পেমেন্ট বাটন হ্যান্ডলার
const handleOnlinePayment = () => {
  cartStore.startOnlinePayment()
}
</script>

<template>
  <div>
    <h2>Your Cart</h2>
    <div v-if="cartStore.loading">Loading your cart...</div>
    <div v-else-if="!validCartItems || validCartItems.length === 0">
      Your cart is empty.
    </div>
    
    <div v-else class="cart-container">
      <div class="cart-items">
        <div v-for="item in validCartItems" :key="item._id" class="cart-item">
          
          <template v-if="item.medicineId">
            <img :src="'http://localhost:5000' + item.medicineId.image" :alt="item.medicineId.name" class="cart-item-image">
            <div class="item-details">
              <h3>{{ item.medicineId.name }}</h3>
              <p>Price: ৳{{ item.medicineId.price }}</p>
              <p>Quantity: {{ item.quantity }}</p>
            </div>
          </template>
          
          <template v-else>
            <div class="broken-item-details">
              <h3>Broken Item</h3>
              <p>This medicine is no longer available.</p>
            </div>
          </template>

          <button @click="handleRemove(item._id)" class="remove-btn">
            Remove
          </button>
        </div>
      </div>
      
      <div class="cart-summary">
        <h3>Total Price: ৳{{ totalPrice.toFixed(2) }}</h3>
        
        <button @click="handleCheckout" class="checkout-btn cod">
          Proceed to Checkout (COD)
        </button>
        
        <button @click="handleOnlinePayment" class="checkout-btn online">
          Pay Online with Razorpay
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ... (আগের স্টাইলগুলো) ... */
.checkout-btn {
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-size: 1.1rem;
  margin-bottom: 10px; /* বাটনগুলোর মধ্যে স্পেস */
}
.cod {
  background-color: #ffc107; /* হলুদ */
  color: #333;
}
.online {
  background-color: #007bff; /* নীল */
}

/* 6. কার্ট আইটেমের জন্য স্টাইলগুলো যোগ করা হয়েছে */
.cart-container {
  display: flex;
  gap: 20px;
}
.cart-items {
  flex: 3;
}
.cart-summary {
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  height: fit-content;
}
.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
}
.cart-item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
}
.item-details {
  flex-grow: 1;
}
.remove-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}
.broken-item-details {
  flex-grow: 1;
  color: #dc3545;
  font-style: italic;
}
</style>