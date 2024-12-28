<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()

const snackBarShow = ref(false)
const snackBarStatus = ref('success')
const snackBarText = ref('')

const showSnackBar = (status: string, text: string) => {
  snackBarStatus.value = status
  snackBarText.value = text
  snackBarShow.value = true
}

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

// Edit Profile
const editProfileDialog = ref(false)

const username = ref('')
const password = ref('')

const editProfile = () => {
  fetch('/api/editprofile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error == '0') {
        editProfileDialog.value = false
        showSnackBar('success', t('save_success'))
      }
    })
    .catch((error) => {
      showSnackBar('error', error)
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
          <v-btn icon @click="editProfileDialog = true">
            <v-icon icon="$settings"></v-icon>
          </v-btn>
          <v-btn icon @click="router.push('/home')">
            <v-icon icon="$home"></v-icon>
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

    <v-dialog v-model="editProfileDialog" persistent max-width="400">
      <v-card>
        <v-card-title>{{ t('modify_personal_info') }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="username" :label="t('username')"></v-text-field>
          <v-text-field v-model="password" :label="t('password')" type="password"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="editProfileDialog = false">{{ t('cancel') }}</v-btn>
          <v-btn text @click="editProfile">{{ t('submit') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>

  <v-snackbar v-model="snackBarShow" timeout="2000" location="top" :color="snackBarStatus">
    {{ snackBarText }}
  </v-snackbar>
</template>

<style scoped></style>
