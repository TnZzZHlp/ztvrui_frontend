<script setup lang="ts">
import { useRouter } from 'vue-router'
import { networkOverviewData } from '../networkDetailStorage'
import { computed } from 'vue'

const router = useRouter()
const networkData = computed(() => {
  return networkOverviewData.value.find(
    (data) => data.id === (router.currentRoute.value.params.networkId as string),
  )
})
</script>

<template>
  <!-- Network DNS -->
  <div class="p-4 shadow bg-white rounded-2lg">
    <p class="text-gray-500">DNS</p>
    <h1 class="text-xl font-bold">{{ networkData?.dns?.domain }}</h1>
    <ol>
      <li v-for="(server, index) in networkData?.dns?.servers" :key="index">{{ server }}</li>
    </ol>
  </div>
</template>
