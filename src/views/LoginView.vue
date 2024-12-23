<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

// Get system theme
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
const theme = ref(systemTheme)


// Login
const username = ref('')
const password = ref('')
const errMsg = ref('')
const showErrMsg = ref(false)

// Listen Enter
document.onkeydown = function (event) {
  if (event.key === 'Enter') {
    login()
  }
};

const login = () => {
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error === '0') {
        router.push('/home')
      } else {
        errMsg.value = data.error
        showErrMsg.value = true
      }
    })
    .catch(err => {
      errMsg.value = 'Unknown error:' + err
      showErrMsg.value = true
    })
}
</script>

<template>
  <v-app :theme="theme">
    <div class="page-wrapper">

      <header>
        <v-img class="mx-auto my-6" max-width="64" src="/ZeroTierIcon.png"></v-img>
      </header>

      <main>
        <section>
          <v-text-field :label="$t('username')" variant="outlined" v-model="username"></v-text-field>
          <v-text-field :label="$t('password')" variant="outlined" v-model="password" type="password"></v-text-field>

          <v-btn @click="login()" variant="tonal">{{ $t('login') }}</v-btn>
          <v-snackbar v-model="showErrMsg" timeout="5000" color="error">
            {{ errMsg }}
          </v-snackbar>
        </section>
      </main>

      <footer>
        <div>
          <a href="https://github.com/tnzzzhlp/ztvrui">Powered by ztvrui</a>
        </div>
      </footer>

    </div>
  </v-app>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-self: space-between;
}

header {
  width: 100%;
  height: 128px;
  display: flex;
  justify-content: center;
  align-items: end;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 400px;
  padding: 50px;
}

footer {
  display: flex;
  width: 100%;
  height: 128px;
  justify-content: center;
  align-items: start;
}

a {
  color: #10a37f;
  text-decoration: none;
}
</style>
