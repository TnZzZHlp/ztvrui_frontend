<script setup lang="ts">
import router from '@/router'
import { ref, onMounted } from 'vue'


// Edit network name
const editNetworkName = (name: string) => {
  console.log(name)
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
            console.error('There was an error!', error)
          })
      })
    })
    .catch((error) => {
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
      console.error('There was an error!', error)
    })
}

// Delete a network
const dialogShow = ref(false)
const deleteNetworkId = ref('')

const showDialog = (id: string) => {
  deleteNetworkId.value = id
  dialogShow.value = true
}

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
      console.error('There was an error!', error)
    })
}

// Copy Network ID
const unsecuredCopyToClipboard = (text: string) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    document.execCommand('copy')
  } catch (err) {
    console.error('Unable to copy to clipboard', err)
  }
  document.body.removeChild(textArea)
}

/**
 * Copies the text passed as param to the system clipboard
 * Check if using HTTPS and navigator.clipboard is available
 * Then uses standard clipboard API, otherwise uses fallback
 */
const copyToClipboard = (content: string) => {
  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard.writeText(content);
  } else {
    unsecuredCopyToClipboard(content)
  }
}


onMounted(() => {
  getNetworks()
})
</script>

<template>
  <div class="cards">
    <!-- Networks -->
    <v-card v-for="network in networks" :key="network.id">
      <template v-slot:title>
        {{ $t('network_name') }}
        <v-text-field variant="underlined" :width="400" @keyup.enter="editNetworkName(network.name)">
          {{ network.name }}
        </v-text-field>
      </template>

      <template v-slot:subtitle>
        {{ $t('network_id') }}
        <v-btn variant="text" size="small" @click="copyToClipboard(network.id)">
          <v-icon icon="$copy" />
          {{ network.id }}
          <v-tooltip activator="parent" location="end" open-on-click :open-on-hover='false'>
            {{ $t('copied') }}
          </v-tooltip>
        </v-btn>
      </template>

      <template v-slot:actions>
        <div style="display: flex; justify-content: end; width: 100%; gap: 10px">
          <v-btn :text="$t('delete_network')" variant="tonal" @click="showDialog(network.id)" prepend-icon="$delete"
            color="red"></v-btn>
          <v-btn :text="$t('enter_network')" variant="tonal"
            @click="router.push('/home/network/' + network.id)"></v-btn>
        </div>
      </template>
    </v-card>

    <!-- Create a New Network -->
    <v-card>
      <template v-slot:title>
        {{ $t('create_network') }}
      </template>


      <template v-slot:text>
        <v-text-field :label="$t('network_name')" variant="outlined" max-width="400" v-model="networkName"
          @keyup.enter="createNetwork"></v-text-field>
      </template>

      <template v-slot:actions>
        <div style="display: flex; justify-content: end; width: 100%; gap: 10px">
          <v-btn :text="$t('create')" variant="tonal" @click="createNetwork"></v-btn>
        </div>
      </template>
    </v-card>


    <!-- Confirm Delete Network Dialog -->
    <v-dialog max-width="500" v-model="dialogShow">
      <v-card :title="$t('confirm_delete_network') + ' ' + deleteNetworkId + ' ' + '?'">
        <v-card-text>
          {{ $t('delete_network_tip') }}
        </v-card-text>

        <v-card-actions>
          <v-btn :text="$t('confirm_delete_network')" @click="deleteNetwork()" prepend-icon="delete"
            color="red"></v-btn>
          <v-btn :text="$t('cancel')" @click="dialogShow = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style>
.cards {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

.cards>* {
  width: calc(100% - 20px);
  margin: 10px;
}
</style>
