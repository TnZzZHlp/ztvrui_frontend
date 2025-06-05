<script setup lang="ts">
import { useRouter } from 'vue-router'
import { networkOverviewData } from '../networkDetailStorage'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { createOrUpdateNetwork } from '@/api/zerotier/controller'
import type { ControllerNetworkInfo, V6AssignMode } from '@/types/zerotier/controller'
import { showSnackBar } from '@/utils/showSnackBar'

const router = useRouter()
const { t } = useI18n()

const networkData = computed(() => {
  return networkOverviewData.value.find(
    (data) => data.id === (router.currentRoute.value.params.networkId as string),
  )
})

const changeIPv6Assignment = (e: Event, type: string) => {
  const data = networkData.value
  if (!data) return

  const checked = (e.target as HTMLInputElement).checked

  const V6AssignMode: V6AssignMode = data.v6AssignMode

  const payload: ControllerNetworkInfo = {
    ...data,
    v6AssignMode: {
      ...V6AssignMode,
      [type]: checked,
    },
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
  <!-- Network IPv6 Assignment -->
  <div class="p-4 shadow bg-white rounded-2lg">
    <p class="text-gray-500">{{ t('network.ipv6Assignment.default') }}</p>
    <div
      class="flex items-center justify-between"
      v-for="(value, item) in networkData?.v6AssignMode"
      :key="item"
    >
      <span class="text-xl font-bold">
        {{ t(`network.ipv6Assignment.${item}`) }}
      </span>
      <input type="checkbox" @change="(e) => changeIPv6Assignment(e, item)" :checked="value" />
    </div>
  </div>
</template>
