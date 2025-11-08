// medicineStore.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import { useAuthStore } from './authStore'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const useMedicineStore = defineStore('medicine', () => {
  const medicines = ref([])
  const loading = ref(false)

  const getAuthHeaders = () => {
    const authStore = useAuthStore()
    return {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    }
  }

  const fetchMedicines = async () => {
    loading.value = true
    try {
      const response = await axios.get(`${API_BASE}/api/medicines`)
      medicines.value = response.data.medicines ?? []
    } catch (error) {
      const msg = error?.response?.data?.message ?? 'Failed to fetch medicines'
      console.error('Failed to fetch medicines:', msg, error)
    } finally {
      loading.value = false
    }
  }

  const addMedicine = async (formData) => {
    try {
      await axios.post(
        `${API_BASE}/api/medicines`,
        formData,
        getAuthHeaders()
      )
      alert('Medicine added successfully!')
      await fetchMedicines()
    } catch (error) {
      const msg = error?.response?.data?.message ?? 'Failed to add medicine'
      console.error('Failed to add medicine:', msg, error)
      alert('Failed to add medicine: ' + msg)
    }
  }

  const deleteMedicine = async (medicineId) => {
    try {
      await axios.delete(
        `${API_BASE}/api/medicines/${medicineId}`,
        getAuthHeaders()
      )
      alert('Medicine deleted successfully.')
      await fetchMedicines()
    } catch (error) {
      const msg = error?.response?.data?.message ?? 'Failed to delete medicine'
      console.error('Failed to delete medicine:', msg, error)
      alert('Failed to delete medicine: ' + msg)
    }
  }

  return {
    medicines,
    loading,
    fetchMedicines,
    addMedicine,
    deleteMedicine
  }
})
