import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import {
  mdiNetworkOutline,
  mdiContentCopy,
  mdiAccountCircleOutline,
  mdiDeleteOutline,
  mdiPencilOutline,
  mdiMagnify,
  mdiContentSaveOutline,
  mdiReload,
  mdiLogout,
  mdiThemeLightDark,
  mdiCog,
} from '@mdi/js'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      network: mdiNetworkOutline,
      copy: mdiContentCopy,
      account: mdiAccountCircleOutline,
      delete: mdiDeleteOutline,
      edit: mdiPencilOutline,
      search: mdiMagnify,
      save: mdiContentSaveOutline,
      reload: mdiReload,
      logout: mdiLogout,
      theme: mdiThemeLightDark,
      settings: mdiCog,
    },
    sets: {
      mdi,
    },
  },
})

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(vuetify)

app.mount('#app')
