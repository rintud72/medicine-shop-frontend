<script setup>
// AdminLayout কম্পোনেন্টটি একটি সাইডবার এবং একটি কন্টেন্ট এরিয়া দেখাবে
// এটি <router-view> ব্যবহার করে এর "চাইল্ড" রুটগুলো (Dashboard, Medicines, Orders) রেন্ডার করবে
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <h3>Admin Menu</h3>
      <nav>
        <router-link to="/admin/dashboard">Dashboard</router-link>
        <router-link to="/admin/medicines">Manage Medicines</router-link>
        <router-link to="/admin/orders">Manage Orders</router-link>
      </nav>
    </aside>
    <main class="admin-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
}
.admin-sidebar {
  width: 250px;
  background-color: #f4f4f4;
  padding: 20px;
  min-height: 80vh;
  border-right: 1px solid #ddd;
}
.admin-sidebar h3 {
  margin-top: 0;
}
.admin-sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.admin-sidebar nav a {
  text-decoration: none;
  color: #333;
  padding: 10px 15px;
  border-radius: 5px;
}
.admin-sidebar nav a:hover,
.admin-sidebar nav a.router-link-active {
  background-color: #42b983;
  color: white;
}
.admin-content {
  flex: 1;
  padding: 20px;
}
</style>