<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

// Logout
const logout = () => {
  fetch('/api/logout')
    .then((res) => res.json())
    .then((data) => {
      if (data.error == '0') {
        router.push('/')
      }
    })
}

onMounted(() => {
  // Check Cookie
  fetch('/api/check')
    .then((res) => res.json())
    .then((data) => {
      if (data.error != '0') {
        router.push(data.path)
      }
    })
})
</script>

<template>
  <v-app :theme="theme">
    <v-layout class="rounded rounded-md">
      <v-app-bar title="ZTVRUI">
        <template v-slot:append>
          <v-btn icon @click="theme = theme === 'light' ? 'dark' : 'light'">
            <v-icon icon="$theme"></v-icon>
          </v-btn>
          <v-btn icon @click="logout">
            <v-icon icon="$settings"></v-icon>
          </v-btn>
          <v-btn icon @click="logout">
            <v-icon icon="$logout"></v-icon>
          </v-btn>
        </template>
      </v-app-bar>

      <!-- <v-navigation-drawer permanent>
        <v-list nav>
          <v-list-item :title="$t('networks')" @click="changeComponent('networks')" :active="active === 'networks'"
            append-icon="$network"></v-list-item>
          <v-list-item :title="$t('user_manage')" @click="changeComponent('user_manage')"
            :active="active === 'user_manage'" append-icon="$account">
          </v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="pa-2">
            <v-btn block @click="logout" variant="outlined">
              {{ $t('logout') }}
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer> -->

      <v-main class="d-flex" scrollable>
        <RouterView />
      </v-main>
    </v-layout>
  </v-app>
</template>

<style scoped></style>
