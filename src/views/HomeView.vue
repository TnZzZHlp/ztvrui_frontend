<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
  <v-app theme="dark">
    <v-layout class="rounded rounded-md">
      <v-app-bar title="ZTVRUI">
        <template v-slot:append>
          <v-btn icon @click="logout">
            <v-icon icon="$settings"></v-icon>
          </v-btn>
          <v-btn icon @click="logout">
            <v-icon icon="$logout"></v-icon>
          </v-btn>
        </template>
      </v-app-bar>

      <v-main class="d-flex" scrollable>
        <RouterView />
      </v-main>
    </v-layout>
  </v-app>
</template>

<style scoped></style>
