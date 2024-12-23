<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

// Get system theme
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
const theme = ref(systemTheme)

// Change Component
const changeComponent = (component: string) => {
  router.push({ name: component })
  active.value = component
}

const active = ref('')

</script>

<template>
  <v-app :theme="theme">
    <v-layout class="rounded rounded-md">
      <v-app-bar title="ZTVRUI"></v-app-bar>

      <v-navigation-drawer permanent>
        <v-list nav>
          <v-list-item :title="$t('networks')" @click="changeComponent('networks')"
            :active="active === 'networks'"></v-list-item>
          <v-list-item :title="$t('user_manage')" @click="changeComponent('user_manage')"
            :active="active === 'user_manage'"></v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="pa-2">
            <v-btn block>
              {{ $t('logout') }}
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <v-main class="d-flex align-center justify-center">
        <RouterView />
      </v-main>
    </v-layout>
  </v-app>
</template>
