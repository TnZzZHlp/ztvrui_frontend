<script setup lang="ts">
import { useRouter } from 'vue-router'
import { networksData } from '../networkDetailStorage'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const networkData = computed(() => {
  return networksData.value.find(
    (data) => data.id === (router.currentRoute.value.params.networkId as string),
  )
})
</script>

<template>
  <!-- Network Routes -->
  <div class="p-4 shadow bg-white rounded-2lg lg:col-span-2">
    <p class="text-gray-500">{{ t('network.routes') }}</p>
    <ol class="divide-y divide-gray-200">
      <li class="text-gray-700">
        <div class="flex justify-between">
          <p class="text-sm text-gray-500 w-full">
            {{ t('network.default') }}
          </p>
          <p class="text-sm text-gray-500 w-full">
            {{ t('network.via') }}
          </p>
        </div>
      </li>
      <li class="text-gray-700" v-for="(route, index) in networkData?.routes" :key="index">
        <div class="flex justify-between">
          <p class="w-full">
            {{ route.target }}
          </p>
          <p class="w-full">
            {{ route.via }}
          </p>
        </div>
      </li>
    </ol>
  </div>
</template>
