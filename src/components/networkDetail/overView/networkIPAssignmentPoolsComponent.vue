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
  <!-- Network IP AssignmentPools -->
  <div class="p-4 shadow bg-white rounded-2lg lg:col-span-2">
    <p class="text-gray-500">{{ t('network.ipAssignmentPools.default') }}</p>
    <ol class="divide-y divide-gray-200">
      <li class="text-gray-700">
        <div class="flex justify-between">
          <p class="text-sm text-gray-500 w-full">
            {{ t('network.ipAssignmentPools.ipRangeStart') }}
          </p>
          <p class="text-sm text-gray-500 w-full">
            {{ t('network.ipAssignmentPools.ipRangeEnd') }}
          </p>
        </div>
      </li>
      <li class="text-gray-700" v-for="(ip, index) in networkData?.ipAssignmentPools" :key="index">
        <div class="flex justify-between">
          <p class="w-full">
            {{ ip.ipRangeStart }}
          </p>
          <p class="w-full">
            {{ ip.ipRangeEnd }}
          </p>
        </div>
      </li>
    </ol>
  </div>
</template>
