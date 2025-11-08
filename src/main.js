import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// 1. Pinia import করুন
import { createPinia } from 'pinia'

const app = createApp(App)

// 2. Pinia ইনস্ট্যান্স তৈরি করুন
const pinia = createPinia()

// 3. Vue-কে Pinia এবং router ব্যবহার করতে বলুন
app.use(pinia)
app.use(router)

app.mount('#app')