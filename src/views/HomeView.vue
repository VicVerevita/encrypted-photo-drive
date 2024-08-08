<template>
  <div>
    <h1>Welcome to the Photo App</h1>
    <p>Please login or register to continue.</p>
    <router-link to="/login">Login</router-link>
    <router-link to="/register">Register</router-link>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
</style>
