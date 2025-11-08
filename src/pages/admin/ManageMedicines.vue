<script setup>
import { ref, onMounted } from 'vue'
import { useMedicineStore } from '../../stores/medicineStore'

// 1. স্টোর ইনস্ট্যান্স তৈরি করুন
const medicineStore = useMedicineStore()

// 2. নতুন মেডিসিন ফর্মের জন্য state
const form = ref({
  name: '',
  price: 0,
  stock: 0,
  description: ''
})
const imageFile = ref(null) // ছবি ফাইলটি ধরে রাখার জন্য

// 3. পেজ লোড হওয়ার সাথে সাথে মেডিসিনগুলো ফেচ করুন
onMounted(() => {
  medicineStore.fetchMedicines()
})

// 4. ফাইল ইনপুট পরিবর্তন হলে এই ফাংশনটি কল হবে
const handleFileChange = (event) => {
  imageFile.value = event.target.files[0]
}

// 5. ফর্ম সাবমিট হলে
const handleSubmit = async () => {
  if (!form.value.name || !imageFile.value) {
    alert('Please provide medicine name and image.')
    return
  }

  // একটি FormData অবজেক্ট তৈরি করুন (JSON নয়)
  // কারণ ব্যাকএন্ড 'multipart/form-data' আশা করছে
  const formData = new FormData()
  formData.append('name', form.value.name)
  formData.append('price', form.value.price)
  formData.append('stock', form.value.stock)
  formData.append('description', form.value.description)
  formData.append('image', imageFile.value) // ফাইলটি যোগ করুন

  // স্টোরকে বলুন মেডিসিন যোগ করতে
  await medicineStore.addMedicine(formData)

  // ফর্ম রিসেট করুন
  form.value = { name: '', price: 0, stock: 0, description: '' }
  imageFile.value = null
  document.getElementById('image-input').value = null // ফাইল ইনপুট রিসেট
}

// 6. ডিলিট বাটন ক্লিক হলে
const handleDelete = async (medicineId) => {
  if (confirm('Are you sure you want to delete this medicine?')) {
    await medicineStore.deleteMedicine(medicineId)
  }
}
</script>

<template>
  <div class="manage-medicines">
    <h2>Manage Medicines</h2>

    <form @submit.prevent="handleSubmit" class="medicine-form">
      <h3>Add New Medicine</h3>
      <div class="form-grid">
        <div class="form-group">
          <label>Name:</label>
          <input type="text" v-model="form.name" required>
        </div>
        <div class="form-group">
          <label>Price:</label>
          <input type="number" v-model.number="form.price" required>
        </div>
        <div class="form-group">
          <label>Stock:</label>
          <input type="number" v-model.number="form.stock" required>
        </div>
        <div class="form-group">
          <label>Image:</label>
          <input type="file" @change="handleFileChange" id="image-input" required>
        </div>
        <div class="form-group full-width">
          <label>Description:</label>
          <textarea v-model="form.description"></textarea>
        </div>
      </div>
      <button type="submit">Add Medicine</button>
    </form>

    <h3>Existing Medicines</h3>
    <div v-if="medicineStore.loading">Loading medicines...</div>
    <table v-else class="medicines-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="med in medicineStore.medicines" :key="med._id">
          <td>
            <img :src="'http://localhost:5000' + med.image" :alt="med.name" class="table-img">
          </td>
          <td>{{ med.name }}</td>
          <td>৳{{ med.price }}</td>
          <td>{{ med.stock }}</td>
          <td>
            <button @click="handleDelete(med._id)" class="btn-delete">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<style scoped>
/* ফর্ম স্টাইল */
.medicine-form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group.full-width {
  grid-column: 1 / -1; /* দুটি কলাম জুড়ে */
}
.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

/* ----------------------------------------------------------------- */
/* ✅ ফিক্স: width: 100% এবং padding সংক্রান্ত রুলগুলো এখান থেকে মুছে ফেলা হয়েছে */
/* ----------------------------------------------------------------- */
/* .form-group input, .form-group textarea { ... } */
/* ----------------------------------------------------------------- */

.medicine-form button {
  background-color: #28a745;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

/* টেবিল স্টাইল */
.medicines-table {
  width: 100%;
  border-collapse: collapse;
}
.medicines-table th,
.medicines-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}
.medicines-table th {
  background-color: #f4f4f4;
}
.table-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}
.btn-delete {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}
</style>