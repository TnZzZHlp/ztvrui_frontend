import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import {
  mdiNetworkOutline,
  mdiContentCopy,
  mdiAccountCircleOutline,
  mdiDeleteOutline,
  mdiPencilOutline,
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
    },
    sets: {
      mdi,
    },
  },
  components,
  directives,
})

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(vuetify)

app.mount('#app')
