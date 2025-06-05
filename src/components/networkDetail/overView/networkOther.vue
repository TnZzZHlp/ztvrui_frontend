<script setup lang="ts">
import { useRouter } from 'vue-router'
import { networksData } from '../networkDetailStorage'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { createOrUpdateNetwork } from '@/api/zerotier/controller'
import type { ControllerNetworkInfo } from '@/types/zerotier/controller'
import { showSnackBar } from '@/utils/showSnackBar'

const router = useRouter()
const { t } = useI18n()

const networkData = computed(() => {
  return networksData.value.find(
    (data) => data.id === (router.currentRoute.value.params.networkId as string),
  )
})

const changeEnableBroadcast = (e: Event) => {
  const data = networkData.value
  if (!data) return

  const checked = (e.target as HTMLInputElement).checked

  const payload: ControllerNetworkInfo = {
    ...data,
    enableBroadcast: checked,
  }

  createOrUpdateNetwork(data.id as string, payload)
    .then(() => {
      showSnackBar(t('common.updateSuccess'), 'success')
    })
    .catch((err) => {
      showSnackBar(t('common.updateFailed') + err, 'error')
    })
}
</script>

<template>
  <!-- Network MTU MulticastLimit enableBroadcast -->
  <div class="p-4 shadow bg-white rounded-2lg">
    <p class="text-gray-500">MTU</p>
    <h1 class="text-3xl font-bold">{{ networkData?.mtu }}</h1>

    <p class="text-gray-500 mt-2">{{ t('network.multicastLimit') }}</p>
    <p class="text-ms font-bold">{{ networkData?.multicastLimit }}</p>

    <p class="text-gray-500 mt-2">{{ t('network.enableBroadcast') }}</p>
    <input
      type="checkbox"
      @change="changeEnableBroadcast"
      :checked="networkData?.enableBroadcast"
    />
  </div>
</template>
