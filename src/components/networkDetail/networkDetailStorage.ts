import { getNetworkByID } from '@/api/zerotier/controller'
import type { ControllerNetworkInfo } from '@/types/zerotier/controller'
import { showSnackBar } from '@/utils/showSnackBar'
import { ref, type Ref } from 'vue'
import { eventBus } from '@/utils/eventBus'
import i18n from '@/i18n'

export const networkOverviewData: Ref<ControllerNetworkInfo[]> = ref([])

// Listen controller network info update requests
eventBus.addEventListener('controllerNetworkInfoUpdate', (e) => {
  const networkId = e as CustomEvent<string>
  getNetworkOverviewData(networkId.detail)
})

export const getNetworkOverviewData = (networkId: string) => {
  getNetworkByID(networkId)
    .then((data) => {
      const index = networkOverviewData.value.findIndex((network) => network.id === data.id)
      if (index !== -1) {
        // Update existing network data
        networkOverviewData.value[index] = data
      } else {
        // Add new network data
        networkOverviewData.value.push(data)
      }
    })
    .catch((error) => {
      showSnackBar(i18n.global.t('failGet') + error, 'error')
    })
}
