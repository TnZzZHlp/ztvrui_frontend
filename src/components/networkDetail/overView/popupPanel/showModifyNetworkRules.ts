import { createApp } from 'vue'
import modifyNetworkRulesPanel from '@/components/networkDetail/overView/popupPanel/modifyNetworkRulesPanel.vue'
import i18n from '@/i18n'
export function showModifyNetworkRules(networkId: string) {
  const container = document.createElement('div')
  const app = createApp(modifyNetworkRulesPanel, { container, networkId })
  document.body.appendChild(container)
  app.use(i18n)
  app.mount(container)
}
