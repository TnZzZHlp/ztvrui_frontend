import { createApp } from 'vue'
import popupPanel from '../components/popupPanel.vue'
import i18n from '@/i18n'

export function showPopupPanel(
  onClick: () => void,
  message: string,
  type: 'normal' | 'warn' = 'normal',
) {
  const container = document.createElement('div')
  const app = createApp(popupPanel, { onClick, message, type, container })
  document.body.appendChild(container)
  app.use(i18n)
  app.mount(container)
}
