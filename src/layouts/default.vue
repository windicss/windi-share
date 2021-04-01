<script setup lang="ts">
import { ref } from 'vue'
</script>
<template>
  <main class="text-center py-10 px-4 text-gray-700 dark:text-gray-200">
    <Header />
    <router-view />
    <Footer />
  </main>
</template>
