<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const network_id = ref(useRoute().params.id)

</script>

<template>
  <div> {{ network_id }}</div>
</template>

<style></style>
