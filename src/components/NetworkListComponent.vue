<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onBeforeMount, ref, type Ref } from 'vue'
import { deleteNetwork, getNetworkByID, listNetworkIDs } from '@/api/zerotier/controller'
import type { ControllerNetworkInfo } from '@/types/zerotier/controller'
import { showSnackBar } from '@/utils/showSnackBar'
import { showPopupPanel } from '@/utils/showPopupPanel'
const { t } = useI18n()

const networks: Ref<ControllerNetworkInfo[]> = ref([])

const handleDeleteNetwork = (networkId: string) => {
  showPopupPanel(
    () => {
      // Call the API to delete the network
      deleteNetwork(networkId)
        .then(() => {
          showSnackBar(t('network_deleted_successfully'), 'success')
          // Refresh the list of networks
          refreshNetworks()
        })
        .catch((error) => {
          showSnackBar(t('network_deletion_failed') + error, 'error')
        })
    },
    t('delete_network_tip'),
    'warn',
  )
}

const refreshNetworks = () => {
  listNetworkIDs()
    .then((data) => {
      networks.value = []
      data.forEach((networkId) => {
        getNetworkByID(networkId)
          .then((networkInfo) => {
            networks.value.push(networkInfo)
          })
          .catch((error) => {
            showSnackBar('Error fetching network info:', error)
          })
      })
    })
    .catch((error) => {
      showSnackBar(error, 'error')
    })
}

onBeforeMount(() => {
  refreshNetworks()
})
</script>

<template>
  <div
    class="shadow w-full rounded min-h-[150px] p-4 flex flex-col justify-between"
    v-for="network in networks"
    :key="network.id"
  >
    <span class="font-bold text-xl">{{ network.name }}</span>

    <div class="flex items-center justify-end">
      <button
        class="mx-2 px-4 py-2 shadow-sm/20 rounded bg-red-500 text-white hover:bg-red-600 transition-all active:bg-red-700 font-bold"
        type="button"
        @click="handleDeleteNetwork(network.id)"
      >
        {{ t('delete_network') }}
      </button>
      <button
        class="mx-2 px-4 py-2 shadow-sm/20 rounded hover:bg-gray-200 transition-all active:bg-gray-300 font-bold"
        type="button"
      >
        {{ t('enter_network') }}
      </button>
    </div>
  </div>
</template>
