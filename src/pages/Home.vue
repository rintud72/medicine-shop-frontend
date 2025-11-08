<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
// 1. cartStore ইমপোর্ট করুন (এটি সম্ভবত মিসিং ছিল)
import { useCartStore } from '../stores/cartStore'

const medicines = ref([])
const loading = ref(true)
const searchQuery = ref("")

// 2. cartStore ইনস্ট্যান্স তৈরি করুন
const cartStore = useCartStore()

const fetchMedicines = async () => {
  loading.value = true
  try {
    const response = await axios.get(`http://localhost:5000/api/medicines?search=${searchQuery.value}`)
    medicines.value = response.data.medicines
  } catch (error) {
    console.error("Error fetching medicines:", error)
  }
  loading.value = false
}

onMounted(fetchMedicines)

// 3. "Add to Cart" বাটনের ফাংশন
const handleAddToCart = (medicineId) => {
  console.log('Adding medicine:', medicineId) // 👈 আপনার কনসোলের লগটি এখান থেকে আসছে
  
  // -----------------------------------------------------------------
  // ✅ ফিক্স: এই লাইনটি আপনার ফাইলে মিসিং আছে
  // -----------------------------------------------------------------
  cartStore.addToCart(medicineId, 1) // 1 মানে ১টি আইটেম
}

</script>

<template>
  <div>
    <h2>Our Medicines</h2>
    
    <input 
      type="text" 
      v-model="searchQuery" 
      placeholder="Search for medicines..." 
      @input="fetchMedicines"
      class="search-bar"
    >

    <div v-if="loading">Loading medicines...</div>
    
    <div v-else class="medicine-grid">
      <div v-for="medicine in medicines" :key="medicine._id" class="medicine-card">
        <img :src="'http://localhost:5000' + medicine.image" :alt="medicine.name" class="medicine-image">
        <h3>{{ medicine.name }}</h3>
        <p>Price: ৳{{ medicine.price }}</p>
        <p>Stock: {{ medicine.stock }}</p>
        
        <button @click="handleAddToCart(medicine._id)" class="add-to-cart-btn">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ... (আপনার স্টাইলগুলো আগের মতোই থাকবে) ... */
.search-bar { width: 100%; padding: 10px; margin-bottom: 20px; font-size: 1rem; border-radius: 8px; border: 1px solid #ddd; }
.medicine-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
.medicine-card { background-color: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.medicine-image { width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 10px; }
.add-to-cart-btn { background-color: #007bff; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; }
.add-to-cart-btn:hover { background-color: #0056b3; }
</style>