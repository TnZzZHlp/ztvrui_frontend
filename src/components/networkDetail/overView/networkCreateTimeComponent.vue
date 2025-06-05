<script setup lang="ts">
import { useRouter } from 'vue-router'
import { networkOverviewData } from '../networkDetailStorage'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const networkData = computed(() => {
  return networkOverviewData.value.find(
    (data) => data.id === (router.currentRoute.value.params.networkId as string),
  )
})
</script>

<template>
  <!-- Network Creation Time -->
  <div class="p-4 shadow bg-white rounded-2lg">
    <p class="text-gray-500">{{ t('network.creationTime') }}</p>
    <h1 class="text-3xl font-bold">
      {{ new Date(networkData?.creationTime as number).toLocaleString() }}
    </h1>
  </div>
</template>
