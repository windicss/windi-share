<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <h1>{{ props.id }}</h1>
</template>