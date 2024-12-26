<script setup lang="ts">
import { ref, onMounted, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  network: Object,
})

const { network } = toRefs(props)

const network_members = ref<Request[]>([])

const snackbarShow = ref(false)
const snackbarText = ref('')

const headers = ref([
  { title: t('authorized'), key: 'authorized' },
  { title: t('member_name'), key: 'name' },
  { title: t('member_id'), key: 'id' },
  { title: t('member_address'), key: 'address' },
  { title: t('actions'), key: 'actions' },
])

// Save member name
const saveMemberName = (item: Request) => {
  snackbarShow.value = true
  snackbarText.value = t('save_success')
  fetch(`/ztapi/controller/network/` + item.nwid + `/member/` + item.id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: item.name,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })
    .catch((err) => {
      console.error(err)
    })
}

// Authorize member
const Authorize = (item: Request) => {
  item.authorized = !item.authorized

  fetch(`/ztapi/controller/network/` + item.nwid + `/member/` + item.id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      authorized: item.authorized,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })
    .catch((err) => {
      console.error(err)
    })
}

/**
 * Request
 */
export interface Request {
  activeBridge: boolean
  address: string
  authenticationExpiryTime: number
  authorized: boolean
  capabilities: number[]
  creationTime: number
  id: string
  identity: string
  ipAssignments: string[]
  lastAuthorizedCredential: string
  lastAuthorizedCredentialType: string
  lastAuthorizedTime: number
  lastDeauthorizedTime: number
  name: string
  noAutoAssignIps: boolean
  nwid: string
  objtype: string
  remoteTraceLevel: number
  remoteTraceTarget: string
  revision: number
  ssoExempt: boolean
  tags: null
  vMajor: number
  vMinor: number
  vProto: number
  vRev: number
}

onMounted(() => {
  fetch(`/ztapi/controller/network/` + network.value.id + `/member`)
    .then((res) => res.json())
    .then((data) => {
      Object.keys(data).forEach((member: string) => {
        fetch(`/ztapi/controller/network/` + network.value.id + `/member/` + member)
          .then((res) => res.json())
          .then((data) => {
            network_members.value.push(data)
          })
      })
    })
    .catch((err) => {
      console.error(err)
    })
})
</script>

<template>
  <v-data-table-virtual :headers="headers" :items="network_members">
    <template v-slot:top>
      <v-text-field variant="underlined" append-inner-icon="$search"></v-text-field>
    </template>

    <template v-slot:item.authorized="{ item }">
      <v-checkbox :model-value="item.authorized" @click="Authorize(item)"></v-checkbox>
    </template>

    <template v-slot:item.name="{ item }">
      <v-text-field
        variant="underlined"
        v-model="item.name"
        append-inner-icon="$save"
        @click:appendInner="saveMemberName(item)"
      >
      </v-text-field>
    </template>

    <template v-slot:item.id="{ item }">
      <v-chip color="primary" small>{{ item.id }}</v-chip>
    </template>

    <template v-slot:item.address="{ item }">
      <v-btn v-for="ip in item.ipAssignments" append-icon="$copy" variant="text">{{ ip }}</v-btn>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn class="me-2" size="small" icon="$edit" @click="console.log('click')"></v-btn>
      <v-btn size="small" icon="$delete" @click="console.log('click')"></v-btn>
    </template>

    <template v-slot:no-data> </template>
  </v-data-table-virtual>

  <v-snackbar v-model="snackbarShow" timeout="2000" location="top" color="success">
    {{ snackbarText }}
  </v-snackbar>
</template>
