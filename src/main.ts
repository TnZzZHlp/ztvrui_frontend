import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

// Vuetify
import 'vuetify/styles'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure your project is capable of handling css files
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, md } from 'vuetify/iconsets/md'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'md',
    aliases,
    sets: {
      md,
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
