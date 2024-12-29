<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import router from '@/router'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const snackBarShow = ref(false)
const snackBarStatus = ref('success')
const snackBarText = ref('')

const showSnackBar = (status: string, text: string) => {
  snackBarStatus.value = status
  snackBarText.value = text
  snackBarShow.value = true
}

// Get networks
interface Network {
  id: string
  name: string
}

const networks = ref<Network[]>([])

const getNetworks = () => {
  fetch('/ztapi/controller/network', {
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element: string) => {
        fetch('/ztapi/controller/network/' + element, {
          credentials: 'include',
        })
          .then((response) => response.json())
          .then((data) => {
            networks.value.push({
              id: data.id,
              name: data.name,
            })
          })
          .catch((error) => {
            showSnackBar('error', t('save_error'))
            console.error('There was an error!', error)
          })
      })
    })
    .catch((error) => {
      showSnackBar('error', t('save_error'))
      console.error('There was an error!', error)
    })
}

// Create a new network
const networkName = ref('')

const createNetwork = () => {
  fetch('/ztapi/controller/network', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: networkName.value,
      enableBroadcast: true,
      mtu: 1280,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      networks.value.push({
        id: data.id,
        name: data.name,
      })
    })
    .catch((error) => {
      showSnackBar('error', t('save_error'))
      console.error('There was an error!', error)
    })
}

// Delete a network
const dialogShow = ref(false)

const showDialog = (id: string) => {
  deleteNetworkId.value = id
  dialogShow.value = true
}
const deleteNetworkId = ref('')

const deleteNetwork = () => {
  if (deleteNetworkId.value === '') {
    return
  }

  fetch('/ztapi/controller/network/' + deleteNetworkId.value, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then(() => {
      networks.value = networks.value.filter((network) => network.id !== deleteNetworkId.value)
      dialogShow.value = false
      deleteNetworkId.value = ''
    })
    .catch((error) => {
      showSnackBar('error', t('save_error'))
      console.error('There was an error!', error)
    })
}

// Copy Network ID
const copyToClipboard = (content: string) => {
  const unsecuredCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
    } catch (error) {
      console.error('There was an error!', error)
    }
    document.body.removeChild(textArea)
  }
  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard.writeText(content)
    showSnackBar('success', t('copied'))
  } else {
    unsecuredCopyToClipboard(content)
    showSnackBar('success', t('copied'))
  }
}

onMounted(() => {
  getNetworks()
})
</script>

<template>
  <v-container>
    <v-row v-for="network in networks" :key="network.id">
      <v-col>
        <!-- Networks -->
        <v-card>
          <template v-slot:title>
            <p>{{ $t('network_name') }}</p>
            <p style="font-size: 30px">{{ network.name }}</p>
          </template>

          <template v-slot:subtitle>
            {{ $t('network_id') }}
            <v-btn variant="text" size="small" @click="copyToClipboard(network.id)">
              <v-icon icon="$copy" />
              {{ network.id }}
            </v-btn>
          </template>

          <template v-slot:actions>
            <div style="display: flex; justify-content: end; width: 100%; gap: 10px">
              <v-btn
                :text="$t('delete_network')"
                variant="tonal"
                @click="showDialog(network.id)"
                prepend-icon="$delete"
                color="red"
              ></v-btn>
              <v-btn
                :text="$t('enter_network')"
                variant="tonal"
                @click="router.push('/home/network/' + network.id)"
              ></v-btn>
            </div>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create a New Network -->
    <v-row>
      <v-col>
        <v-card>
          <template v-slot:title>
            {{ $t('create_network') }}
          </template>

          <template v-slot:text>
            <v-text-field
              :label="$t('network_name')"
              variant="outlined"
              max-width="400"
              v-model="networkName"
              @keyup.enter="createNetwork"
            ></v-text-field>
          </template>

          <template v-slot:actions>
            <div style="display: flex; justify-content: end; width: 100%; gap: 10px">
              <v-btn :text="$t('create')" variant="tonal" @click="createNetwork"></v-btn>
            </div>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Confirm Delete Network Dialog -->
  <v-dialog max-width="500" v-model="dialogShow">
    <v-card :title="$t('confirm_delete_network') + ' ' + deleteNetworkId + ' ' + '?'">
      <v-card-text>
        {{ $t('delete_network_tip') }}
      </v-card-text>

      <v-card-actions>
        <v-btn
          :text="$t('confirm_delete_network')"
          @click="deleteNetwork()"
          prepend-icon="$delete"
          variant="tonal"
          color="red"
        ></v-btn>
        <v-btn :text="$t('cancel')" @click="dialogShow = false" variant="tonal"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackBarShow" timeout="2000" location="top" :color="snackBarStatus">
    {{ snackBarText }}
  </v-snackbar>
</template>

<style></style>
